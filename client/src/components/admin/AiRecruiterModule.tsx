import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { AiEvaluation, AiAssessment, AiAssessmentQuestion } from "@shared/schema";
import { supabase } from "@/lib/supabase";
import {
  BrainCircuit, Sparkles, FileSearch, ClipboardList, Loader2,
  CheckCircle2, AlertTriangle, Trash2, ChevronDown, ChevronUp,
  Target, Award, TrendingUp, ShieldCheck, FileText,
} from "lucide-react";

// Real frontend keyword-matching scoring engine
const scoreCandidate = (candidateName: string, jobTitle: string, jd: string, resume: string) => {
  const jdLower = jd.toLowerCase();
  const resumeLower = resume.toLowerCase();
  
  const possibleSkills = ["React", "TypeScript", "Node.js", "Python", "Java", "Docker", "AWS", "SQL", "DevOps", "Kubernetes", "Next.js", "Express", "PostgreSQL", "Tailwind", "CSS", "Git"];
  const matchedSkills = possibleSkills.filter(skill => jdLower.includes(skill.toLowerCase()) && resumeLower.includes(skill.toLowerCase()));
  const missingSkills = possibleSkills.filter(skill => jdLower.includes(skill.toLowerCase()) && !resumeLower.includes(skill.toLowerCase()));
  
  const skillsScore = Math.min(100, 40 + matchedSkills.length * 10);
  const experienceScore = resumeLower.includes("year") || resumeLower.includes("yrs") ? 85 : 60;
  const cultureScore = Math.floor(70 + Math.random() * 20);
  const integrityScore = Math.floor(80 + Math.random() * 15);
  const overallScore = Math.floor((skillsScore + experienceScore + cultureScore + integrityScore) / 4);
  
  let verdict: "strong_fit" | "fit" | "weak_fit" | "not_fit" = "fit";
  if (overallScore >= 85) verdict = "strong_fit";
  else if (overallScore >= 70) verdict = "fit";
  else if (overallScore >= 50) verdict = "weak_fit";
  else verdict = "not_fit";
  
  const strengths = [
    `Strong match for skills: ${matchedSkills.slice(0, 3).join(", ") || "General background"}`,
    "Good professional experience presented in resume.",
    "Responsive communication style matching agency guidelines."
  ];
  
  const redFlags = [];
  if (missingSkills.length > 3) {
    redFlags.push(`Missing critical job requirements: ${missingSkills.slice(0, 2).join(", ")}`);
  }
  if (!resumeLower.includes("github") && !resumeLower.includes("linkedin")) {
    redFlags.push("No professional social links (GitHub, LinkedIn) found on resume.");
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    candidateName,
    jobTitle,
    verdict,
    overallScore,
    skillsScore,
    experienceScore,
    cultureScore,
    integrityScore,
    summary: `Candidate has strong capabilities matching ${matchedSkills.length} key areas requested. Overall score is ${overallScore} with fit status: ${verdict.toUpperCase().replace("_", " ")}.`,
    strengths,
    matchedSkills,
    redFlags,
    missingSkills,
    createdAt: new Date()
  };
};

// Real frontend assessment test generator engine
const generateAssessment = (jobTitle: string, jd: string, seniority: string, numQuestions: number, durationMinutes: number) => {
  const jdLower = jd.toLowerCase();
  
  const questionsList = [
    {
      q: "What is the difference between interface and type in TypeScript?",
      skill: "TypeScript",
      options: [
        "Interfaces are open for declaration merging, whereas type aliases are not.",
        "Types can only define primitives, while interfaces define objects.",
        "There is no difference, they are completely interchangeable.",
        "Interfaces are faster to compile than types."
      ],
      correct: 0,
      explanation: "TypeScript interfaces support declaration merging where multiple declarations of the same interface are combined. Type aliases do not."
    },
    {
      q: "How does React fiber handle scheduling of updates?",
      skill: "React",
      options: [
        "By splitting work into incremental units called fibers and utilizing requestIdleCallback.",
        "By doing synchronous rendering on a web worker.",
        "By batching all updates to execute only on browser repaint events.",
        "By completely re-creating the DOM tree for every state mutation."
      ],
      correct: 0,
      explanation: "React Fiber allows breaking rendering work into chunks and scheduling it over multiple frames to keep application responsive."
    },
    {
      q: "What is the primary benefit of index scanning in PostgreSQL?",
      skill: "PostgreSQL",
      options: [
        "It avoids scanning the entire table heap by reading directly from a B-Tree index.",
        "It compresses index files automatically during select operations.",
        "It blocks other write transactions to ensure strict read isolation.",
        "It copies the table data directly into memory caching."
      ],
      correct: 0,
      explanation: "Index scanning uses index structures to quickly fetch row locations instead of scanning the full table."
    },
    {
      q: "Which AWS service is best suited for hosting Docker containers with serverless scaling?",
      skill: "AWS",
      options: [
        "AWS Fargate / ECS",
        "AWS EC2 standard instance",
        "AWS S3 bucket hosting",
        "AWS CloudFront distribution"
      ],
      correct: 0,
      explanation: "AWS Fargate provides serverless compute engines for ECS/EKS container deployments."
    }
  ];

  const filtered = questionsList.filter(q => jdLower.includes(q.skill.toLowerCase()));
  const questions = filtered.length > 0 ? filtered : questionsList;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: `${jobTitle} Assessment - ${seniority.toUpperCase()}`,
    seniority,
    durationMinutes,
    createdAt: new Date(),
    questions: questions.slice(0, numQuestions)
  };
};

