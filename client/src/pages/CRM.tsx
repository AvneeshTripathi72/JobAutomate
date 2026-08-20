import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactCTA from "@/components/ContactCTA";
import AnimatedNumber from "@/components/AnimatedNumber";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Users,
  Building2,
  GitBranch,
  Calendar,
  BarChart3,
  ShieldCheck,
  Bot,
  FileSearch,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Bell,
  Layers,
} from "lucide-react";

interface PublicStats {
  activeJobs: number;
  partnerCompanies: number;
  registeredCandidates: number;
  successfulPlacements: number;
  publishedArticles: number;
  industriesCovered: number;
}

const coreFeatures = [
  {
    icon: Users,
    title: "Contact & Candidate Management",
    description:
      "Centralised database of every candidate, client contact and decision-maker — fully searchable with tags and full activity history.",
  },
  {
    icon: Building2,
    title: "Account & Company Tracking",
    description:
      "360° view of every client company: contacts, open requirements, billing history and deal status in one screen.",
  },
  {
    icon: GitBranch,
    title: "Sales Pipeline & Deal Stages",
    description:
      "Kanban board for opportunities — from lead to BD call to MSA signed. Track every deal's stage and value in real time.",
  },
  {
    icon: Bot,
    title: "AI Candidate Scoring & Assessments",
    description:
      "AI-generated skill assessments and candidate-to-role fit scoring, so recruiters spend time on the strongest matches first.",
  },
  {
    icon: Calendar,
    title: "Internal Meeting & Task Scheduler",
    description:
      "Built-in calendar and meeting log to keep interviews, client check-ins and follow-ups organised across the team.",
  },
  {
    icon: BarChart3,
    title: "Real-time Dashboards & Reports",
    description:
      "Pipeline value, activity counts and recruiter scorecards — live, exportable reporting without spreadsheets.",
  },
  {
    icon: Bell,
    title: "Alerts & Activity Feed",
    description:
      "A live activity timeline logs every candidate submission, deal update and stage change against the right record.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access & Audit Trail",
    description:
      "Granular permissions per recruiter, account manager or super admin — with a full activity log for accountability.",
  },
  {
    icon: Layers,
    title: "Vendor & VMS Relationship Tracking",
    description:
      "Track your VMS relationships (Beeline, Fieldglass, SAP and more) and job-board postings from one dashboard.",
  },
  {
    icon: FileSearch,
    title: "Onboarding, E-Sign & Background Checks",
    description:
      "Move placed candidates through onboarding, document e-signature and background-check tracking without leaving the CRM.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Capture",
    description:
      "Candidates and client leads flow in through your website, referrals and manual entry — organised and assigned instantly.",
  },
  {
    step: "02",
    title: "Qualify",
    description:
      "AI scoring and skill assessments highlight the strongest candidates so recruiters focus where it matters.",
  },
  {
    step: "03",
    title: "Engage",
    description:
      "Every call note, meeting and update lives on a single activity timeline against the candidate or client.",
  },
  {
    step: "04",
    title: "Close & Place",
    description:
      "Move deals through the pipeline, attach the right candidate, generate offer letters and convert to a billable placement.",
  },
  {
    step: "05",
    title: "Measure & Grow",
    description:
      "Real-time dashboards show what's working. Double down on the recruiters and accounts driving revenue.",
  },
];

