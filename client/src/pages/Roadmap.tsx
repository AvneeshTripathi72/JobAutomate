import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Sparkles, Workflow, Building2, Users, Target, Mail, ShieldCheck, PenLine, Wallet, Plug, Globe2, BarChart3, Smartphone, Lock, Search, ClipboardList, Eye, Mic, FileSearch, Code2, CalendarClock, MessageSquare, UserCheck, BrainCircuit } from "lucide-react";
import { useDocumentMeta } from "@/hooks/use-document-meta";

type Status = "live" | "beta" | "q3-2026" | "q4-2026" | "h1-2027";

const STATUS_META: Record<Status, { label: string; bg: string; text: string; border: string; icon: any }> = {
  "live":      { label: "Live now",      bg: "bg-emerald-50 dark:bg-emerald-900/20",   text: "text-emerald-700 dark:text-emerald-300",   border: "border-emerald-200 dark:border-emerald-900/40", icon: CheckCircle2 },
  "beta":      { label: "Beta",          bg: "bg-sky-50 dark:bg-sky-900/20",           text: "text-sky-700 dark:text-sky-300",           border: "border-sky-200 dark:border-sky-900/40",         icon: Sparkles },
  "q3-2026":   { label: "Q3 2026",       bg: "bg-amber-50 dark:bg-amber-900/20",       text: "text-amber-700 dark:text-amber-300",       border: "border-amber-200 dark:border-amber-900/40",     icon: Clock },
  "q4-2026":   { label: "Q4 2026",       bg: "bg-violet-50 dark:bg-violet-900/20",     text: "text-violet-700 dark:text-violet-300",     border: "border-violet-200 dark:border-violet-900/40",   icon: Clock },
  "h1-2027":   { label: "H1 2027",       bg: "bg-slate-100 dark:bg-slate-800/40",      text: "text-slate-700 dark:text-slate-300",       border: "border-slate-200 dark:border-slate-700",        icon: Clock },
};

type Feature = { name: string; status: Status; icon: any; note?: string };