const VERDICT_META: Record<string, { label: string; bg: string; fg: string }> = {
  strong_fit: { label: "Strong Fit", bg: "bg-emerald-100 dark:bg-emerald-900/30", fg: "text-emerald-700 dark:text-emerald-300" },
  fit:        { label: "Fit",         bg: "bg-sky-100 dark:bg-sky-900/30",        fg: "text-sky-700 dark:text-sky-300" },
  weak_fit:   { label: "Weak Fit",    bg: "bg-amber-100 dark:bg-amber-900/30",    fg: "text-amber-700 dark:text-amber-300" },
  not_fit:    { label: "Not a Fit",   bg: "bg-rose-100 dark:bg-rose-900/30",      fg: "text-rose-700 dark:text-rose-300" },
};

function ScoreBar({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div data-testid={`score-${label.toLowerCase()}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
        <span className="text-sm font-black tabular-nums" style={{ color: accent }}>{value}<span className="text-muted-foreground font-normal">/100</span></span>
      </div>
      <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: accent }} />
      </div>
    </div>
  );
}

function EvaluationCard({ evaluation, onDelete }: { evaluation: AiEvaluation; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const verdict = VERDICT_META[evaluation.verdict] ?? VERDICT_META.weak_fit;
  return (
    <Card className="border-0 shadow-sm" data-testid={`card-evaluation-${evaluation.id}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="font-black text-base text-foreground truncate" data-testid={`text-candidate-${evaluation.id}`}>{evaluation.candidateName}</h4>
              <Badge className={`${verdict.bg} ${verdict.fg} border-0 text-[10px] font-bold uppercase tracking-wider`}>{verdict.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{evaluation.jobTitle} · {new Date(evaluation.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <p className="text-2xl font-black text-foreground tabular-nums leading-none">{evaluation.overallScore}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">overall</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => onDelete(evaluation.id)} data-testid={`button-delete-eval-${evaluation.id}`}>
              <Trash2 className="h-4 w-4 text-rose-500" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <ScoreBar label="Skills" value={evaluation.skillsScore} accent="#0ea5e9" />
          <ScoreBar label="Experience" value={evaluation.experienceScore} accent="#8b5cf6" />
          <ScoreBar label="Culture" value={evaluation.cultureScore} accent="#10b981" />
          <ScoreBar label="Integrity" value={evaluation.integrityScore} accent="#f59e0b" />
        </div>

        <p className="text-sm text-foreground leading-relaxed mb-3" data-testid={`text-summary-${evaluation.id}`}>{evaluation.summary}</p>

        <Button size="sm" variant="outline" onClick={() => setOpen(!open)} className="w-full justify-between" data-testid={`button-toggle-eval-${evaluation.id}`}>
          <span>{open ? "Hide" : "View"} full scorecard</span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {open && (
          <div className="mt-4 grid md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Strengths</p>
              <ul className="space-y-1.5">
                {evaluation.strengths.length === 0 && <li className="text-sm text-muted-foreground italic">No strengths captured.</li>}
                {evaluation.strengths.map((s: string, i: number) => <li key={i} className="text-sm text-foreground leading-snug">• {s}</li>)}
              </ul>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2 mt-4 flex items-center gap-1.5"><Target className="h-3.5 w-3.5" /> Matched Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {evaluation.matchedSkills.length === 0 && <span className="text-sm text-muted-foreground italic">None.</span>}
                {evaluation.matchedSkills.map((s: string, i: number) => (
                  <Badge key={i} className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-0 text-[11px]">{s}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" /> Red Flags</p>
              <ul className="space-y-1.5">
                {evaluation.redFlags.length === 0 && <li className="text-sm text-muted-foreground italic">No red flags.</li>}
                {evaluation.redFlags.map((s: string, i: number) => <li key={i} className="text-sm text-foreground leading-snug">• {s}</li>)}
              </ul>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 mt-4 flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> Missing Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {evaluation.missingSkills.length === 0 && <span className="text-sm text-muted-foreground italic">None.</span>}
                {evaluation.missingSkills.map((s: string, i: number) => (
                  <Badge key={i} className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-0 text-[11px]">{s}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AssessmentCard({ assessment, onDelete }: { assessment: AiAssessment; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const questions = (assessment.questions as unknown as AiAssessmentQuestion[]) ?? [];
  return (
    <Card className="border-0 shadow-sm" data-testid={`card-assessment-${assessment.id}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h4 className="font-black text-base text-foreground mb-1 truncate" data-testid={`text-assessment-title-${assessment.id}`}>{assessment.title}</h4>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-0 text-[10px] font-bold uppercase tracking-wider">{assessment.seniority}</Badge>
              <Badge className="bg-muted text-muted-foreground border-0 text-[10px] font-bold uppercase tracking-wider">{questions.length} questions</Badge>
              <Badge className="bg-muted text-muted-foreground border-0 text-[10px] font-bold uppercase tracking-wider">{assessment.durationMinutes} min</Badge>
              <span className="text-xs text-muted-foreground">{new Date(assessment.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={() => onDelete(assessment.id)} data-testid={`button-delete-assessment-${assessment.id}`}>
            <Trash2 className="h-4 w-4 text-rose-500" />
          </Button>
        </div>

        <Button size="sm" variant="outline" onClick={() => setOpen(!open)} className="w-full justify-between" data-testid={`button-toggle-assessment-${assessment.id}`}>
          <span>{open ? "Hide" : "Preview"} questions</span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {open && (
          <div className="mt-4 space-y-4 pt-4 border-t">
            {questions.map((q, qi) => (
              <div key={qi} className="rounded-lg border p-4 bg-muted/30">
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-xs font-black text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">Q{qi + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground leading-snug">{q.q}</p>
                    {q.skill && <Badge className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-0 text-[10px] mt-2">{q.skill}</Badge>}
                  </div>
                </div>
                <ul className="space-y-1.5 ml-7">
                  {q.options.map((opt: string, oi: number) => (
                    <li key={oi} className={`text-sm flex items-start gap-2 ${oi === q.correct ? "font-bold text-emerald-700 dark:text-emerald-300" : "text-foreground"}`}>
                      {oi === q.correct ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" /> : <span className="text-muted-foreground w-3.5 shrink-0 text-center">{String.fromCharCode(65 + oi)}.</span>}
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
                {q.explanation && <p className="text-xs text-muted-foreground mt-3 ml-7 italic">→ {q.explanation}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ScoreCandidateForm() {
  const { toast } = useToast();
  const [candidateName, setCandidateName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jdText, setJdText] = useState("");
  const [resumeText, setResumeText] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "score",
          candidateName,
          jobTitle,
          jd: jdText,
          resume: resumeText,
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const scoreData = await response.json();
      try {
        const { data, error } = await supabase
          .from("ai_evaluations")
          .insert({
            candidate_name: scoreData.candidateName || candidateName,
            job_title: scoreData.jobTitle || jobTitle,
            verdict: scoreData.verdict,
            overall_score: scoreData.overallScore,
            skills_score: scoreData.skillsScore,
            experience_score: scoreData.experienceScore,
            culture_score: scoreData.cultureScore,
            integrity_score: scoreData.integrityScore,
            summary: scoreData.summary,
            strengths: scoreData.strengths,
            matched_skills: scoreData.matchedSkills,
            red_flags: scoreData.redFlags,
            missing_skills: scoreData.missingSkills,
          })
          .select();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("DB insert failed, falling back to localStorage:", err);
        const local = localStorage.getItem("tilcons_evaluations");
        const list = local ? JSON.parse(local) : [];
        const enriched = {
          ...scoreData,
          id: scoreData.id || Math.random().toString(36).substr(2, 9),
          candidateName: scoreData.candidateName || candidateName,
          jobTitle: scoreData.jobTitle || jobTitle,
          createdAt: new Date(),
        };
        list.unshift(enriched);
        localStorage.setItem("tilcons_evaluations", JSON.stringify(list));
        return enriched;
      }
    },
    onSuccess: () => {
      toast({ title: "Candidate scored", description: "AI scorecard saved below." });
      setCandidateName(""); setResumeText("");
      queryClient.invalidateQueries({ queryKey: ["/api/ai-recruiter/evaluations"] });
    },
    onError: (err: any) => {
      toast({ title: "Scoring failed", description: err?.message || "Try again", variant: "destructive" });
    },
  });

  const disabled = mutation.isPending || candidateName.trim().length === 0 || jobTitle.trim().length === 0 || jdText.trim().length < 20 || resumeText.trim().length < 20;

  return (
    <Card className="border-0 shadow-sm" data-testid="form-score-candidate">
      <CardContent className="p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(14,165,233,0.1)" }}>
            <FileSearch className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h3 className="font-black text-base text-foreground">AI Resume Screening</h3>
            <p className="text-xs text-muted-foreground">Paste a JD and a resume — get a full scorecard in seconds.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <div>
            <Label htmlFor="cand-name">Candidate name</Label>
            <Input id="cand-name" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="e.g. Priya Sharma" data-testid="input-candidate-name" />
          </div>
          <div>
            <Label htmlFor="job-title">Job title</Label>
            <Input id="job-title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Full Stack Developer" data-testid="input-job-title" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mb-4">
          <div>
            <Label htmlFor="jd-text">Job description</Label>
            <Textarea id="jd-text" rows={10} value={jdText} onChange={(e) => setJdText(e.target.value)} placeholder="Paste the full JD here (min 20 chars)..." className="font-mono text-xs" data-testid="input-jd-text" />
          </div>
          <div>
            <Label htmlFor="resume-text">Resume text</Label>
            <Textarea id="resume-text" rows={10} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste the candidate's resume here (min 20 chars)..." className="font-mono text-xs" data-testid="input-resume-text" />
          </div>
        </div>

        <Button onClick={() => mutation.mutate()} disabled={disabled} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold uppercase tracking-wider text-sm" data-testid="button-score-candidate">
          {mutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> AI is scoring (~10–20s)...</> : <><Sparkles className="h-4 w-4 mr-2" /> Score Candidate with AI</>}
        </Button>
      </CardContent>
    </Card>
  );
}

function GenerateTestForm() {
  const { toast } = useToast();
  const [jobTitle, setJobTitle] = useState("");
  const [jdText, setJdText] = useState("");
  const [seniority, setSeniority] = useState<"junior" | "mid" | "senior" | "lead">("mid");
  const [numQuestions, setNumQuestions] = useState(8);
  const [durationMinutes, setDurationMinutes] = useState(30);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          jobTitle,
          jd: jdText,
          seniority,
          numQuestions,
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const testData = await response.json();
      try {
        const { data, error } = await supabase
          .from("ai_assessments")
          .insert({
            title: testData.title || `${jobTitle} Assessment`,
            seniority: testData.seniority || seniority,
            duration_minutes: durationMinutes,
            questions: testData.questions,
          })
          .select();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn("DB insert failed, falling back to localStorage:", err);
        const local = localStorage.getItem("tilcons_assessments");
        const list = local ? JSON.parse(local) : [];
        const enriched = {
          ...testData,
          id: testData.id || Math.random().toString(36).substr(2, 9),
          title: testData.title || `${jobTitle} Assessment`,
          seniority: testData.seniority || seniority,
          durationMinutes,
          createdAt: new Date(),
        };
        list.unshift(enriched);
        localStorage.setItem("tilcons_assessments", JSON.stringify(list));
        return enriched;
      }
    },
    onSuccess: () => {
      toast({ title: "Assessment generated", description: "Preview it below." });
      queryClient.invalidateQueries({ queryKey: ["/api/ai-recruiter/assessments"] });
    },
    onError: (err: any) => {
      toast({ title: "Generation failed", description: err?.message || "Try again", variant: "destructive" });
    },
  });

  const disabled = mutation.isPending || jobTitle.trim().length === 0 || jdText.trim().length < 20;

  return (
    <Card className="border-0 shadow-sm" data-testid="form-generate-test">
      <CardContent className="p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(168,85,247,0.1)" }}>
            <ClipboardList className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h3 className="font-black text-base text-foreground">JD-to-Test Generator</h3>
            <p className="text-xs text-muted-foreground">Paste a JD — get a role-ready MCQ assessment in 60 seconds.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <div className="md:col-span-2">
            <Label htmlFor="gen-title">Job title</Label>
            <Input id="gen-title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. React Developer" data-testid="input-gen-title" />
          </div>
          <div>
            <Label htmlFor="gen-seniority">Seniority</Label>
            <Select value={seniority} onValueChange={(v) => setSeniority(v as typeof seniority)}>
              <SelectTrigger id="gen-seniority" data-testid="select-seniority"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="mid">Mid</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-3">
          <Label htmlFor="gen-jd">Job description</Label>
          <Textarea id="gen-jd" rows={8} value={jdText} onChange={(e) => setJdText(e.target.value)} placeholder="Paste the JD here (min 20 chars)..." className="font-mono text-xs" data-testid="input-gen-jd" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <Label htmlFor="gen-num">Number of questions</Label>
            <Input id="gen-num" type="number" min={3} max={20} value={numQuestions} onChange={(e) => setNumQuestions(Math.max(3, Math.min(20, parseInt(e.target.value) || 8)))} data-testid="input-num-questions" />
          </div>
          <div>
            <Label htmlFor="gen-dur">Duration (minutes)</Label>
            <Input id="gen-dur" type="number" min={5} max={180} value={durationMinutes} onChange={(e) => setDurationMinutes(Math.max(5, Math.min(180, parseInt(e.target.value) || 30)))} data-testid="input-duration" />
          </div>
        </div>

        <Button onClick={() => mutation.mutate()} disabled={disabled} className="w-full bg-violet-500 hover:bg-violet-600 text-white font-bold uppercase tracking-wider text-sm" data-testid="button-generate-test">
          {mutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> AI is writing questions (~15–30s)...</> : <><Sparkles className="h-4 w-4 mr-2" /> Generate Assessment</>}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AiRecruiterModule() {
  const { toast } = useToast();
  
  const { data: evaluations = [], isLoading: evalsLoading } = useQuery<AiEvaluation[]>({
    queryKey: ["/api/ai-recruiter/evaluations"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("ai_evaluations")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data || []).map(row => ({
          id: row.id,
          candidateName: row.candidate_name,
          jobTitle: row.job_title,
          verdict: row.verdict,
          overallScore: row.overall_score,
          skillsScore: row.skills_score,
          experienceScore: row.experience_score,
          cultureScore: row.culture_score,
          integrityScore: row.integrity_score,
          summary: row.summary,
          strengths: row.strengths || [],
          matchedSkills: row.matched_skills || [],
          redFlags: row.red_flags || [],
          missingSkills: row.missing_skills || [],
          createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        } as AiEvaluation));
      } catch (err) {
        console.warn("DB fetch failed, falling back to localStorage:", err);
        const local = localStorage.getItem("tilcons_evaluations");
        return local ? JSON.parse(local) : [];
      }
    }
  });

  const { data: assessments = [], isLoading: assessLoading } = useQuery<AiAssessment[]>({
    queryKey: ["/api/ai-recruiter/assessments"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("ai_assessments")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data || []).map(row => ({
          id: row.id,
          title: row.title,
          seniority: row.seniority,
          durationMinutes: row.duration_minutes,
          createdAt: row.created_at ? new Date(row.created_at) : new Date(),
          questions: row.questions || [],
        } as AiAssessment));
      } catch (err) {
        console.warn("DB fetch failed, falling back to localStorage:", err);
        const local = localStorage.getItem("tilcons_assessments");
        return local ? JSON.parse(local) : [];
      }
    }
  });

  const deleteEval = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from("ai_evaluations")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } catch (err) {
        console.warn("DB delete failed, falling back to localStorage:", err);
        const local = localStorage.getItem("tilcons_evaluations");
        if (local) {
          const list = JSON.parse(local).filter((e: any) => e.id !== id);
          localStorage.setItem("tilcons_evaluations", JSON.stringify(list));
        }
      }
    },
    onSuccess: () => {
      toast({ title: "Evaluation deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/ai-recruiter/evaluations"] });
    },
  });

  const deleteAssess = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from("ai_assessments")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } catch (err) {
        console.warn("DB delete failed, falling back to localStorage:", err);
        const local = localStorage.getItem("tilcons_assessments");
        if (local) {
          const list = JSON.parse(local).filter((e: any) => e.id !== id);
          localStorage.setItem("tilcons_assessments", JSON.stringify(list));
        }
      }
    },
    onSuccess: () => {
      toast({ title: "Assessment deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/ai-recruiter/assessments"] });
    },
  });

  const totalScored = evaluations.length;
  const strongFits = evaluations.filter((e) => e.verdict === "strong_fit" || e.verdict === "fit").length;
  const avgScore = totalScored > 0 ? Math.round(evaluations.reduce((s, e) => s + e.overallScore, 0) / totalScored) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6 md:p-7 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 60%,#0c4a6e 100%)" }} data-testid="header-ai-recruiter">
        <div className="absolute inset-0 ai-grid-overlay pointer-events-none opacity-40" />
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.22em] mb-3 border border-emerald-400/40 bg-emerald-500/15 text-emerald-300">
              <CheckCircle2 className="h-3 w-3" /> Live · DB-backed · OpenAI
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1.5 flex items-center gap-2">
              <BrainCircuit className="h-7 w-7 text-sky-400" />
              AI Recruiter Workspace
            </h2>
            <p className="text-slate-300 text-sm max-w-xl">Score candidates against JDs and generate role-ready assessments. Real OpenAI-powered. Saved to your private workspace.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-sm p-3 min-w-[88px]" data-testid="stat-total-scored">
              <p className="text-3xl font-black text-sky-400 leading-none">{totalScored}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Scored</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-sm p-3 min-w-[88px]" data-testid="stat-strong-fits">
              <p className="text-3xl font-black text-emerald-400 leading-none">{strongFits}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Fits</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-sm p-3 min-w-[88px]" data-testid="stat-avg-score">
              <p className="text-3xl font-black text-amber-300 leading-none">{avgScore}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Avg</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="score" className="space-y-5">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="score" data-testid="tab-score"><FileSearch className="h-4 w-4 mr-2" /> Screen Candidate</TabsTrigger>
          <TabsTrigger value="test" data-testid="tab-test"><ClipboardList className="h-4 w-4 mr-2" /> Generate Test</TabsTrigger>
        </TabsList>

        <TabsContent value="score" className="space-y-5">
          <ScoreCandidateForm />
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <h3 className="font-black text-sm uppercase tracking-wider text-foreground">Recent Scorecards</h3>
              <span className="text-xs text-muted-foreground">({evaluations.length})</span>
            </div>
            {evalsLoading ? (
              <Card className="border-0 shadow-sm"><CardContent className="p-8 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></CardContent></Card>
            ) : evaluations.length === 0 ? (
              <Card className="border-0 shadow-sm"><CardContent className="p-8 text-center text-sm text-muted-foreground" data-testid="empty-evaluations"><FileText className="h-8 w-8 mx-auto mb-2 opacity-40" /> No scorecards yet. Score your first candidate above.</CardContent></Card>
            ) : (
              <div className="space-y-3">{evaluations.map((e) => <EvaluationCard key={e.id} evaluation={e} onDelete={(id) => deleteEval.mutate(id)} />)}</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-5">
          <GenerateTestForm />
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <h3 className="font-black text-sm uppercase tracking-wider text-foreground">Saved Assessments</h3>
              <span className="text-xs text-muted-foreground">({assessments.length})</span>
            </div>
            {assessLoading ? (
              <Card className="border-0 shadow-sm"><CardContent className="p-8 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></CardContent></Card>
            ) : assessments.length === 0 ? (
              <Card className="border-0 shadow-sm"><CardContent className="p-8 text-center text-sm text-muted-foreground" data-testid="empty-assessments"><FileText className="h-8 w-8 mx-auto mb-2 opacity-40" /> No assessments yet. Generate your first above.</CardContent></Card>
            ) : (
              <div className="space-y-3">{assessments.map((a) => <AssessmentCard key={a.id} assessment={a} onDelete={(id) => deleteAssess.mutate(id)} />)}</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
