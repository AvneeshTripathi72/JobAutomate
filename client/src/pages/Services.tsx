import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import {
  Users,
  Search,
  ClipboardCheck,
  Briefcase,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

const services = [
  {
    icon: Search,
    title: "Permanent Recruitment",
    description:
      "End-to-end hiring for permanent roles — sourcing, screening, interviewing and offer management for full-time positions across functions.",
    points: [
      "Targeted talent mapping",
      "Structured competency screening",
      "Background and reference verification",
    ],
  },
  {
    icon: Users,
    title: "Contract & Contingent Staffing",
    description:
      "Flexible workforce solutions for project-based, seasonal or specialised hiring needs with full compliance and payroll handled.",
    points: ["Rapid deployment", "Compliance-first onboarding", "Scalable bench strength"],
  },
  {
    icon: Briefcase,
    title: "Executive Search",
    description:
      "Confidential leadership hiring for CXOs, VPs and senior specialist roles, backed by deep market intelligence and discreet outreach.",
    points: ["Industry-mapped longlists", "Leadership assessment", "Onboarding support"],
  },
  {
    icon: ClipboardCheck,
    title: "Recruitment Process Outsourcing (RPO)",
    description:
      "Run all or part of your talent acquisition function with embedded recruiters, tooling and reporting tailored to your hiring volume.",
    points: ["Dedicated delivery pods", "ATS-agnostic operations", "Live SLAs and dashboards"],
  },
  {
    icon: HeartHandshake,
    title: "Employer Branding & Talent Advisory",
    description:
      "Strengthen your candidate experience and employer story so the right people apply, accept and stay long-term.",
    points: ["Career site audits", "Job description optimisation", "Talent market insights"],
  },
];

export default function Services() {
  useDocumentMeta(
    "Recruitment Services",
    "Tilcons recruitment services — permanent hiring, contract staffing, executive search, RPO and employer-branding advisory across India.",
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3d5c 60%, ${NAVY} 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 mb-6">
            <Sparkles className="h-3.5 w-3.5" style={{ color: SKY }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: SKY }}>
              What we do
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white max-w-3xl leading-tight">
            Recruitment services built around how you actually hire
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mt-5">
            From a single critical role to fully-managed talent operations, our
            services are designed to fit the way your business grows — with speed,
            quality and accountability built in.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/employers">
              <button
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-xs font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                style={{ background: SKY }}
                data-testid="button-services-hire"
              >
                Hire with us <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
            <Link href="/contact">
              <button
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-xs font-black uppercase tracking-widest text-white border border-white/20 hover:bg-white/5 transition-colors"
                data-testid="button-services-contact"
              >
                Talk to a consultant
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map(({ icon: Icon, title, description, points }) => (
              <article
                key={title}
                className="rounded-xl border bg-card p-6 hover-elevate transition-all"
                data-testid={`card-service-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              >
                <div
                  className="w-11 h-11 rounded-md flex items-center justify-center mb-4"
                  style={{ background: `${SKY}18` }}
                >
                  <Icon className="h-5 w-5" style={{ color: SKY }} />
                </div>
                <h2 className="text-lg font-black mb-2" style={{ color: NAVY }}>
                  {title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                <ul className="mt-4 space-y-2">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: SKY }} />
                      <span className="text-foreground/80">{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Looking for sector-specific expertise?
            </p>
            <Link href="/industries">
              <button
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-xs font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                style={{ background: NAVY }}
                data-testid="button-services-industries"
              >
                Browse industries we serve <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