const SECTIONS: { title: string; items: Feature[] }[] = [
  {
    title: "ATS — Recruitment Workflow",
    items: [
      { name: "Job Postings (CRUD)",                status: "live",     icon: Workflow,    note: "Full create / edit / delete with public job board" },
      { name: "Candidate Applications",             status: "live",     icon: Users,       note: "Resume upload, status pipeline, email notifications" },
      { name: "Hiring Pipeline (8 stages)",         status: "live",     icon: Target,      note: "Applied → Review → Shortlisted → Submitted → Interview → Offer → Joined / Not Selected" },
      { name: "Interview Scheduling + Feedback",    status: "live",     icon: CalendarClock, note: "Phone / video / onsite, interviewer notes, status tracking" },
      { name: "Client Submissions + Rate Cards",    status: "live",     icon: Workflow,    note: "Submit candidates to CRM clients with status and rate offered" },
      { name: "Activity Timeline per Candidate",    status: "live",     icon: Workflow,    note: "Auto-logged status changes, interviews, submissions + recruiter notes" },
      { name: "Hotlist / Bench (Talent Pool)",      status: "live",     icon: Users,       note: "Tag candidates for instant pickup with custom notes" },
      { name: "Articles / Career CMS",              status: "live",     icon: BarChart3 },
      { name: "Candidate Self-Service Portal",      status: "live",     icon: Users },
      { name: "AI Resume Screening",                status: "live",     icon: FileSearch,  note: "OpenAI-powered: paste JD + resume, get 0-100 scorecard with strengths, red flags, matched + missing skills (beta)" },
      { name: "JD-to-Test Generation",              status: "live",     icon: ClipboardList, note: "OpenAI-powered: paste JD, get role-ready MCQ assessment in 60 seconds (beta)" },
      { name: "Evidence Scorecards",                status: "live",     icon: BrainCircuit, note: "Per-candidate scorecard: skills, experience, culture-fit, integrity scores with verdict (beta)" },
      { name: "Proctored Assessments",              status: "q3-2026",  icon: Eye,         note: "Anti-cheating, session recording, integrity signals, screen-lock" },
      { name: "AI Voice Interviews (Autopilot)",    status: "q4-2026",  icon: Mic,         note: "Autonomous AI calls candidates, probes depth, generates scorecards" },
      { name: "AI-Suggested Matches on Job Order",  status: "q4-2026",  icon: Target,      note: "Auto-suggest top matches the moment a job is created — no manual searching" },
      { name: "Skill-Based Coding Tests",           status: "q4-2026",  icon: Code2,       note: "Auto-graded, multi-language, plagiarism detection" },
      { name: "AI Interview Auto-Scheduling",       status: "q4-2026",  icon: CalendarClock, note: "Recruiter ↔ candidate ↔ client calendar sync, zero ping-pong" },
      { name: "Multilingual Candidate Outreach",    status: "q4-2026",  icon: MessageSquare, note: "WhatsApp + email in English, Hindi and regional languages" },
      { name: "Culture-Fit Signals",                status: "h1-2027",  icon: UserCheck,   note: "Personality + values alignment + joining-likelihood prediction" },
      { name: "Boolean / X-Ray Search",             status: "q4-2026",  icon: Search },
    ],
  },
  {
    title: "CRM — Clients, Deals & Pipeline",
    items: [
      { name: "Clients & Accounts",                 status: "live",     icon: Building2,   note: "Full CRUD with industry, city, ARR, account owner" },
      { name: "Deal Pipeline (6 stages)",           status: "live",     icon: Target,      note: "Qualified → Discovery → Proposal → Negotiation → Won / Lost" },
      { name: "Multi-Contact per Account",          status: "q3-2026",  icon: Users },
      { name: "Activity Timeline (calls, notes)",   status: "q3-2026",  icon: Workflow },
      { name: "Outlook / Gmail Auto-Logging",       status: "q3-2026",  icon: Mail,        note: "Internal meeting/email log is live — real OAuth sync is in progress" },
      { name: "Calendar & Interview Scheduling",    status: "q4-2026",  icon: Clock },
    ],
  },
  {
    title: "Integrations & Distribution",
    items: [
      { name: "VMS Relationship Tracker",          status: "live",     icon: Plug,        note: "Track connection status & synced-record counts for Beeline, Fieldglass, SAP and more" },
      { name: "Job Board Posting Tracker",          status: "live",     icon: Globe2,      note: "Track postings and applicant counts across Naukri, LinkedIn, Indeed and more" },
      { name: "Naukri Job Posting API",             status: "q3-2026",  icon: Globe2,      note: "One-click auto-posting via Naukri's publisher API" },
      { name: "LinkedIn Job Posting API",           status: "q3-2026",  icon: Globe2,      note: "One-click auto-posting via LinkedIn's publisher API" },
      { name: "Indeed / Monster Job Posting API",   status: "q4-2026",  icon: Globe2 },
      { name: "VMS API Connectors (Beeline, Fieldglass, IQN)", status: "h1-2027", icon: Plug, note: "Live two-way sync — one VMS at a time, customer-driven priority" },
      { name: "AuthBridge Background Verification", status: "q4-2026",  icon: ShieldCheck },
      { name: "DocuSign / Adobe Sign", status: "q3-2026",  icon: PenLine },
    ],
  },
  {
    title: "Operations — India Compliance",
    items: [
      { name: "Onboarding Workflows + Doc Vault",   status: "q4-2026",  icon: Workflow },
      { name: "Timesheets & Approvals",             status: "q4-2026",  icon: Clock },
      { name: "GST-compliant Invoicing",            status: "q4-2026",  icon: Wallet,      note: "GSTR-1 ready, e-invoicing, Tally / Zoho sync" },
      { name: "PF / ESI / TDS Payroll Integration", status: "h1-2027",  icon: Wallet },
      { name: "DPDP Act Compliance & Audit Logs",   status: "h1-2027",  icon: Lock },
    ],
  },
  {
    title: "Platform & Enterprise",
    items: [
      { name: "Single Sign-On (Microsoft 365 / Google)", status: "q4-2026", icon: Lock },
      { name: "Role-Based Access (Recruiter / BD / Admin)", status: "q3-2026", icon: Lock },
      { name: "Multi-Tenant (per-agency isolation)", status: "q3-2026",  icon: Building2 },
      { name: "Reports & BI Dashboards",            status: "q4-2026",  icon: BarChart3 },
      { name: "Mobile Apps (iOS / Android)",        status: "h1-2027",  icon: Smartphone },
      { name: "Public REST API + Webhooks",         status: "h1-2027",  icon: Plug },
    ],
  },
];

