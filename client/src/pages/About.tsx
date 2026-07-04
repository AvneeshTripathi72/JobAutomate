import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Globe2, Users2, Zap, ArrowRight, BrainCircuit, CheckCircle2, Clock, Workflow } from "lucide-react";
import { Link } from "wouter";
import pipelineVideo from "@assets/proactive_pipeline_video.mp4";
import heroVideo from "@assets/generated_videos/bridge_connecting_talent_and_opportunity.mp4";
import resultsImg from "@assets/generated_images/Professional_recruitment_handshake_scene_8adf4970.png";
import leadershipImg from "@assets/generated_images/Executive_leadership_team_boardroom_6b7c5af6.png";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { useAuth } from "@/hooks/use-auth";
import { LogIn } from "lucide-react";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

export default function About() {
  const { user } = useAuth();
  useDocumentMeta(
    "About Tilcons",
    "Tilcons is built by Tileshwar Consulting Services to help Indian staffing agencies hire faster with AI-powered ATS, CRM, onboarding and reporting."
  );
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden">
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, ${NAVY}F0 0%, ${NAVY}CC 100%)` }}
        />
        <div className="absolute inset-0 ai-grid-overlay pointer-events-none" />
        <div className="absolute inset-0 ai-hero-glow pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${SKY}, #38bdf8, ${SKY})` }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${SKY}66, transparent)` }} />

        <div className="absolute top-8 right-16 ai-node hidden md:block" style={{ animationDelay: "0s" }} />
        <div className="absolute top-20 right-28 ai-node hidden md:block" style={{ animationDelay: "1.2s" }} />
        <div className="absolute bottom-12 right-20 ai-node hidden md:block" style={{ animationDelay: "2.4s" }} />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] mb-5 border" style={{ background: `${SKY}1A`, borderColor: `${SKY}4D`, color: SKY }}>
            <BrainCircuit className="h-3.5 w-3.5" />
            Who We Are
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
            About <span className="ai-gradient-text">Tilcons</span>
          </h1>
          <p className="text-lg md:text-xl text-white/75 max-w-3xl mx-auto leading-relaxed">
            Tilcons is a leader in executive search &amp; recruitment. With a vast network across markets, we specialise in permanent and interim placements, Board and Non-Executive Directors appointments, and executive talent advisory services.
          </p>
        </div>
      </section>

      {/* A Global Network */}
      <section className="py-12 md:py-20 bg-background border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div className="relative rounded-xl overflow-hidden shadow-lg group">
              <img src={leadershipImg} alt="Global network" className="w-full h-56 sm:h-72 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${NAVY}80 0%, transparent 55%)` }} />
              <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: SKY }} />
            </div>
            <div className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: SKY }}>Our Reach</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: NAVY }}>
                A Global Network of Connectors
              </h2>
              <div className="h-[3px] w-10 rounded-full" style={{ background: SKY }} />
              <p className="text-base text-muted-foreground leading-relaxed">
                We connect organisations across various sectors and sizes with exceptional leadership talent, unhindered by geographies or industry silos. Trusted by business leaders around the world, our team brings deep functional and industry expertise to every engagement.
              </p>
              <Link href="/contact">
                <Button
                  className="font-bold uppercase tracking-wider text-sm flex items-center gap-2"
                  style={{ background: SKY }}
                  data-testid="button-connect-with-us"
                >
                  Connect With Us <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Results Driven */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: SKY }}>Our Commitment</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: NAVY }}>
                Results-Driven Customer Satisfaction
              </h2>
              <div className="h-[3px] w-10 rounded-full" style={{ background: SKY }} />
              <p className="text-base text-muted-foreground leading-relaxed">
                Our commitment goes beyond placements; we build lasting partnerships and ensure a seamless recruitment experience from start to finish. With tailored solutions delivered swiftly and transparently, we guarantee a results-driven approach.
              </p>
              <Link href="/contact">
                <Button
                  className="font-bold uppercase tracking-wider text-sm flex items-center gap-2"
                  style={{ background: NAVY }}
                  data-testid="button-arrange-meeting"
                >
                  Arrange Meeting <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="order-1 lg:order-2 relative rounded-xl overflow-hidden shadow-lg group">
              <img src={resultsImg} alt="Success handshake" className="w-full h-56 sm:h-72 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${NAVY}80 0%, transparent 55%)` }} />
              <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: SKY }} />
            </div>
          </div>
        </div>
      </section>

      {/* Proactive Pipelining Process */}
      <section className="py-12 md:py-20 bg-background border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: SKY }}>
              Our Approach
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ color: NAVY }}>
              Proactive Pipelining Process
            </h2>
            <div className="h-[3px] w-10 rounded-full mx-auto mb-5" style={{ background: SKY }} />
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Our unique approach to talent acquisition ensures we have the right candidates ready before you even need them.
            </p>
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                number: "01",
                title: "Market Mapping",
                text: "We continuously track top performers across key industries, identifying high-potential talent long before they enter the job market.",
              },
              {
                number: "02",
                title: "Relationship Building",
                text: "Our consultants maintain ongoing dialogues with passive candidates, understanding their career aspirations and timing for next moves.",
              },
              {
                number: "03",
                title: "Talent Vetting",
                text: "Every professional in our pipeline undergoes rigorous screening and assessment, ensuring immediate readiness for placement.",
              },
            ].map((item) => (
              <div key={item.number} className="rounded-xl border bg-card p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: SKY }} />
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl font-black" style={{ color: `${SKY}33` }}>{item.number}</span>
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md"
                    style={{ background: `${SKY}15`, color: SKY }}
                  >
                    <Zap className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="text-lg font-black mb-3" style={{ color: NAVY }}>{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Why It Works banner */}
          <div
            className="rounded-xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #163554 100%)` }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: SKY }} />
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: SKY }}>
                Why It Works
              </p>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight">See Our Process in Action</h3>
              <p className="text-white/65 text-sm max-w-xl leading-relaxed">
                Reduces time-to-hire by up to 60% and provides access to the 'hidden' 80% of the candidate market that isn't actively applying.
              </p>
            </div>
            <Link href="/contact">
              <Button
                className="shrink-0 font-bold uppercase tracking-wider text-sm flex items-center gap-2"
                style={{ background: SKY }}
                data-testid="button-learn-more"
              >
                Learn More <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Pipeline video */}
          <div className="mt-10 rounded-xl overflow-hidden shadow-lg">
            <video
              src={pipelineVideo}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Stats / Conscious Leadership */}
      <section
        className="py-12 md:py-20 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #163554 100%)` }}
      >
        <div className="absolute inset-0 ai-grid-overlay pointer-events-none" />
        <div className="absolute inset-0 ai-hero-glow pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${SKY}, #38bdf8, ${SKY})` }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${SKY}4D, transparent)` }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: SKY }}>
            Our Impact
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
            Inspiring Conscious Leadership
          </h2>
          <div className="h-[3px] w-10 rounded-full mx-auto mb-6" style={{ background: SKY }} />
          <p className="text-base text-white/65 leading-relaxed max-w-3xl mx-auto mb-14">
            We believe that conscious leadership is key for creating diverse, inclusive, and sustainable organisations. By embedding effective principals into our own hiring strategies, we aim to lead by example.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "250+", label: "Placements" },
              { value: "40+", label: "Partners" },
              { value: "90%", label: "Satisfaction" },
              { value: "37", label: "Global Markets" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-xl p-6 text-center"
                style={{ background: `${SKY}15`, border: `1px solid ${SKY}30` }}
              >
                <p className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">{value}</p>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: `${SKY}CC` }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product · ATS + CRM — mirrors the Home page strip so inside/outside match */}
      <section className="py-12 md:py-20 bg-background border-b" data-testid="section-about-product">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: SKY }}>Our Product</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ color: NAVY }}>
              The all-in-one <span style={{ color: SKY }}>ATS + CRM</span> built for Indian staffing agencies
            </h2>
            <div className="h-[3px] w-10 rounded-full mx-auto mb-5" style={{ background: SKY }} />
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Live today: jobs, applications, hiring pipeline, clients &amp; deals. On the roadmap: Naukri distribution, GST invoicing, payroll and AI matching — published transparently so you always know what ships when.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl border bg-card p-5" data-testid="card-product-live">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-base font-black mb-1" style={{ color: NAVY }}>Live now</p>
              <p className="text-sm text-muted-foreground">ATS workflow, hiring pipeline, candidate portal, CRM clients &amp; deals, Outlook-powered notifications.</p>
            </div>
            <div className="rounded-xl border bg-card p-5" data-testid="card-product-q3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-base font-black mb-1" style={{ color: NAVY }}>Coming Q3 / Q4 2026</p>
              <p className="text-sm text-muted-foreground">AI resume screening, JD-to-test generation, proctored assessments, AI voice interviews, Naukri &amp; LinkedIn distribution, AI candidate ranking, GST invoicing.</p>
            </div>
            <div className="rounded-xl border bg-card p-5" data-testid="card-product-h1">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3">
                <Workflow className="h-5 w-5" />
              </div>
              <p className="text-base font-black mb-1" style={{ color: NAVY }}>H1 2027</p>
              <p className="text-sm text-muted-foreground">VMS connectors, PF/ESI/TDS payroll, mobile apps, public REST API + webhooks, DPDP compliance.</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Link href="/roadmap" data-testid="link-about-coming-soon-roadmap" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">Coming Soon</span>
              See the full ATS + CRM roadmap →
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/ai-recruiter">
                <Button
                  size="default"
                  data-testid="link-about-ai-recruiter"
                  className="font-bold uppercase tracking-wider text-sm text-white border-0"
                  style={{ background: "linear-gradient(135deg,#0d2137 0%,#0ea5e9 100%)" }}
                >
                  <BrainCircuit className="h-4 w-4 mr-2" /> Explore AI Recruiter <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/get-started">
                <Button variant="outline" size="default" data-testid="link-about-request-demo" className="font-bold uppercase tracking-wider text-sm">
                  Request Demo <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              {user ? (
                <Link href="/admin/ats">
                  <Button size="default" className="font-bold uppercase tracking-wider text-sm text-white" style={{ background: SKY }} data-testid="link-about-open-ats">
                    Open ATS Workspace <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link href="/signin">
                  <Button size="default" className="font-bold uppercase tracking-wider text-sm text-white" style={{ background: SKY }} data-testid="link-about-login-ats">
                    <LogIn className="h-4 w-4 mr-2" /> Login to ATS
                  </Button>
                </Link>
              )}
            </div>
            {!user && (
              <p className="text-xs text-muted-foreground text-center">
                Don't have an account yet?{" "}
                <Link href="/get-started" className="font-bold text-[#0ea5e9] hover:underline" data-testid="link-about-team-demo">
                  Reach our team for a demo →
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
