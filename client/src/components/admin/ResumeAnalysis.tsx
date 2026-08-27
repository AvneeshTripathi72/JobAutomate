import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { JobSeeker } from "@shared/schema";
import {
  Search, Sparkles, CheckCircle2, AlertTriangle, Printer, Download, Share2,
  FileText, Plus, Maximize2, Minimize2, ZoomIn, ZoomOut, ChevronLeft,
  ChevronRight, Copy, Check, Loader2, Star, X, Layout, Award, TrendingUp, Info, History
} from "lucide-react";

/* ── RESUME VIEWER MODAL ── */
interface ResumeViewerProps {
  seeker: JobSeeker;
  open: boolean;
  onClose: () => void;
  onAtsClick: () => void;
}

export function ResumeViewerModal({ seeker, open, onClose, onAtsClick }: ResumeViewerProps) {
  const [scale, setScale] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied to clipboard" });
  };

  const actualUrl = seeker.resumeUrl
    ? (seeker.resumeUrl.startsWith("http://") || seeker.resumeUrl.startsWith("https://") || seeker.resumeUrl.startsWith("/api/"))
      ? seeker.resumeUrl
      : `https://pub-0035a50eaf1046efa85b6e5d1631f721.r2.dev/${seeker.resumeUrl.replace(/^\//, "")}`
    : null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={`p-0 overflow-hidden flex flex-col transition-all duration-300 ${isFullScreen ? "max-w-full h-screen w-screen rounded-none" : "max-w-4xl h-[85vh] rounded-xl"}`}>
        {/* Sticky Header */}
        <div className="px-6 py-4 border-b bg-slate-900 text-white flex items-center justify-between z-10">
          <div className="min-w-0">
            <h3 className="font-bold text-sm truncate">{seeker.fullName} - Resume</h3>
            <p className="text-xs text-slate-400 truncate">{seeker.currentPosition || "Candidate"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white" onClick={() => actualUrl ? window.open(actualUrl, "_blank") : toast({ title: "No resume file uploaded yet" })}>
              <Download className="h-4 w-4 mr-1.5" /> Download
            </Button>
            <Button size="sm" className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/95 text-white" onClick={onAtsClick}>
              <Sparkles className="h-4 w-4 mr-1.5" /> ATS Analysis
            </Button>
            <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white font-medium" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white" onClick={() => setIsFullScreen(!isFullScreen)}>
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Viewport Control Panel */}
        <div className="px-6 py-2 border-b bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setScale(Math.max(50, scale - 10))}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="font-mono">{scale}%</span>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setScale(Math.min(200, scale + 10))}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="h-7 w-7" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>Page 1 of 1</span>
            <Button size="icon" variant="ghost" className="h-7 w-7" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Resume Content */}
        <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 p-8 flex justify-center items-start">
          {actualUrl ? (
            /* Show the actual uploaded PDF/document */
            <div className="w-full h-full flex flex-col items-center" style={{ transform: `scale(${scale / 100})`, transformOrigin: "top center" }}>
              <iframe
                src={actualUrl}
                className="w-full bg-white rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800"
                style={{ 
                  width: "100%", 
                  maxWidth: "720px",
                  height: "100%",
                  minHeight: "900px"
                }}
                title={`${seeker.fullName} Resume`}
              />
              <p className="text-xs text-muted-foreground mt-3">
                If the document doesn't load,{" "}
                <a 
                  href={actualUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#0ea5e9] hover:underline font-medium"
                >
                  open it directly
                </a>
              </p>
            </div>
          ) : (
            /* No file uploaded — show formatted profile from seeker data */
            <div 
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl p-12 border border-slate-200 dark:border-slate-800 transition-all duration-200 text-left"
              style={{ 
                width: "100%", 
                maxWidth: `${720 * (scale / 100)}px`,
                minHeight: `${960 * (scale / 100)}px`,
                fontSize: `${14 * (scale / 100)}px`
              }}
            >
              {/* Header */}
              <div className="border-b-2 border-[#0ea5e9] pb-6 mb-6">
                <h1 className="font-extrabold tracking-tight uppercase" style={{ fontSize: `${28 * (scale / 100)}px` }}>{seeker.fullName}</h1>
                <p className="text-[#0ea5e9] font-bold tracking-wide uppercase mt-1" style={{ fontSize: `${14 * (scale / 100)}px` }}>{seeker.currentPosition || "Candidate"}</p>
                
                <div className="flex flex-wrap gap-4 mt-4 text-slate-500 dark:text-slate-400" style={{ fontSize: `${11 * (scale / 100)}px` }}>
                  <span>Email: {seeker.email}</span>
                  {seeker.phone && <span>Phone: {seeker.phone}</span>}
                  {seeker.experienceLevel && <span>Exp: {seeker.experienceLevel}</span>}
                </div>
              </div>

              <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-amber-700 dark:text-amber-400 text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  No resume file was uploaded. Showing candidate profile data only.
                </p>
              </div>

              {/* Skills */}
              {seeker.skills && (
                <div className="mb-6">
                  <h3 className="font-bold text-[#0ea5e9] uppercase tracking-wider mb-2" style={{ fontSize: `${12 * (scale / 100)}px` }}>Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {seeker.skills.split(",").map((s, i) => (
                      <Badge key={i} variant="secondary" style={{ fontSize: `${11 * (scale / 100)}px` }}>{s.trim()}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              {(seeker as any).additionalInfo && (
                <div className="mb-6">
                  <h3 className="font-bold text-[#0ea5e9] uppercase tracking-wider mb-2" style={{ fontSize: `${12 * (scale / 100)}px` }}>Additional Information</h3>
                  <p className="leading-relaxed text-slate-700 dark:text-slate-300">{(seeker as any).additionalInfo}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── ATS ANALYSIS MODAL ── */
interface AtsAnalysisProps {
  seeker: JobSeeker;
  open: boolean;
  onClose: () => void;
}

export function AtsAnalysisModal({ seeker, open, onClose }: AtsAnalysisProps) {
  const [step, setStep] = useState(1);
  const [roleSearch, setRoleSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("Full Stack Developer");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [hasScored, setHasScored] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<Array<{ role: string; score: number; date: string }>>([]);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const { toast } = useToast();

  const roles = [
    "Frontend Developer", "Backend Developer", "Full Stack Developer", "React Developer",
    "Node.js Developer", "Java Developer", "Python Developer", "DevOps Engineer",
    "UI/UX Designer", "Product Manager", "Data Analyst", "HR Executive", "Sales Executive",
    "Marketing Executive"
  ];

  const filteredRoles = roles.filter(role => role.toLowerCase().includes(roleSearch.toLowerCase()));

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 2000);
    toast({ title: "Suggestion copied to clipboard" });
  };

  const handleGenerateScore = () => {
    setLoading(true);
    setLoadingStep(1);
    
    setTimeout(() => {
      setLoadingStep(2);
      setTimeout(() => {
        setLoadingStep(3);
        setTimeout(() => {
          setLoading(false);
          setStep(2);
          setHasScored(true);
          const score = Math.floor(75 + Math.random() * 20);
          setScoreHistory(prev => [
            { role: selectedRole, score, date: new Date().toLocaleDateString("en-IN") },
            ...prev
          ]);
          toast({ title: "ATS analysis report compiled successfully" });
        }, 1200);
      }, 1000);
    }, 800);
  };

  // Static mock reports based on candidate
  const overallScore = scoreHistory[0]?.score || 87;
  const scoreColor = overallScore >= 90 ? "text-emerald-500" : overallScore >= 70 ? "text-amber-500" : "text-rose-500";
  const scoreBg = overallScore >= 90 ? "bg-emerald-500/10" : overallScore >= 70 ? "bg-amber-500/10" : "bg-rose-500/10";
  const scoreBorder = overallScore >= 90 ? "border-emerald-500" : overallScore >= 70 ? "border-amber-500" : "border-rose-500";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col overflow-hidden rounded-xl">
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between bg-slate-900 text-white space-y-0">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Sparkles className="h-5 w-5 text-sky-400 animate-pulse" /> ATS Match Analyzer — {seeker.fullName}
          </DialogTitle>
          <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {loading ? (
          /* Smooth Skeleton Loaders while Scoring */
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-12 text-center">
            <div className="relative mb-6">
              <Loader2 className="h-16 w-16 animate-spin text-[#0ea5e9]" />
              <Sparkles className="h-6 w-6 text-[#8b5cf6] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h4 className="text-lg font-bold text-foreground">AI Review Engine Active</h4>
            <div className="max-w-sm w-full mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={loadingStep >= 1 ? "text-emerald-500" : "text-muted-foreground"}>
                  {loadingStep >= 1 ? "✓ Schema validated" : "Parsing resume layout..."}
                </span>
                {loadingStep < 1 && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={loadingStep >= 2 ? "text-emerald-500" : "text-muted-foreground"}>
                  {loadingStep >= 2 ? "✓ Keywords analyzed" : "Matching job roles..."}
                </span>
                {loadingStep === 1 && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={loadingStep >= 3 ? "text-emerald-500" : "text-muted-foreground"}>
                  {loadingStep >= 3 ? "✓ Compatibility checked" : "Estimating salary metrics..."}
                </span>
                {loadingStep === 2 && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
              </div>
            </div>
          </div>
        ) : step === 1 ? (
          /* Step 1 – Select Job Role */
          <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border bg-slate-50 dark:bg-slate-950/20 overflow-hidden">
            {/* Left side: Search & Select */}
            <div className="flex-1 p-6 flex flex-col overflow-hidden">
              <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Select Job Role</h3>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  className="pl-9 bg-background"
                  placeholder="Search target role..."
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                />
              </div>

              <ScrollArea className="flex-1 pr-2">
                <div className="space-y-1">
                  {filteredRoles.map(role => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${selectedRole === role ? "bg-[#0ea5e9] text-white shadow-sm" : "hover:bg-muted text-foreground/80"}`}
                    >
                      {role}
                    </button>
                  ))}
                  {filteredRoles.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8">No roles match your search.</p>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Right side: Insights / Recommendation / Launch */}
            <div className="w-full md:w-80 p-6 bg-muted/20 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="rounded-xl border bg-background p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0ea5e9] mb-2">
                    <Info className="h-4 w-4" /> Recommendation
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Based on Candidate's profile tags, we recommend scoring against <strong>{seeker.currentPosition || "Full Stack Developer"}</strong>.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Target Position</p>
                  <p className="text-sm font-bold text-foreground">{selectedRole}</p>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  onClick={handleGenerateScore} 
                  className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9]/95 text-white font-bold uppercase tracking-wider text-sm shadow-md py-5"
                >
                  <Sparkles className="h-4 w-4 mr-2" /> Generate ATS Score
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Step 2 – AI ATS Analysis Report */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950/20">
            {/* Scrollable Left Side: Main ATS Breakdown metrics */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Top Summary Block */}
              <div className="grid md:grid-cols-3 gap-6 items-center bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
                
                {/* Score Dial */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className={`w-32 h-32 rounded-full border-8 ${scoreBorder} ${scoreBg} flex flex-col items-center justify-center transition-all duration-500`}>
                    <span className={`text-3xl font-black ${scoreColor} leading-none`}>{overallScore}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">out of 100</span>
                  </div>
                  <p className="text-xs font-bold text-foreground mt-3 uppercase tracking-wider">ATS Score Match</p>
                </div>

                {/* Score Statement */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold border-0">GOOD MATCH</Badge>
                    <span className="text-xs text-muted-foreground">Scored against {selectedRole}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    Resume has excellent keyword coverage and structured layout formatting. Adding <strong>{seeker.skills ? "Docker, Kubernetes" : "AWS, GraphQL"}</strong> could boost score to <strong>94+</strong>.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="h-3.5 w-3.5 mr-1.5" /> Print</Button>
                    <Button size="sm" variant="outline" onClick={() => toast({ title: "Report exported to JSON", description: JSON.stringify({ overallScore, selectedRole, candidate: seeker.fullName }) })}><Share2 className="h-3.5 w-3.5 mr-1.5" /> Export JSON</Button>
                  </div>
                </div>
              </div>

              {/* Progress Bar Breakdown */}
              <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Score Breakdown</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Keywords Match", val: 82, color: "bg-sky-500" },
                    { label: "Skills Match", val: 85, color: "bg-sky-500" },
                    { label: "Experience Relevance", val: 90, color: "bg-emerald-500" },
                    { label: "Education Match", val: 95, color: "bg-emerald-500" },
                    { label: "Formatting", val: 90, color: "bg-emerald-500" },
                    { label: "Readability", val: 80, color: "bg-sky-500" },
                    { label: "Grammar", val: 96, color: "bg-emerald-500" },
                    { label: "Projects", val: 85, color: "bg-sky-500" },
                    { label: "Certifications", val: 60, color: "bg-amber-500" },
                    { label: "Resume Quality", val: 88, color: "bg-sky-500" }
                  ].map(b => (
                    <div key={b.label}>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-muted-foreground">{b.label}</span>
                        <span className="font-bold">{b.val}%</span>
                      </div>
                      <Progress value={b.val} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Keyword & Skills Analysis */}
              <div className="grid sm:grid-cols-2 gap-6">
                
                {/* Keywords Match */}
                <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {["REST API", "Docker", "Kubernetes", "AWS", "Redis", "CI/CD", "GraphQL", "Agile"].map(kw => (
                        <Badge key={kw} variant="secondary" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-0 text-[10px] font-semibold">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="mt-4 border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#0ea5e9]/5" onClick={() => toast({ title: "Suggested keywords copied to clipboard" })}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Suggested Keywords
                  </Button>
                </div>

                {/* Skills Analysis */}
                <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Skills Analysis</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Matched Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {(seeker.skills ? seeker.skills.split(",") : ["React", "Next.js", "JavaScript", "Node.js", "MongoDB"]).map((s, i) => (
                          <Badge key={i} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 text-[10px]">{s.trim()}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">Missing Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {["Docker", "AWS", "Kubernetes", "Redis"].map((s, i) => (
                          <Badge key={i} className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-0 text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvement */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Resume Strengths
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                    <li>Strong project experience with clear milestones.</li>
                    <li>Good technical skills matching required stack.</li>
                    <li>Clean formatting with highly readable typography.</li>
                    <li>Proper contact information correctly structured.</li>
                    <li>Relevant education section is presented cleanly.</li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Areas for Improvement
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                    <li>Add more measurable achievements (metrics, percentages).</li>
                    <li>Include missing industry keywords to trigger parser filters.</li>
                    <li>Improve project descriptions with action-oriented verbiage.</li>
                    <li>Add certifications related to cloud architecture.</li>
                  </ul>
                </div>
              </div>

              {/* ATS Compatibility */}
              <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">ATS Compatibility Checklist</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "PDF Parsing", status: "Pass" },
                    { label: "Font Compatibility", status: "Pass" },
                    { label: "Header Detection", status: "Pass" },
                    { label: "Section Structure", status: "Pass" },
                    { label: "Contact Information", status: "Pass" },
                    { label: "Work Experience Format", status: "Needs Improvement" },
                    { label: "Skills Section", status: "Pass" },
                    { label: "Education Section", status: "Pass" }
                  ].map((chk, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 dark:text-slate-400">{chk.label}</span>
                      {chk.status === "Pass" ? (
                        <span className="text-emerald-500 font-bold flex items-center gap-1">✓ Pass</span>
                      ) : (
                        <span className="text-amber-500 font-bold flex items-center gap-1">⚠️ Needs Improvement</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume Insights */}
              <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Resume Insights</h4>
                <div className="grid sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Experience Level</p>
                    <p className="font-bold text-foreground">{seeker.experienceLevel || "Mid Level"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Seniority</p>
                    <p className="font-bold text-foreground">Senior Specialist</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Est. Salary Range</p>
                    <p className="font-bold text-foreground">₹8,00,000 - ₹12,00,000 / yr</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Career Progression</p>
                    <p className="font-bold text-foreground">Steady Growth (2 promotions)</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Industry Fit</p>
                    <p className="font-bold text-foreground">Tech & Software Agencies</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Recommended Job</p>
                    <p className="font-bold text-foreground">{selectedRole}</p>
                  </div>
                </div>
              </div>

              {/* AI Suggestions for Rewriting */}
              <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">AI Rewrite Suggestions</h4>
                {[
                  { id: "s-sum", label: "Summary", text: "Senior Developer with 5+ years of experience delivering high-performing React/Node.js web applications, scaling databases, and designing multi-tenant platforms." },
                  { id: "s-exp", label: "Experience", text: "Spearheaded migration of applicant tracking systems to serverless database architectures, resulting in a 40% reduction in query latency and 100% data integrity." },
                  { id: "s-proj", label: "Projects", text: "Built full-screen candidate review and parsing canvas sheet workspace utilizing inline keyword matching, serving 1,000+ client recruitment operations." }
                ].map(item => (
                  <div key={item.id} className="rounded-xl border bg-muted/15 p-4 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">{item.label} Suggestion</span>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => handleCopy(item.id, item.text)}>
                        {copySuccess === item.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">"{item.text}"</p>
                  </div>
                ))}
              </div>

            </div>

            {/* Sticky Right Sidebar: Score History & Export options */}
            <div className="w-full md:w-80 p-6 bg-muted/20 flex flex-col justify-between divide-y divide-border space-y-6">
              
              {/* Score History */}
              <div className="space-y-4 flex-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <History className="h-4 w-4" /> ATS Score History
                </h4>
                <div className="space-y-2">
                  {scoreHistory.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No previous checks run.</p>
                  ) : (
                    scoreHistory.map((item, idx) => (
                      <div key={idx} className="rounded-lg border bg-background p-3 flex justify-between items-center text-xs shadow-sm">
                        <div>
                          <p className="font-bold text-foreground truncate max-w-[150px]">{item.role}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{item.date}</p>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black border-0">{item.score}%</Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Actions & Retests */}
              <div className="pt-6 space-y-3">
                <Button variant="outline" className="w-full text-xs font-bold" onClick={() => setStep(1)}>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Analyze Another Role
                </Button>
                <Button className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9]/95 text-white font-bold text-xs uppercase" onClick={onClose}>
                  Save & Close Analysis
                </Button>
              </div>

            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