function StatusBadge({ status }: { status: Status }) {
  const m = STATUS_META[status];
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${m.bg} ${m.text} ${m.border}`}>
      <Icon className="h-3 w-3" />
      {m.label}
    </span>
  );
}

export default function Roadmap() {
  useDocumentMeta(
    "Product Roadmap",
    "What's live, what's in beta, and what's coming next on the Tilcons ATS + CRM recruitment platform — built for Indian staffing agencies."
  );
  const counts = {
    live:    SECTIONS.flatMap(s => s.items).filter(f => f.status === "live").length,
    beta:    SECTIONS.flatMap(s => s.items).filter(f => f.status === "beta").length,
    soon:    SECTIONS.flatMap(s => s.items).filter(f => f.status === "q3-2026" || f.status === "q4-2026").length,
    later:   SECTIONS.flatMap(s => s.items).filter(f => f.status === "h1-2027").length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-16 lg:py-20" style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 60%,#0d2137 100%)" }}>
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 mb-5">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-sky-300 text-[11px] font-bold uppercase tracking-[0.2em]">
                Honest. Transparent. Built in public.
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Tilcons Product <span className="text-sky-400">Roadmap</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              We believe in showing you exactly what's live today, what's in beta, and what's coming.
              No vapourware. No fake screens. Just a clear plan to become India's best ATS + CRM for staffing.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 max-w-3xl mx-auto">
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-400/30 px-4 py-3">
                <p className="text-3xl font-black text-emerald-400" data-testid="stat-live">{counts.live}</p>
                <p className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider mt-1">Live now</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 border border-amber-400/30 px-4 py-3">
                <p className="text-3xl font-black text-amber-400" data-testid="stat-soon">{counts.soon}</p>
                <p className="text-xs font-bold text-amber-300/80 uppercase tracking-wider mt-1">2026</p>
              </div>
              <div className="rounded-lg bg-violet-500/10 border border-violet-400/30 px-4 py-3">
                <p className="text-3xl font-black text-violet-400" data-testid="stat-later">{counts.later}</p>
                <p className="text-xs font-bold text-violet-300/80 uppercase tracking-wider mt-1">2027</p>
              </div>
              <div className="rounded-lg bg-sky-500/10 border border-sky-400/30 px-4 py-3">
                <p className="text-3xl font-black text-sky-400" data-testid="stat-total">{SECTIONS.flatMap(s => s.items).length}</p>
                <p className="text-xs font-bold text-sky-300/80 uppercase tracking-wider mt-1">Total features</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6 space-y-12">
            {SECTIONS.map(section => (
              <div key={section.title} data-testid={`section-${section.title.toLowerCase().replace(/[^a-z]/g, '-')}`}>
                <h2 className="text-2xl font-black text-foreground mb-1 tracking-tight">{section.title}</h2>
                <p className="text-sm text-muted-foreground mb-5">{section.items.length} capabilities</p>
                <div className="grid gap-3">
                  {section.items.map(f => {
                    const Icon = f.icon;
                    return (
                      <Card key={f.name} className="border-0 shadow-sm hover-elevate" data-testid={`feature-${f.name.toLowerCase().replace(/[^a-z]/g, '-')}`}>
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground">{f.name}</p>
                            {f.note && <p className="text-xs text-muted-foreground mt-0.5">{f.note}</p>}
                          </div>
                          <StatusBadge status={f.status} />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black text-foreground mb-3 tracking-tight">Want to shape the roadmap?</h2>
            <p className="text-muted-foreground mb-6">
              We prioritise based on customer demand. If you're a staffing agency in India and there's a feature you need —
              tell us. Customer-requested features jump the queue.
            </p>
            <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold uppercase tracking-wider text-sm transition-colors" data-testid="link-roadmap-contact">
              Talk to us <Sparkles className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
