import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import RecentJobs from "@/components/RecentJobs";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import { ArrowRight, Cpu, Factory, Heart, Calculator, Briefcase, Truck, BrainCircuit, Sparkles, Zap, Target, ShieldCheck, Users, Loader2, Globe, IndianRupee, FileSearch, ClipboardList, Eye, Mic, CalendarClock, MessageSquare, Code2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Article } from "@shared/schema";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const disciplines = [
  { label: "Technology & IT", icon: Cpu, href: "/jobs?q=Technology" },
  { label: "Manufacturing", icon: Factory, href: "/jobs?q=Manufacturing" },
  { label: "Healthcare", icon: Heart, href: "/jobs?q=Healthcare" },
  { label: "Finance & Accounting", icon: Calculator, href: "/jobs?q=Finance" },
  { label: "Administrative & Office", icon: Briefcase, href: "/jobs?q=Administrative" },
  { label: "Logistics & Supply Chain", icon: Truck, href: "/jobs?q=Logistics" },
];

const aiFeatures = [
  {
    icon: Target,
    title: "Smart Candidate Matching",
    description: "Our AI scans thousands of profiles in seconds, ranking candidates by skills, experience and culture-fit so you only see the best matches.",
  },
  {
    icon: Zap,
    title: "10x Faster Shortlisting",
    description: "What used to take a week of manual screening now happens in hours. Get qualified shortlists in 48 hours, not 14 days.",
  },
  {
    icon: BrainCircuit,
    title: "Predictive Hiring Insights",
    description: "Data-driven salary benchmarks, market intelligence and success-rate predictions help you make confident hiring decisions.",
  },
  {
    icon: ShieldCheck,
    title: "Bias-Reduced Screening",
    description: "Structured AI evaluation focuses on skills and outcomes, helping you build diverse teams with consistent, fair criteria.",
  },
  {
    icon: ClipboardList,
    title: "JD-to-Test Generation",
    description: "Paste a job description and our AI auto-generates role-ready assessments in minutes — no manual test-building required.",
  },
  {
    icon: Eye,
    title: "Proctored Assessments",
    description: "Anti-cheating proctoring with session recording, screen-lock and integrity signals. Trust every score on your dashboard.",
  },
  {
    icon: Mic,
    title: "AI Voice Interviews",
    description: "Autonomous AI voice interviews that probe depth, capture decision-ready notes and produce evidence-backed scorecards.",
  },
  {
    icon: FileSearch,
    title: "Evidence Scorecards",
    description: "Every candidate gets an evidence-backed scorecard with skill scores, interview notes and integrity ratings — data, not gut feel.",
  },
  {
    icon: Code2,
    title: "Skill-Based Coding Tests",
    description: "Auto-graded coding rounds for tech roles. Multi-language support, plagiarism detection and instant skill verdicts.",
  },
  {
    icon: CalendarClock,
    title: "Auto-Scheduling",
    description: "AI books interview slots across recruiter, candidate and client calendars — no more email ping-pong, zero coordination overhead.",
  },
  {
    icon: MessageSquare,
    title: "Multilingual Outreach",
    description: "Engage candidates in English, Hindi or regional languages over WhatsApp and email. Higher response rates, wider reach.",
  },
  {
    icon: UserCheck,
    title: "Culture-Fit Signals",
    description: "Personality and value-alignment signals layered on top of skill scores — predict joining likelihood and long-term fit.",
  },
];

const aiStats = [
  { value: "48h", label: "Time to first shortlist" },
  { value: "95%", label: "Hiring manager satisfaction" },
  { value: "100+", label: "Candidates screened free" },
  { value: "15+", label: "Sectors AI-trained on" },
];

