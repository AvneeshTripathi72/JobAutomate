import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import {
  ArrowRight,
  BrainCircuit,
  Sparkles,
  Target,
  Zap,
  ShieldCheck,
  FileSearch,
  ClipboardList,
  Eye,
  Mic,
  Code2,
  CalendarClock,
  MessageSquare,
  UserCheck,
  CheckCircle2,
  Upload,
  PlayCircle,
  BarChart3,
  Clock,
  Award,
  Workflow,
  Search,
  Wand2,
  Languages,
  Network,
  Share2,
  TrendingUp,
  FileCheck2,
  Gauge,
  Layers,
} from "lucide-react";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

const stats = [
  { value: "48h", label: "First shortlist" },
  { value: "10x", label: "Faster shortlisting" },
  { value: "3×",  label: "Faster TAT with AI matching" },
  { value: "60%", label: "Less data-entry admin" },
  { value: "95%", label: "Recruiter satisfaction" },
  { value: "100+", label: "Free trial screens" },
];

const capabilities = [
  {
    icon: FileSearch,
    title: "AI Resume Screening",
    description:
      "Upload 1,000 resumes — get a ranked shortlist in minutes. AI scores every applicant on JD-fit, skills, and experience with explainable reasoning.",
    quarter: "Live (beta)",
  },
  {
    icon: ClipboardList,
    title: "JD-to-Test Generation",
    description:
      "Paste a job description, get a role-ready assessment in 60 seconds. No manual question writing. Tailored to seniority, stack, and domain.",
    quarter: "Live (beta)",
  },
  {
    icon: Eye,
    title: "Proctored Assessments",
    description:
      "Anti-cheating proctoring with session recording, screen-lock, tab-switch detection, face-presence and integrity scoring. Trust every score.",
    quarter: "Q3 2026",
  },
  {
    icon: Mic,
    title: "AI Voice Interviews",
    description:
      "Autonomous AI calls candidates, asks role-specific questions, follows up on weak answers, transcribes everything and produces a scorecard.",
    quarter: "Q4 2026",
  },
  {
    icon: BarChart3,
    title: "Evidence Scorecards",
    description:
      "Every candidate gets a one-page scorecard: skill scores, interview verbatims, integrity rating and red flags. Decision-ready data, not gut feel.",
    quarter: "Live (beta)",
  },
  {
    icon: Code2,
    title: "Skill-Based Coding Tests",
    description:
      "Auto-graded coding rounds for tech roles. Multi-language support (Python, Java, JS, C++, Go), plagiarism detection and instant verdicts.",
    quarter: "Q4 2026",
  },
  {
    icon: CalendarClock,
    title: "Auto-Scheduling",
    description:
      "AI books slots across recruiter, candidate and client calendars — Google, Outlook and Office 365. Zero email ping-pong, zero no-shows.",
    quarter: "Q4 2026",
  },
  {
    icon: MessageSquare,
    title: "Multilingual Outreach",
    description:
      "Engage candidates over WhatsApp and email in English, Hindi, Marathi, Tamil, Telugu and more. Higher response rates, wider reach.",
    quarter: "Q4 2026",
  },
  {
    icon: UserCheck,
    title: "Culture-Fit Signals",
    description:
      "Personality + value-alignment + joining-likelihood prediction. Stack on top of skill scores to forecast long-term retention.",
    quarter: "H1 2027",
  },
  {
    icon: Target,
    title: "Smart Candidate Matching",
    description:
      "Match candidates from your existing ATS database, Naukri, LinkedIn and internal hotlists to any open requirement in seconds.",
    quarter: "Q3 2026",
  },
  {
    icon: ShieldCheck,
    title: "Bias-Reduced Screening",
    description:
      "Structured, criteria-based evaluation. Identifiers like name, gender, college and photo can be masked to focus on skills and outcomes.",
    quarter: "Q3 2026",
  },
  {
    icon: BrainCircuit,
    title: "Predictive Hiring Insights",
    description:
      "Salary benchmarks, time-to-fill forecasts, channel ROI and success-rate predictions across 15+ Indian staffing sectors.",
    quarter: "Q4 2026",
  },
  {
    icon: Gauge,
    title: "10x Faster Shortlisting",
    description:
      "Qualified shortlists in 48 hours instead of the manual 14-day cycle. AI does the heavy lifting so recruiters close roles, not chase resumes.",
    quarter: "Live (beta)",
  },
  {
    icon: Search,
    title: "Patented Boolean + NL Search",
    description:
      "Pinpoint the right consultant from millions of profiles in under a second using Boolean operators or plain-English natural language queries.",
    quarter: "Q4 2026",
  },
  {
    icon: Wand2,
    title: "AI-Suggested Matches",
    description:
      "The moment a job order is created, Tilcons auto-suggests the top matches from your ATS, hotlist and Naukri — no manual searching required.",
    quarter: "Q4 2026",
  },
  {
    icon: Network,
    title: "VMS Synchronization",
    description:
      "Mature connectors index requirements from Beeline, SAP Fieldglass, IQNavigator and other major Vendor Management Systems automatically.",
    quarter: "H1 2027",
  },
  {
    icon: Share2,
    title: "Two-Way Job Board Sync",
    description:
      "Post once to Naukri, LinkedIn, Indeed and Monster. Applicants flow back as parsed, de-duplicated profiles into the AI Recruiter pipeline.",
    quarter: "Q4 2026",
  },
  {
    icon: TrendingUp,
    title: "AI Lead Scoring (Agastya)",
    description:
      "Agastya AI scores inbound leads by intent, fit and engagement — so BD teams focus on high-value accounts and recruiters on placement-ready roles.",
    quarter: "Q4 2026",
  },
  {
    icon: FileCheck2,
    title: "Auto-Activity Logging",
    description:
      "Every status change, interview and submission is logged automatically to the candidate timeline. Audit-ready records, zero recruiter effort.",
    quarter: "Live",
  },
  {
    icon: Layers,
    title: "Submission Tracking",
    description:
      "Built-in client submission tracking with rate cards, status, and feedback — see every consultant on bench, on submit and on offer at a glance.",
    quarter: "Live",
  },
];

