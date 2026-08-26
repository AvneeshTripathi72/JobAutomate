import { BrainCircuit, Briefcase, Building2, Users, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AnimatedNumber from "./AnimatedNumber";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface PublicStats {
  activeJobs: number;
  partnerCompanies: number;
  registeredCandidates: number;
  successfulPlacements: number;
  publishedArticles: number;
  industriesCovered: number;
}

export default function StatsSection() {
  const { data } = useQuery<PublicStats>({ queryKey: ["/api/stats"] });
  const sectionRef = useScrollReveal<HTMLElement>();

  const stats = [
    {
      icon: Briefcase,
      value: data?.activeJobs ?? 0,
      suffix: "+",
      label: "Live Job Openings",
      testId: "stat-jobs",
    },
    {
      icon: Building2,
      value: data?.partnerCompanies ?? 0,
      suffix: "+",
      label: "Partner Companies",
      testId: "stat-companies",
    },
    {
      icon: Users,
      value: data?.registeredCandidates ?? 0,
      suffix: "+",
      label: "Registered Candidates",
      testId: "stat-candidates",
    },
    {
      icon: Sparkles,
      value: data?.industriesCovered ?? 0,
      suffix: "+",
      label: "Industries Served",
      testId: "stat-industries",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 relative overflow-hidden reveal reveal-up"
      style={{ background: "linear-gradient(135deg, #0d2137 0%, #122b47 50%, #163554 100%)" }}
    >
      <div className="absolute inset-0 ai-grid-overlay pointer-events-none" />
      <div className="absolute inset-0 ai-hero-glow pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.5), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.3), transparent)" }} />

      <div className="absolute top-6 left-10 ai-node hidden md:block" style={{ animationDelay: "0s" }} />
      <div className="absolute bottom-8 right-16 ai-node hidden md:block" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-12 right-1/3 ai-node hidden md:block" style={{ animationDelay: "0.7s" }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <p className="text-sky-400 text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-1.5">
            <BrainCircuit className="h-3.5 w-3.5" />
            Live Tilcons Numbers
          </p>
          <p className="text-white/60 text-xs mt-2 flex items-center justify-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Updated in real-time from our database
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 reveal-stagger">
          {stats.map(({ icon: Icon, value, suffix, label, testId }) => (
            <div key={label} className="text-center relative" data-testid={testId}>
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-sky-500/15 border border-sky-500/25 mb-3">
                <Icon className="h-5 w-5 text-sky-400" />
              </div>
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 text-white ai-gradient-text">
                <AnimatedNumber value={value} suffix={suffix} />
              </div>
              <div className="text-sm md:text-base text-white/80">
                {label}
              </div>
              <div className="mx-auto mt-3 w-8 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.5), transparent)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