export default function Home() {
  useDocumentMeta(
    "Tilcons — The all-in-one ATS + CRM built for Indian staffing agencies",
    "AI-powered recruitment platform for Indian staffing agencies. Track candidates, manage clients, sync with VMS and Naukri, GST-ready invoicing — all in one ATS + CRM."
  );
  const [, setLocation] = useLocation();
  const { data: articles = [], isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });
  const latestInsights = articles.slice(0, 3);

  const aiSectionRef = useScrollReveal<HTMLElement>();
  const disciplinesRef = useScrollReveal<HTMLElement>();
  const salaryRef = useScrollReveal<HTMLElement>();
  const insightsRef = useScrollReveal<HTMLElement>();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />

        {/* Platform positioning strip */}
        <Link href="/ats">
          <div
            className="group relative overflow-hidden cursor-pointer border-y border-sky-500/20"
            style={{ background: "linear-gradient(90deg, #0d2137 0%, #0d2137 60%, #0c4a6e 100%)" }}
            data-testid="strip-platform-tagline"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-center md:justify-between gap-3 text-center md:text-left">
              <p className="text-white text-sm md:text-base font-bold tracking-tight">
                The all-in-one <span className="text-sky-400">ATS + CRM</span> built for Indian staffing agencies.
              </p>
              <span className="text-sky-400 text-xs font-black uppercase tracking-[0.22em] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                Explore the platform
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <Link href="/jobs">
            <div
              className="group relative flex flex-col justify-between px-8 py-6 min-h-[130px] cursor-pointer overflow-hidden"
              style={{ background: "#0d2137" }}
              data-testid="panel-candidate"
            >
              <div className="absolute inset-0 ai-dot-grid opacity-30 pointer-events-none" />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
              <div className="relative z-10">
                <p className="text-sky-400 text-xs font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  For Candidates
                </p>
                <h2 className="text-xl md:text-2xl font-black text-white leading-tight mb-2">
                  I'm looking for a job
                </h2>
                <p className="text-slate-400 text-sm max-w-xs">
                  Explore live roles across every sector with Tilcons' AI-powered matching.
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-sky-400 font-bold text-sm uppercase tracking-wider mt-5 group-hover:gap-3 transition-all">
                Browse Jobs <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          <Link href="/employers">
            <div
              className="group relative flex flex-col justify-between px-8 py-6 min-h-[130px] cursor-pointer overflow-hidden"
              style={{ background: "#0ea5e9" }}
              data-testid="panel-employer"
            >
              <div className="absolute inset-0 ai-dot-grid opacity-20 pointer-events-none" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="relative z-10">
                <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                  <BrainCircuit className="h-3 w-3" />
                  For Employers
                </p>
                <h2 className="text-xl md:text-2xl font-black text-white leading-tight mb-2">
                  I'm looking to hire
                </h2>
                <p className="text-white/80 text-sm max-w-xs">
                  Tell us your hiring needs and let our AI-driven team find the right talent — fast.
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider mt-5 group-hover:gap-3 transition-all">
                Find Talent <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* India positioning strip */}
        <section className="py-12 md:py-16 bg-background border-b" data-testid="section-india-built">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Built for Indian Staffing</p>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight max-w-3xl mx-auto">
                Every feature designed around how India hires —
                <span className="text-sky-500"> Naukri, GST, PF/ESI, INR.</span>
              </h2>
              <p className="text-muted-foreground text-base mt-3 max-w-2xl mx-auto">
                Most ATS + CRM platforms are built for the US market and bolt India on as an afterthought. Tilcons starts with India.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-lg border bg-card p-5" data-testid="card-india-naukri">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center mb-3">
                  <Globe className="h-5 w-5" />
                </div>
                <p className="text-base font-black text-foreground mb-1">Naukri-first job distribution</p>
                <p className="text-sm text-muted-foreground">Multi-board posting starting with Naukri, LinkedIn, then Indeed/Monster — built into the same workflow.</p>
              </div>

              <div className="rounded-lg border bg-card p-5" data-testid="card-india-compliance">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="text-base font-black text-foreground mb-1">GST · PF · ESI · TDS ready</p>
                <p className="text-sm text-muted-foreground">GSTR-1 compliant invoicing, e-invoice (IRN/QR), Tally / Zoho sync, and statutory payroll on the roadmap.</p>
              </div>

              <div className="rounded-lg border bg-card p-5" data-testid="card-india-pricing">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <p className="text-base font-black text-foreground mb-1">INR pricing · INR everything</p>
                <p className="text-sm text-muted-foreground">No FX surprises. Salaries in lakhs/crores, dashboards in INR, support team in IST. Starting under the cost of one US-built ATS seat.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <Link href="/roadmap" data-testid="link-coming-soon-roadmap" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">Coming Soon</span>
                Naukri · GST · AI matching · Payroll — see the full ATS + CRM roadmap →
              </Link>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/contact">
                  <Button variant="outline" size="default" data-testid="link-home-request-demo">
                    Request Demo
                  </Button>
                </Link>
                <Link href="/ats">
                  <Button size="default" className="bg-sky-500 hover:bg-sky-400 text-white" data-testid="link-home-explore-product">
                    Explore Product
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={aiSectionRef}
          className="py-16 md:py-20 relative overflow-hidden ai-scan-line reveal reveal-up"
          style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 60%,#0d2137 100%)" }}
          data-testid="section-ai-recruitment"
        >
          <div className="absolute inset-0 ai-grid-overlay pointer-events-none opacity-60" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[2px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] mb-5 border" style={{ background: "rgba(14,165,233,0.1)", borderColor: "rgba(14,165,233,0.3)", color: "#0ea5e9" }}>
                <BrainCircuit className="h-3 w-3" />
                AI-Powered Recruitment
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight" data-testid="heading-ai-recruitment">
                Hiring, reimagined by <span className="text-sky-400">artificial intelligence</span>
              </h2>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                At Tilcons, we combine deep recruitment expertise with cutting-edge AI to find the right people, faster. Our intelligent platform analyses skills, experience and culture-fit signals across thousands of profiles — so you spend less time screening and more time hiring.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12 reveal-stagger">
              {aiFeatures.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group relative p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-sky-400/40 hover:bg-white/[0.07] transition-all"
                  data-testid={`card-ai-feature-${title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="w-11 h-11 rounded-lg bg-sky-500/15 flex items-center justify-center mb-4 group-hover:bg-sky-500/25 transition-colors">
                    <Icon className="h-5 w-5 text-sky-400" />
                  </div>
                  <h3 className="text-base font-black text-white mb-2 leading-snug">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 p-6 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
              {aiStats.map(({ value, label }) => (
                <div key={label} className="text-center" data-testid={`stat-ai-${label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="text-3xl md:text-4xl font-black text-sky-400 mb-1 tracking-tight">{value}</div>
                  <div className="text-[11px] md:text-xs uppercase tracking-wider text-slate-400 font-semibold">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/employers">
                <button
                  className="bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold px-8 py-4 rounded-lg text-sm uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap"
                  style={{ boxShadow: "0 0 20px rgba(14,165,233,0.3)" }}
                  data-testid="button-ai-hire"
                >
                  <Users className="h-4 w-4" />
                  Hire with AI
                </button>
              </Link>
              <Link href="/jobs">
                <button
                  className="border border-white/25 bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-lg text-sm uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap backdrop-blur-sm"
                  data-testid="button-ai-jobs"
                >
                  <Sparkles className="h-4 w-4" />
                  Find AI-Matched Jobs
                </button>
              </Link>
              <Link href="/ai-recruiter">
                <button
                  className="border border-amber-400/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold px-8 py-4 rounded-lg text-sm uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap"
                  data-testid="button-ai-recruiter"
                >
                  <BrainCircuit className="h-4 w-4" />
                  AI Recruiter — Free Trial
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section ref={disciplinesRef} className="py-14 bg-background border-b relative reveal reveal-up">
          <div className="absolute inset-0 ai-grid-overlay pointer-events-none opacity-30" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
              <div>
                <p className="text-sky-500 text-xs font-bold uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
                  <BrainCircuit className="h-3.5 w-3.5" />
                  AI-Matched Sectors
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                  Browse by Discipline
                </h2>
              </div>
              <Link href="/services">
                <button className="flex items-center gap-2 text-sm font-bold text-sky-500 uppercase tracking-wider hover:gap-3 transition-all">
                  All Industries <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 reveal-stagger">
              {disciplines.map(({ label, icon: Icon, href }) => (
                <button
                  key={label}
                  onClick={() => setLocation(href)}
                  className="group flex flex-col items-start gap-3 p-5 rounded-xl border border-border bg-background hover:border-sky-500/50 hover:bg-sky-500/5 transition-all text-left relative"
                  data-testid={`discipline-${label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors relative">
                    <Icon className="h-5 w-5 text-sky-500" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-sky-500/40 opacity-0 group-hover:opacity-100 transition-opacity" style={{ boxShadow: "0 0 6px rgba(14,165,233,0.4)" }} />
                  </div>
                  <span className="text-sm font-bold text-foreground leading-snug">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={salaryRef}
          className="py-14 relative overflow-hidden ai-scan-line reveal reveal-zoom"
          style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 100%)" }}
        >
          <div className="absolute inset-0 ai-grid-overlay pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-sky-400 text-xs font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Free Resource
                </p>
                <h2 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tight">
                  2025 Salary &amp; Hiring Guide
                </h2>
                <p className="text-slate-300 text-base max-w-lg">
                  Benchmark salaries and understand what top talent expects across 15+ sectors — so you can attract and retain the best.
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href="/tilcons-salary-guide-2025.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="button-salary-guide"
                  className="bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold px-8 py-4 rounded-lg text-sm uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg"
                  style={{ boxShadow: "0 0 20px rgba(14,165,233,0.25)" }}
                >
                  Download Free Guide <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section ref={insightsRef} className="py-14 bg-background border-b relative reveal reveal-up">
          <div className="absolute inset-0 ai-grid-overlay pointer-events-none opacity-20" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center justify-between mb-10 flex-wrap gap-3">
              <div>
                <p className="text-sky-500 text-xs font-bold uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
                  <BrainCircuit className="h-3.5 w-3.5" />
                  Knowledge Hub
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Latest Advice</h2>
              </div>
              <Link href="/career-advice">
                <button className="flex items-center gap-2 text-sm font-bold text-sky-500 uppercase tracking-wider hover:gap-3 transition-all" data-testid="link-view-all-advice">
                  View All <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            {articlesLoading ? (
              <div className="flex items-center justify-center py-12" data-testid="loader-articles">
                <Loader2 className="h-7 w-7 animate-spin text-sky-500" />
              </div>
            ) : latestInsights.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm" data-testid="text-no-articles">
                No articles published yet. Check back soon.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-stagger">
                {latestInsights.map((article) => (
                  <Link key={article.id} href="/career-advice">
                    <div
                      className="group border border-border rounded-xl overflow-hidden bg-background hover:border-sky-500/40 transition-all cursor-pointer hover-elevate h-full relative"
                      data-testid={`card-article-${article.id}`}
                    >
                      <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #0ea5e9, #38bdf8)" }} />
                      <div className="p-6 flex flex-col h-full">
                        <p className="text-sky-500 text-[10px] font-bold uppercase tracking-widest mb-3">
                          {article.category}
                        </p>
                        <h3 className="text-base font-black text-foreground mb-3 leading-snug group-hover:text-sky-500 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-grow">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-xs text-muted-foreground">{article.readTime}</span>
                          <span className="flex items-center gap-1 text-sky-500 font-bold text-xs uppercase tracking-wide group-hover:gap-2 transition-all">
                            Read More <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <StatsSection />
        <RecentJobs />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}