const workflowSteps = [
  {
    step: "01",
    icon: Upload,
    title: "Paste the JD",
    description:
      "Drop your job description into Tilcons. AI parses skills, seniority, must-haves and nice-to-haves automatically.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "AI runs the round",
    description:
      "Resume screening + auto-generated assessment + proctored test + AI voice interview — all on autopilot, 24/7.",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "Get evidence scorecards",
    description:
      "Receive a ranked shortlist with skill scores, interview verbatims, integrity signals and culture-fit indicators per candidate.",
  },
  {
    step: "04",
    icon: Award,
    title: "Pick the winner",
    description:
      "Submit the top 3–5 to your client with confidence. Built-in submission tracking, rate cards and activity timeline keep everything in one place.",
  },
];

const trustPoints = [
  "No credit card required",
  "Set up in this week",
  "100 free candidate screens",
  "India-first: Hindi voice support, GST-ready pricing",
];

export default function AIRecruiter() {
  useDocumentMeta(
    "AI Recruiter — Run your first round on autopilot | Tilcons",
    "AI Recruiter from Tilcons — AI resume screening, JD-to-test generation, proctored assessments and autonomous AI voice interviews. Built for Indian staffing agencies. 100 free candidate screens.",
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative overflow-hidden py-20 md:py-28 ai-scan-line"
          style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 60%,#0d2137 100%)" }}
          data-testid="section-ai-recruiter-hero"
        >
          <div className="absolute inset-0 ai-grid-overlay pointer-events-none opacity-50" />
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] mb-6 border"
                style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.35)", color: "#fbbf24" }}
              >
                <Sparkles className="h-3 w-3" />
                Free 100-Candidate Trial
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-5" data-testid="heading-ai-recruiter">
                Run your first round{" "}
                <span className="text-sky-400">on autopilot.</span>
              </h1>

              <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-6 max-w-xl">
                AI resume screening + JD-to-test generation + proctored assessments + autonomous AI voice interviews.
                Get evidence-backed scorecards for every applicant.
              </p>

              <div className="rounded-xl border border-sky-400/30 bg-sky-500/10 p-5 mb-7 backdrop-blur-sm">
                <p className="text-white font-bold text-base md:text-lg">
                  Can we run your next <span className="text-sky-300">100 applicants</span> through Tilcons AI Recruiter{" "}
                  <span className="text-amber-300">completely free</span> to prove it?
                </p>
                <p className="text-slate-400 text-sm mt-1">No credit card. No commitment. No catch.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link href="/get-started">
                  <Button size="lg" className="font-bold uppercase tracking-wider text-sm text-white" style={{ background: SKY, boxShadow: "0 0 20px rgba(14,165,233,0.4)" }} data-testid="button-start-free-trial">
                    Start Free 100-Candidate Trial <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="font-bold uppercase tracking-wider text-sm border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10" data-testid="button-see-how">
                    <PlayCircle className="h-4 w-4 mr-2" /> See How It Works
                  </Button>
                </a>
              </div>

              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                {trustPoints.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-slate-300 text-sm" data-testid={`trust-${p.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: stats panel */}
            <div className="lg:pl-8">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 md:p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-400 mb-1">By the numbers</p>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-6 tracking-tight">
                  Built for Indian staffing speed
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {stats.map(({ value, label }) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
                      <p className="text-4xl font-black text-sky-400 mb-1 tracking-tight">{value}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
                    <ShieldCheck className="h-3 w-3" /> DPDP ready
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border border-amber-400/30 bg-amber-500/10 text-amber-300">
                    <Sparkles className="h-3 w-3" /> Hindi voice
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border border-sky-400/30 bg-sky-500/10 text-sky-300">
                    <Workflow className="h-3 w-3" /> ATS + CRM integrated
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Grid */}
        <section className="py-16 md:py-20 bg-background border-b" data-testid="section-capabilities">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: SKY }}>
                12 Capabilities
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ color: NAVY }}>
                Everything you need to hire <span style={{ color: SKY }}>on autopilot</span>
              </h2>
              <div className="h-[3px] w-12 rounded-full mx-auto mb-5" style={{ background: SKY }} />
              <p className="text-base text-muted-foreground">
                From the first resume to the final scorecard — Tilcons AI Recruiter handles every step.
                Trained on Indian staffing data across 15+ sectors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capabilities.map(({ icon: Icon, title, description, quarter }) => (
                <div
                  key={title}
                  className="group rounded-xl border bg-card p-5 hover-elevate transition-all"
                  data-testid={`card-capability-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                >
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "rgba(14,165,233,0.1)", color: SKY }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shrink-0">
                      <Clock className="h-2.5 w-2.5" /> {quarter}
                    </span>
                  </div>
                  <h3 className="text-base font-black mb-2 leading-snug" style={{ color: NAVY }}>{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/roadmap">
                <Button variant="outline" size="default" className="font-bold uppercase tracking-wider text-sm" data-testid="link-capabilities-roadmap">
                  See full product roadmap <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-16 md:py-20" style={{ background: "linear-gradient(180deg,#f8fafc 0%,#ffffff 100%)" }} data-testid="section-how-it-works">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: SKY }}>
                How It Works
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ color: NAVY }}>
                From JD to <span style={{ color: SKY }}>winning hire</span> — 4 steps
              </h2>
              <div className="h-[3px] w-12 rounded-full mx-auto" style={{ background: SKY }} />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {workflowSteps.map(({ step, icon: Icon, title, description }, idx) => (
                <div key={step} className="relative" data-testid={`step-${step}`}>
                  <div className="rounded-xl border bg-card p-6 h-full hover-elevate">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl font-black tracking-tight" style={{ color: `${SKY}33` }}>
                        {step}
                      </span>
                      <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ background: NAVY }}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-black mb-2 leading-snug" style={{ color: NAVY }}>{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full items-center justify-center z-10" style={{ background: SKY }}>
                      <ArrowRight className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison strip */}
        <section className="py-16 bg-background border-y" data-testid="section-compare">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: SKY }}>
                Old way vs Tilcons AI Recruiter
              </p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: NAVY }}>
                Stop drowning in resumes. Start <span style={{ color: SKY }}>shipping hires</span>.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-6" data-testid="card-old-way">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Old way</p>
                <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <li>2 weeks to first shortlist</li>
                  <li>Manual resume reading, 30 sec each</li>
                  <li>Recruiter bias creeps in</li>
                  <li>Schedule chaos over WhatsApp + calls</li>
                  <li>No proof of skill, just gut feel</li>
                  <li>Candidate ghosting after offer</li>
                </ul>
              </div>
              <div className="rounded-xl border-2 p-6" style={{ borderColor: SKY, background: "rgba(14,165,233,0.05)" }} data-testid="card-new-way">
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: SKY }}>Tilcons AI Recruiter</p>
                <ul className="space-y-2.5 text-sm font-medium" style={{ color: NAVY }}>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> 48 hours to ranked shortlist</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> AI screens 1,000 resumes in minutes</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Structured, criteria-based scoring</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Auto-scheduling across calendars</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Evidence scorecards per candidate</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> Culture-fit + joining likelihood signals</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section
          className="py-20 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#0d2137 0%,#0c4a6e 100%)" }}
          data-testid="section-final-cta"
        >
          <div className="absolute inset-0 ai-grid-overlay pointer-events-none opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] mb-6 border"
              style={{ background: "rgba(14,165,233,0.15)", borderColor: "rgba(14,165,233,0.4)", color: "#7dd3fc" }}
            >
              <Zap className="h-3 w-3" />
              Set up this week
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-5">
              Let us run <span className="text-sky-400">100 candidates</span> through AI Recruiter — free.
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              We'll respond within 24 hours and have your trial live in days. Bring your hardest open role.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/get-started">
                <Button size="lg" className="font-bold uppercase tracking-wider text-sm text-white px-8 py-6" style={{ background: SKY, boxShadow: "0 0 24px rgba(14,165,233,0.5)" }} data-testid="button-cta-start-trial">
                  Start Free 100-Candidate Trial <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="font-bold uppercase tracking-wider text-sm border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 px-8 py-6" data-testid="button-cta-talk-sales">
                  Talk to Sales
                </Button>
              </Link>
            </div>
            <p className="text-slate-500 text-xs mt-6 uppercase tracking-wider font-semibold">
              No credit card · No commitment · No catch
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