export default function CRM() {
  const { data: stats } = useQuery<PublicStats>({ queryKey: ["/api/stats"] });

  const heroRef = useScrollReveal<HTMLDivElement>();
  const statsRef = useScrollReveal<HTMLElement>();
  const featuresRef = useScrollReveal<HTMLElement>();
  const workflowRef = useScrollReveal<HTMLElement>();
  const benefitsRef = useScrollReveal<HTMLElement>();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden ai-scan-line"
          style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 60%,#0d2137 100%)" }}
        >
          <div className="absolute inset-0 ai-grid-overlay pointer-events-none opacity-60" />
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />

          <div ref={heroRef} className="reveal reveal-up relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                <span className="text-sky-300 text-[11px] font-bold uppercase tracking-[0.2em]">
                  Tilcons Recruitment CRM
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.05] mb-6">
                One CRM built for{" "}
                <span className="text-sky-400">staffing & recruitment.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
                Manage candidates, clients, deals and placements from a single AI-powered workspace.
                Replace spreadsheets, email threads and disconnected tools with the only CRM
                designed end-to-end for recruitment teams.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact">
                  <button
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-sky-500/20 transition-all"
                    data-testid="button-request-demo"
                  >
                    Request a Demo <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/employers">
                  <button
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-white/5 hover:bg-white/10 backdrop-blur border border-white/20 text-white font-bold text-sm uppercase tracking-wider transition-all"
                    data-testid="button-explore-services"
                  >
                    Explore Services
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Live stats strip */}
        <section
          ref={statsRef}
          className="reveal reveal-up border-b bg-background"
          data-testid="section-crm-stats"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 reveal-stagger">
              {[
                { label: "Live Jobs Managed", value: stats?.activeJobs ?? 0 },
                { label: "Client Companies", value: stats?.partnerCompanies ?? 0 },
                { label: "Candidates in DB", value: stats?.registeredCandidates ?? 0 },
                { label: "Industries Served", value: stats?.industriesCovered ?? 0 },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center p-4 rounded-lg border border-border bg-card"
                  data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <p className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                    <AnimatedNumber value={s.value} />
                    <span className="text-sky-500">+</span>
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section ref={featuresRef} className="reveal reveal-up py-16 md:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <p className="text-sky-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                Everything you need
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-4">
                Built for the way recruiters actually work
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                From the first cold call to the closed placement — every feature is designed for
                staffing firms, BD teams and in-house TA leaders.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal-stagger">
              {coreFeatures.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group p-6 rounded-xl border border-border bg-card hover:border-sky-500/40 transition-all hover-elevate"
                  data-testid={`card-feature-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                >
                  <div className="w-11 h-11 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center mb-4 group-hover:bg-sky-500/20 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-black text-foreground mb-2 leading-snug">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section
          ref={workflowRef}
          className="reveal reveal-up py-16 md:py-20 relative overflow-hidden ai-scan-line"
          style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 100%)" }}
        >
          <div className="absolute inset-0 ai-grid-overlay pointer-events-none opacity-30" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <p className="text-sky-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                How it works
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                From lead to placement in one flow
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                A unified pipeline that connects your sales, recruiting and delivery teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 reveal-stagger">
              {workflow.map((w) => (
                <div
                  key={w.step}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-sky-400/40 transition-all"
                  data-testid={`step-${w.step}`}
                >
                  <p className="text-sky-400 font-black text-2xl mb-2">{w.step}</p>
                  <h3 className="text-white font-black text-base mb-2">{w.title}</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">{w.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section ref={benefitsRef} className="reveal reveal-up py-16 md:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sky-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                  Why Tilcons CRM
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-6">
                  Save hours every day. Place faster. Win more deals.
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-8">
                  Recruiters using Tilcons CRM cut admin time, surface the right candidate first
                  and keep clients warm without the manual chase.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact">
                    <button
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm uppercase tracking-wider transition-all"
                      data-testid="button-talk-to-sales"
                    >
                      Talk to Sales <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                  <Link href="/upload-job-description">
                    <button
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border hover:border-sky-500/40 text-foreground font-bold text-sm uppercase tracking-wider transition-all"
                      data-testid="button-post-a-job"
                    >
                      Post a Job
                    </button>
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 reveal-stagger">
                {[
                  { stat: "60%", text: "Less time spent on data entry and follow-up admin" },
                  { stat: "3×", text: "Faster shortlist turnaround with AI candidate matching" },
                  { stat: "40%", text: "Higher pipeline conversion with automated cadences" },
                  { stat: "100%", text: "Visibility for managers across every recruiter and account" },
                  { stat: "24/7", text: "Anywhere access — desktop, tablet and mobile-ready" },
                ].map((b) => (
                  <div
                    key={b.text}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover-elevate"
                    data-testid={`benefit-${b.stat}`}
                  >
                    <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-sky-500/10 text-sky-500 font-black text-lg flex-shrink-0">
                      {b.stat}
                    </div>
                    <div className="pt-1">
                      <p className="text-sm text-foreground leading-relaxed">{b.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="py-12 bg-muted/30 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-center">
              {[
                "Enterprise-grade Security",
                "GDPR & DPDP Compliant",
                "99.9% Uptime SLA",
                "SOC 2 Aligned",
                "Role-based Access",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2 text-muted-foreground text-sm">
                  <CheckCircle2 className="h-4 w-4 text-sky-500" />
                  <span className="font-semibold">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}
