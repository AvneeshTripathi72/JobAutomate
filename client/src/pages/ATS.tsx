import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Link } from "wouter";
import { Award, Gauge, Rocket, MessagesSquare, Maximize2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  CheckCircle2,
  Search,
  Sparkles,
  HeartHandshake,
  ClipboardCheck,
  Wallet,
  Plug,
  Globe2,
  BarChart3,
  TrendingUp,
  Mail,
  ShieldCheck,
  PenLine,
  Filter,
  Plus,
} from "lucide-react";
import {
  CrmModule,
  OnboardingModule,
  FinancialsModule,
  VmsSyncModule,
  JobBoardsModule,
  EmailCalendarModule,
  BackgroundChecksModule,
  ESignatureModule,
  ReportsModule,
} from "@/components/admin/AtsModuleMocks";

interface Section {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  intro: string;
  bullets: string[];
  icon: React.ComponentType<{ className?: string }>;
  align: "left" | "right";
}

const sections: Section[] = [
  {
    id: "ats",
    badge: "Applicant Tracking System",
    title: "Accurate placements at the",
    highlight: "speed of light",
    icon: Search,
    align: "left",
    intro:
      "Tilcons ATS is engineered for the realities of staffing. Every screen, every flow is designed to focus recruiters on the work that drives revenue — automation handles the rest. Our AI hums in the background, refreshing your talent pool and enriching every résumé and requirement with real-time intelligence, while patented search lets you pinpoint the right consultant from millions of profiles in under a second.",
    bullets: [
      "Cultivate a constantly refreshing talent pool harvested from your subscriptions, applicants and referrals.",
      "AI-suggested matches the moment a job order is created — no manual searching required.",
      "Patented Boolean + natural-language search to narrow results to the exact requirement.",
      "Drag-and-drop pipeline with custom stages per client, with bulk actions and submission tracking.",
    ],
  },
  {
    id: "crm",
    badge: "Contact Relationship Management",
    title: "Bring your relationships into",
    highlight: "perfect harmony",
    icon: HeartHandshake,
    align: "right",
    intro:
      "Our CRM is purpose-built for the unique service demands of staffing and recruiting. With a deep set of automated, visually rich tools that natively integrate with the ATS, every recruiter, account manager and stakeholder works from one unified view of the client — multiplying the value of every interaction and unlocking measurably higher retention.",
    bullets: [
      "Multiply the value of every interaction with advanced data tracking and mining.",
      "Coordinate seamlessly between sales, recruiting and delivery to craft custom client solutions.",
      "Push prospect and client updates to the team in real time — even while servicing accounts on the go.",
      "Activity timelines, contact intelligence and account hierarchies built for staffing.",
    ],
  },
  {
    id: "onboarding",
    badge: "Onboarding",
    title: "Rapid and reliable",
    highlight: "onboarding",
    icon: ClipboardCheck,
    align: "left",
    intro:
      "Our middle-office automation accelerates the hiring cycle, simplifies the candidate experience and bends to your firm's best practices. Compliance adapts automatically to client preferences, local requirements and tax categories — without adding administrative load.",
    bullets: [
      "Guide candidates through a paperless, mobile-friendly process — every step traceable.",
      "Encrypted document sharing and e-signatures protect everyone's privacy end-to-end.",
      "Collect and manage I-9, KYC and right-to-work documentation with electronic verification.",
      "Native integrations with the most widely adopted background-check providers.",
    ],
  },
  {
    id: "financials",
    badge: "Financials",
    title: "A strong backbone for",
    highlight: "your business",
    icon: Wallet,
    align: "right",
    intro:
      "Our native back-office suite gives finance teams real-time insight into the financial impact of every front-office activity. A fully integrated ecosystem means better pipelining, smarter forecasting and true visibility into profitability — with deep customisation at every step of the billing cycle to meet even the most demanding end-client requirements.",
    bullets: [
      "Automate timesheet collection or build smooth electronic-approval workflows.",
      "Run flexible billing and payroll processes, customised per scenario or client.",
      "Account for both contract assignments and SOW projects with project-level financial tools.",
      "Integrate with the most trusted payroll and general-ledger systems on the market.",
    ],
  },
  {
    id: "vms",
    badge: "VMS Synchronization",
    title: "Reqs as",
    highlight: "they happen",
    icon: Plug,
    align: "left",
    intro:
      "Tilcons leads in VMS synchronisation. Our mature connectors reliably collect and index data from every major Vendor Management System on the market — bringing requirements to your recruiters faster than the competition and capturing every key transaction with your client.",
    bullets: [
      "Up-to-the-minute job syncing across Beeline, SAP Fieldglass and other major VMS platforms.",
      "Pull timesheets, expenses, SOWs and more to capture every billable transaction.",
      "Customise the handling of incoming records to match your team's best practices.",
      "Two-way sync — submit candidates back to the VMS without ever leaving the ATS.",
    ],
  },
  {
    id: "job-boards",
    badge: "Job Boards Synchronization",
    title: "Reach every candidate, on",
    highlight: "every channel",
    icon: Globe2,
    align: "right",
    intro:
      "Post once, distribute everywhere. Tilcons' Job Boards Synchronization pushes your open requirements to LinkedIn, Naukri, Indeed, Monster, Dice and dozens of niche boards in a single click — and pulls every applicant straight back into the ATS pipeline with full source attribution. No copy-pasting, no duplicate profiles, no lost résumés.",
    bullets: [
      "One-click multi-posting to LinkedIn, Naukri, Indeed, Monster, Dice and 40+ regional boards.",
      "Two-way sync: applicants flow back into the ATS as parsed, de-duplicated candidate profiles.",
      "Source attribution on every application — see which board delivers the best hires and ROI.",
      "Sponsored-job budget tracking and programmatic spend optimisation across boards.",
    ],
  },
  {
    id: "email-calendar",
    badge: "Email & Calendar Sync",
    title: "Every conversation, captured",
    highlight: "automatically",
    icon: Mail,
    align: "left",
    intro:
      "Tilcons connects natively to Outlook 365 and Google Workspace — so every email, every meeting and every reply is logged against the right candidate or client without a single click. Recruiters work from the inbox they already know; the ATS quietly keeps the source of truth up to date.",
    bullets: [
      "Two-way Outlook & Gmail sync — emails auto-logged on candidate and contact timelines.",
      "Calendar sync with Outlook, Google and Apple Calendar for interviews and client meetings.",
      "Self-service interview booking links with availability windows and time-zone handling.",
      "Native video-interview integration with Zoom, Teams and Google Meet — recordings attached to the candidate record.",
    ],
  },
  {
    id: "background-checks",
    badge: "Background Check Integrations",
    title: "Pre-employment screening,",
    highlight: "fully automated",
    icon: ShieldCheck,
    align: "right",
    intro:
      "Trigger background, drug, education and reference checks the moment an offer is accepted — without leaving the ATS. Tilcons integrates with the world's leading screening providers, so consent collection, status tracking and final reports are all stitched into the candidate record.",
    bullets: [
      "Native integrations with Checkr, Sterling, HireRight, AuthBridge and First Advantage.",
      "Automated consent collection with audit-ready electronic signatures and timestamps.",
      "Real-time status updates — see exactly which checks are pending, cleared or flagged.",
      "Adverse-action workflows pre-built to keep your firm compliant with FCRA, GDPR and DPDP.",
    ],
  },
  {
    id: "esignature",
    badge: "E-Signature & Document Sync",
    title: "Sign, store and stay",
    highlight: "audit-ready",
    icon: PenLine,
    align: "left",
    intro:
      "Generate offer letters, MSAs, NDAs and contractor agreements from templates, send for e-signature and route every executed document into a secure, searchable vault. Expiry alerts, version history and access controls keep your back office one step ahead of every audit.",
    bullets: [
      "Native DocuSign, Adobe Sign and Dropbox Sign integrations with template-driven document generation.",
      "Centralised document vault with role-based access, version history and full audit trail.",
      "Automatic expiry alerts for visas, certifications, MSAs and insurance documents.",
      "Bulk-send capability for mass onboarding waves and contract renewals.",
    ],
  },
  {
    id: "reports",
    badge: "Reports & Analytics",
    title: "Knowledge is",
    highlight: "power",
    icon: BarChart3,
    align: "right",
    intro:
      "Tilcons is loaded with staffing-centric reports and dashboards. Surface performance patterns at a glance, then drill into the behaviour of teams, clients and service lines. Nearly every click and data point is tracked — empowering bold, data-driven decisions that keep you ahead of the competition.",
    bullets: [
      "Hundreds of out-of-the-box reports covering every staffing scenario.",
      "Visual dashboards for time-to-fill, source-of-hire, recruiter productivity and revenue.",
      "Custom report builder with scheduled email delivery to leadership and clients.",
      "Drill-down analytics across teams, clients, service groups and assignment types.",
    ],
  },
];

