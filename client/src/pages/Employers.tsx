import { CheckCircle2, Users, Target, Zap, ShieldCheck, Globe, BarChart3, MessageSquare, ArrowRight, BrainCircuit } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import proactivePipelineVideo from "@assets/proactive_pipeline_video.mp4";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

export default function Employers() {
  useDocumentMeta(
    "For Employers",
    "Hire faster with Tilcons' AI-powered recruitment. Get qualified shortlists in 48 hours across India in technology, manufacturing, healthcare, finance and more."
  );
  return (
    <div className="min-h-screen" style={{ background: NAVY }}>
      <Header />

      <main>
        {/* ── HERO — navy bg, sky blue accents ── */}
        <section
          className="relative overflow-hidden py-8 md:py-10"
          style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #122b47 60%, #163554 100%)` }}
        >
          <div className="absolute inset-0 ai-grid-overlay pointer-events-none" />
          <div className="absolute inset-0 ai-hero-glow pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${SKY}, #38bdf8, ${SKY})` }} />
          <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${SKY}66, transparent)` }} />
          <div className="absolute top-8 right-16 ai-node hidden md:block" style={{ animationDelay: "0s" }} />
          <div className="absolute bottom-10 right-28 ai-node hidden md:block" style={{ animationDelay: "1.5s" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">

              {/* Left — headline */}
              <div>
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] mb-3 border"
                  style={{ background: `${SKY}1A`, borderColor: `${SKY}4D`, color: SKY }}
                >
                  <BrainCircuit className="h-3.5 w-3.5" />
                  AI-Powered Talent Acquisition
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white mb-4">
                  Hire the <br />
                  <span className="ai-gradient-text">Best Talent</span>
                </h1>
                <p className="text-white/65 text-lg leading-relaxed max-w-lg mb-6">
                  We connect leading organisations with exceptional professionals across diverse industries. Access our curated talent pool and find the perfect fit in record time.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { stat: "95%", label: "Placement Rate" },
                    { stat: "48h", label: "First Candidate" },
                  ].map(({ stat, label }) => (
                    <div
                      key={label}
                      className="pl-4"
                      style={{ borderLeft: `3px solid ${SKY}` }}
                    >
                      <p className="text-3xl font-black text-white">{stat}</p>
                      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: `${SKY}99` }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4">
                  <Link href="/upload-job-description">
                    <button
                      className="inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest px-8 py-4 rounded-md text-white transition-opacity hover:opacity-90"
                      style={{ background: SKY }}
                    >
                      Upload Job Now <ArrowRight className="h-5 w-5" />
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button
                      className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-md text-white transition-all hover:opacity-80"
                      style={{ border: `1px solid ${SKY}55`, background: `${SKY}15` }}
                    >
                      Talk to a Consultant
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right — feature cards */}
              <div className="space-y-3">
                {[
                  { icon: Zap, title: "Lightning Fast", desc: "Pre-vetted candidates delivered within 48 hours" },
                  { icon: ShieldCheck, title: "Quality Assured", desc: "Rigorous screening ensures perfect fit" },
                  { icon: Users, title: "Expert Team", desc: "Industry specialists managing every placement" },
                  { icon: Globe, title: "Global Network", desc: "Access to top-tier professionals worldwide" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 p-4 rounded-md transition-all"
                    style={{ background: `${SKY}12`, border: `1px solid ${SKY}30` }}
                  >
                    <div
                      className="w-11 h-11 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: SKY }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white uppercase tracking-wide mb-0.5">{title}</h3>
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES GRID — navy bg, sky blue icon accents ── */}
        <section className="py-20" style={{ background: "#0a1c30" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-xs font-black uppercase tracking-[0.25em] mb-3" style={{ color: SKY }}>
                What We Offer
              </p>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-3">
                Our Recruitment <span style={{ color: SKY }}>Solutions</span>
              </h2>
              <p className="max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
                Comprehensive staffing services tailored to your business needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
              {[
                { icon: Users, title: "Permanent Recruitment", desc: "Find long-term talent that aligns with your company culture and goals." },
                { icon: Zap, title: "Contract Staffing", desc: "Flexible workforce solutions for short-term projects and peak periods." },
                { icon: Target, title: "Executive Search", desc: "Discreet and targeted headhunting for senior leadership roles." },
                { icon: ShieldCheck, title: "Managed Services", desc: "End-to-end recruitment process outsourcing for high-volume needs." },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex flex-col items-center text-center p-8 rounded-md"
                  style={{ background: `${SKY}12`, border: `1px solid ${SKY}30` }}
                  data-testid={`service-tile-${title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div
                    className="w-14 h-14 rounded-md flex items-center justify-center mb-5"
                    style={{ background: SKY }}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-tight text-white mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US — navy bg ── */}
        <section className="py-20" style={{ background: NAVY }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="rounded-xl p-10 md:p-16 overflow-hidden relative"
              style={{ background: `${SKY}18`, border: `1px solid ${SKY}35` }}
            >
              {/* decorative number */}
              <div
                className="absolute right-6 bottom-4 text-[160px] font-black leading-none select-none pointer-events-none opacity-[0.06] text-white"
              >
                95
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                {/* Left — checklist */}
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] mb-3" style={{ color: SKY }}>
                    Why Tilcons
                  </p>
                  <h2 className="text-3xl md:text-4xl font-black text-white uppercase leading-tight mb-8">
                    Expertise that <br />
                    <span style={{ color: SKY }}>Drives Growth</span>
                  </h2>
                  <div className="space-y-5">
                    {[
                      { icon: Globe, text: "Global network of top-tier professionals across all sectors" },
                      { icon: BarChart3, text: "AI-powered candidate matching and predictive analytics for data-driven talent decisions" },
                      { icon: MessageSquare, text: "Dedicated account managers for seamless communication" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-4">
                        <div
                          className="w-11 h-11 rounded-md flex items-center justify-center shrink-0"
                          style={{ background: SKY }}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-white font-medium">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — stat boxes: alternating sky blue / navy */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { stat: "95%", label: "Fill Rate", sky: true },
                    { stat: "15+", label: "Sectors", sky: false },
                    { stat: "48h", label: "First CV", sky: false },
                    { stat: "250+", label: "Placements", sky: true },
                  ].map(({ stat, label, sky }) => (
                    <div
                      key={label}
                      className="rounded-md p-5 sm:p-8 text-center"
                      style={{ background: sky ? SKY : NAVY, border: `1px solid ${sky ? "transparent" : `${SKY}30`}` }}
                    >
                      <p className="text-2xl sm:text-4xl font-black text-white mb-1">{stat}</p>
                      <p className="text-xs font-black uppercase tracking-widest" style={{ color: sky ? "rgba(255,255,255,0.8)" : `${SKY}cc` }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

            <div className="lg:col-span-2 mt-6 overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <video autoPlay muted loop playsInline preload="metadata" className="block w-full">
                <source src={proactivePipelineVideo} type="video/mp4" />
              </video>
            </div>
            </div>
          </div>
        </section>

        {/* ── CTA — navy bg, sky blue accent button ── */}
        <section className="py-20 relative overflow-hidden" style={{ background: "#0a1c30" }}>
          {/* subtle sky blue top rule */}
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: SKY }} />
          <div
            className="absolute right-8 bottom-4 text-[160px] font-black leading-none select-none pointer-events-none opacity-[0.04] text-white"
          >
            Go
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] mb-3" style={{ color: SKY }}>
              Ready to Hire?
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight leading-tight">
              Find Your <span style={{ color: SKY }}>Next Hire</span>
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
              Partner with Tilcons today and experience the difference of specialist recruitment.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/upload-job-description">
                <button
                  className="inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest px-10 py-4 rounded-md text-white transition-opacity hover:opacity-90"
                  style={{ background: SKY }}
                >
                  Get Started Now <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/contact">
                <button
                  className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-widest px-10 py-4 rounded-md transition-all"
                  style={{ color: "#fff", background: `${SKY}18`, border: `1px solid ${SKY}45` }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = `${SKY}30`)}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = `${SKY}18`)}
                >
                  Talk to Us
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