const sectionMocks: Record<string, React.ComponentType> = {
  crm: CrmModule,
  onboarding: OnboardingModule,
  financials: FinancialsModule,
  vms: VmsSyncModule,
  "job-boards": JobBoardsModule,
  "email-calendar": EmailCalendarModule,
  "background-checks": BackgroundChecksModule,
  esignature: ESignatureModule,
  reports: ReportsModule,
};

function AtsPipelinePreview() {
  const stages = [
    {
      name: "Sourced",
      count: 28,
      cards: [
        { initials: "AM", name: "Anjali Mehta", role: "Senior Java Developer", tag: "8y · Bangalore" },
        { initials: "VR", name: "Vikram Rao", role: "DevOps Engineer", tag: "6y · Hyderabad" },
      ],
    },
    {
      name: "Screened",
      count: 14,
      cards: [
        { initials: "SI", name: "Sneha Iyer", role: "Data Scientist", tag: "5y · Pune" },
        { initials: "KN", name: "Karthik Nair", role: "RPA Lead", tag: "9y · Chennai" },
      ],
    },
    {
      name: "Submitted",
      count: 9,
      cards: [
        { initials: "PS", name: "Priyanka Shah", role: "QA Automation", tag: "4y · Mumbai" },
      ],
    },
    {
      name: "Interview",
      count: 5,
      cards: [
        { initials: "RS", name: "Rahul Sharma", role: "Cloud Architect", tag: "11y · Bangalore" },
      ],
    },
    {
      name: "Offer",
      count: 2,
      cards: [
        { initials: "DP", name: "Divya Pillai", role: "Scrum Master", tag: "7y · Kochi" },
      ],
    },
  ];
  return (
    <div className="w-full bg-background text-foreground p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Patented search · e.g. Java AND (Spring OR Quarkus) AND Bangalore"
            className="pl-9 h-10 bg-card"
          />
        </div>
        <Button variant="outline" size="default">
          <Filter className="h-4 w-4 mr-1.5" /> Filters
        </Button>
        <Button size="default" className="bg-sky-500 hover:bg-sky-400 text-white">
          <Plus className="h-4 w-4 mr-1.5" /> New Job Order
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {stages.map((s) => (
          <div key={s.name} className="rounded-lg border border-border bg-card p-3 min-h-[260px]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-black uppercase tracking-wider text-foreground">{s.name}</p>
              <Badge variant="secondary" className="text-[10px]">{s.count}</Badge>
            </div>
            <div className="space-y-2">
              {s.cards.map((c) => (
                <div key={c.name} className="rounded-md border border-border bg-background p-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center text-[10px] font-black">
                      {c.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{c.role}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5">{c.tag}</p>
                </div>
              ))}
              <div className="rounded-md border border-dashed border-border h-12" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Avg Time-to-Submit", value: "2.4h" },
          { label: "AI-Suggested Matches", value: "184" },
          { label: "Active Job Orders", value: "32" },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-border bg-card p-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</p>
            <p className="text-xl font-black text-foreground mt-0.5">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScaledPreview({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      let s: number;
      if (w < 360) s = 0.65;
      else if (w < 480) s = 0.58;
      else if (w < 640) s = 0.5;
      else if (w < 820) s = 0.45;
      else s = 0.4;
      setScale(s);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const inv = `${(100 / scale).toFixed(2)}%`;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden rounded-2xl">
      <div
        aria-hidden
        // @ts-expect-error - inert is a valid HTML attribute, types lag
        inert=""
        tabIndex={-1}
        className="absolute top-0 left-0 origin-top-left pointer-events-none select-none"
        style={{
          width: inv,
          height: inv,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/95 to-transparent pointer-events-none" />
    </div>
  );
}

function SolutionSection({ section }: { section: Section }) {
  const ref = useScrollReveal<HTMLElement>();
  const Icon = section.icon;
  const Mock = section.id === "ats" ? AtsPipelinePreview : sectionMocks[section.id];

  return (
    <section
      ref={ref}
      id={section.id}
      className="reveal reveal-up py-16 md:py-24 bg-background border-b border-border"
      data-testid={`section-${section.id}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
            section.align === "right" ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 mb-5">
              <Icon className="h-3.5 w-3.5 text-sky-500" />
              <span className="text-sky-600 dark:text-sky-400 text-[11px] font-bold uppercase tracking-[0.2em]">
                {section.badge}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-[1.05] mb-5">
              {section.title} <span className="text-sky-500">{section.highlight}</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-7">
              {section.intro}
            </p>
            <ul className="space-y-3">
              {section.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3" data-testid={`bullet-${section.id}`}>
                  <CheckCircle2 className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-foreground/90 leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border ai-scan-line shadow-xl"
              style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 60%,#0d2137 100%)" }}
            >
              <div className="absolute inset-0 ai-grid-overlay opacity-40 pointer-events-none" />
              <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-sky-500/15 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-sky-500/15 blur-3xl" />

              <div className="absolute inset-3 rounded-xl overflow-hidden bg-background border border-white/10">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-muted/40">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                  <div className="ml-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                    Tilcons · {section.badge}
                  </div>
                </div>
                <div className="relative" style={{ height: "calc(100% - 30px)" }}>
                  {Mock ? (
                    <ScaledPreview>
                      <Mock />
                    </ScaledPreview>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ATS() {
  const heroRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const prevTitle = document.title;
    const tag = document.querySelector('meta[name="description"]');
    const prevDesc = tag?.getAttribute("content") ?? "";
    document.title = "Tilcons ATS — All-in-one ATS + CRM for Indian staffing agencies";
    tag?.setAttribute(
      "content",
      "Tilcons ATS replaces JobDiva, Bullhorn and Ceipal for Indian staffing agencies. Pipeline, CRM, onboarding, financials, VMS sync, job boards, e-signature and reports — one platform.",
    );
    return () => { document.title = prevTitle; tag?.setAttribute("content", prevDesc); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero — mirrors JobDiva "Staffing is in our DNA" */}
        <section
          className="relative overflow-hidden ai-scan-line"
          style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 60%,#0d2137 100%)" }}
          data-testid="section-ats-hero"
        >
          <div className="absolute inset-0 ai-grid-overlay pointer-events-none opacity-60" />
          <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-sky-500/10 blur-3xl" />

          <div
            ref={heroRef}
            className="reveal reveal-up relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8 py-24 md:py-36"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-sky-500/15 border border-sky-400/30 mb-7">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-sky-300 text-[11px] font-black uppercase tracking-[0.25em]">
                Solutions
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-5">
              Staffing is in our <span className="text-sky-400">DNA</span>
            </h1>
            <p className="text-lg md:text-xl text-sky-300 font-bold tracking-tight max-w-3xl mx-auto mb-5">
              The all-in-one ATS + CRM built for Indian staffing agencies.
            </p>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10">
              Tilcons' natively built core technologies let your teams laser-focus and streamline
              productivity in a single platform — collaborating at every stage and making more
              hires at scale. Our highly intuitive product is constantly iterating so you can stay
              far ahead of your competition and propel continuous growth.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-400 text-white font-bold uppercase tracking-wider shadow-lg shadow-sky-500/20" data-testid="button-request-demo">
                <Link href="/contact">
                  Request Demo <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/5 hover:bg-white/10 backdrop-blur border-white/20 text-white font-bold uppercase tracking-wider" data-testid="button-explore-product">
                <a href="#ats">Explore Product</a>
              </Button>
            </div>
          </div>

          {/* Curved bottom shape */}
          <div className="relative z-10">
            <svg viewBox="0 0 1440 80" className="block w-full h-12 md:h-20" preserveAspectRatio="none">
              <path d="M0,80 C480,0 960,0 1440,80 L1440,80 L0,80 Z" fill="hsl(var(--background))" />
            </svg>
          </div>
        </section>

        {/* Sticky in-page nav for the 6 solution areas */}
        <nav className="sticky top-16 z-40 bg-background/90 backdrop-blur border-b border-border" data-testid="nav-ats-sections">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 text-xs font-bold uppercase tracking-wider">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-muted-foreground hover:text-sky-500 transition-colors whitespace-nowrap"
                  data-testid={`nav-link-${s.id}`}
                >
                  {s.badge}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Business Advantages — JobDiva's signature 4-pillar framing */}
        <BusinessAdvantages />

        {sections.map((s) => (
          <SolutionSection key={s.id} section={s} />
        ))}

        {/* Patented + AI-native trust strip */}
        <PatentedStrip />

        {/* Closing CTA — "Transform your staffing business" */}
        <TransformCTA />
      </main>
      <Footer />
    </div>
  );
}

function BusinessAdvantages() {
  const ref = useScrollReveal<HTMLElement>();
  const pillars = [
    {
      icon: Gauge,
      title: "Process Acceleration",
      desc: "Compress every step of the recruiting lifecycle — from intake to placement — with intelligent automation that removes friction at every handoff.",
    },
    {
      icon: TrendingUp,
      title: "Operational Efficiency",
      desc: "One unified platform replaces the patchwork of point tools, spreadsheets and email threads that quietly drain your recruiters' productivity.",
    },
    {
      icon: MessagesSquare,
      title: "Candidate Engagement",
      desc: "Personalised outreach, two-way SMS, self-scheduled interviews and a polished candidate portal — keep talent warm from first contact to placement.",
    },
    {
      icon: Maximize2,
      title: "Business Scalability",
      desc: "Built for staffing agencies of every size. Add recruiters, clients, locations and brands without rebuilding your tech stack.",
    },
  ];
  return (
    <section
      ref={ref}
      className="reveal reveal-up py-16 md:py-24 bg-muted/30 border-b border-border"
      data-testid="section-business-advantages"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-sky-500 text-xs font-bold uppercase tracking-[0.25em] mb-2">
            Business Advantages
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-[1.05] mb-4">
            Built on four pillars that <span className="text-sky-500">grow your firm</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Tilcons isn't just software — it's a strategic operating system for the modern
            staffing business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal-stagger">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-xl border border-border bg-card hover:border-sky-500/40 transition-all hover-elevate"
              data-testid={`pillar-${title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="w-12 h-12 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black text-foreground mb-2 leading-snug">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PatentedStrip() {
  const ref = useScrollReveal<HTMLElement>();
  const pills = [
    "Patented Search Technology",
    "Native AI — Agastya",
    "Built by recruiters, for recruiters",
    "Enterprise-grade Security",
    "GDPR · DPDP · SOC 2 Aligned",
    "99.9% Uptime SLA",
  ];
  return (
    <section
      ref={ref}
      className="reveal reveal-up py-12 bg-background border-b border-border"
      data-testid="section-patented"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-5">
          <Award className="h-5 w-5 text-sky-500" />
          <p className="text-sky-500 text-xs font-bold uppercase tracking-[0.25em]">
            Patented & AI-native technology
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {pills.map((p) => (
            <span
              key={p}
              className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-muted border border-border text-foreground/80 text-xs font-semibold"
              data-testid={`pill-${p.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function TransformCTA() {
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      className="reveal reveal-up relative overflow-hidden ai-scan-line"
      style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 60%,#0d2137 100%)" }}
      data-testid="section-transform-cta"
    >
      <div className="absolute inset-0 ai-grid-overlay pointer-events-none opacity-50" />
      <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-sky-500/15 border border-sky-400/30 mb-6">
          <Rocket className="h-3.5 w-3.5 text-sky-400" />
          <span className="text-sky-300 text-[11px] font-black uppercase tracking-[0.25em]">
            Ready when you are
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.05] mb-5">
          Transform your <span className="text-sky-400">staffing business</span>
        </h2>
        <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
          See Tilcons live with your own data. Our team will walk you through the platform,
          answer your questions and show you how peer agencies are placing faster and billing sooner.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-400 text-white font-bold uppercase tracking-wider shadow-lg shadow-sky-500/20" data-testid="button-get-live-demo">
            <Link href="/contact">
              Get a Live Demo <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-white/5 hover:bg-white/10 backdrop-blur border-white/20 text-white font-bold uppercase tracking-wider" data-testid="button-download-ebook">
            <Link href="/career-advice">
              <Download className="h-4 w-4 mr-2" /> Download the eBook
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
