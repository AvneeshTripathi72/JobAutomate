import { useState } from "react";
import { Link } from "wouter";
import { IndianRupee, TrendingUp, Download, ChevronDown, ChevronRight, BarChart3, Briefcase, Code2, HeartPulse, Factory, ShoppingCart, Landmark, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const industries = [
  {
    id: "technology",
    icon: Code2,
    label: "Technology & IT",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    roles: [
      { title: "Software Engineer (3-5 yrs)", min: 12, max: 22, median: 16 },
      { title: "Senior Software Engineer", min: 20, max: 40, median: 28 },
      { title: "Tech Lead / Architect", min: 35, max: 65, median: 48 },
      { title: "Product Manager", min: 18, max: 40, median: 28 },
      { title: "Data Scientist", min: 14, max: 32, median: 22 },
      { title: "DevOps Engineer", min: 14, max: 30, median: 20 },
    ],
  },
  {
    id: "finance",
    icon: Landmark,
    label: "BFSI",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    roles: [
      { title: "Relationship Manager", min: 6, max: 14, median: 10 },
      { title: "Credit Analyst", min: 7, max: 16, median: 11 },
      { title: "Investment Banker (Analyst)", min: 12, max: 25, median: 18 },
      { title: "Risk Manager", min: 15, max: 35, median: 24 },
      { title: "CFO (Mid-size firm)", min: 40, max: 90, median: 60 },
      { title: "Compliance Officer", min: 10, max: 22, median: 15 },
    ],
  },
  {
    id: "healthcare",
    icon: HeartPulse,
    label: "Healthcare & Pharma",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    roles: [
      { title: "Medical Representative", min: 3, max: 7, median: 5 },
      { title: "Clinical Research Associate", min: 5, max: 12, median: 8 },
      { title: "Pharmacovigilance Analyst", min: 6, max: 14, median: 10 },
      { title: "Hospital Administrator", min: 8, max: 18, median: 13 },
      { title: "Regulatory Affairs Manager", min: 12, max: 28, median: 20 },
      { title: "Medical Director", min: 35, max: 80, median: 55 },
    ],
  },
  {
    id: "manufacturing",
    icon: Factory,
    label: "Manufacturing & Engineering",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    roles: [
      { title: "Production Supervisor", min: 5, max: 10, median: 7 },
      { title: "Quality Engineer", min: 5, max: 12, median: 8 },
      { title: "Plant Manager", min: 18, max: 40, median: 28 },
      { title: "Supply Chain Manager", min: 12, max: 28, median: 20 },
      { title: "Maintenance Engineer", min: 4, max: 10, median: 7 },
      { title: "VP Manufacturing", min: 35, max: 80, median: 55 },
    ],
  },
  {
    id: "retail",
    icon: ShoppingCart,
    label: "Retail & FMCG",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    roles: [
      { title: "Store Manager", min: 5, max: 12, median: 8 },
      { title: "Category Manager", min: 10, max: 22, median: 15 },
      { title: "Brand Manager", min: 12, max: 28, median: 20 },
      { title: "Key Account Manager", min: 8, max: 18, median: 13 },
      { title: "National Sales Manager", min: 25, max: 60, median: 40 },
      { title: "Chief Marketing Officer", min: 40, max: 90, median: 65 },
    ],
  },
];

function SalaryBar({ min, max, median }: { min: number; max: number; median: number }) {
  const absMax = 100;
  const minPct = (min / absMax) * 100;
  const maxPct = (max / absMax) * 100;
  const medianPct = (median / absMax) * 100;
  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="flex-1 relative h-2 bg-muted rounded-full overflow-visible">
        <div
          className="absolute h-2 bg-sky-200 dark:bg-sky-900 rounded-full"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        <div
          className="absolute w-3 h-3 bg-sky-500 rounded-full -top-0.5 ring-2 ring-background"
          style={{ left: `calc(${medianPct}% - 6px)` }}
        />
      </div>
    </div>
  );
}

export default function SalaryGuide() {
  const [openId, setOpenId] = useState<string>("technology");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 60%,#0d2137 100%)" }}>
        <div className="absolute inset-0 ai-grid-overlay pointer-events-none opacity-40" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 mb-6">
            <IndianRupee className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-sky-300 text-[11px] font-bold uppercase tracking-[0.2em]">India Salary Benchmarks 2025</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Know what the <span className="text-sky-400">market pays.</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Salary ranges across key industries and functions — drawn from Tilcons placements and market data across Tier 1 &amp; Tier 2 Indian cities. All figures in lakhs per annum (LPA).
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-8">
              <a href="#benchmarks">Explore Salaries</a>
            </Button>
            <Button asChild variant="outline" className="border-white/30 text-white bg-white/5 font-bold px-8">
              <Link href="/contact">Talk to a Recruiter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key stats */}
      <section className="py-10 border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Industries covered", value: "5+" },
              { label: "Roles benchmarked", value: "30+" },
              { label: "Placements sourced", value: "500+" },
              { label: "Data updated", value: "2025" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-black text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benchmarks */}
      <section id="benchmarks" className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2">Salary Benchmarks by Industry</h2>
            <p className="text-muted-foreground">Click an industry to expand. Ranges in <strong>Lakhs Per Annum (LPA)</strong>. <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-sky-500 inline-block" /> = median</span></p>
          </div>

          <div className="space-y-3">
            {industries.map((ind) => {
              const Icon = ind.icon;
              const isOpen = openId === ind.id;
              return (
                <div key={ind.id} className="border border-border rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover-elevate transition-colors"
                    onClick={() => setOpenId(isOpen ? "" : ind.id)}
                    data-testid={`button-industry-${ind.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${ind.bg} ${ind.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-4.5 w-4.5 h-5 w-5" />
                      </div>
                      <span className="font-bold text-foreground">{ind.label}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="border-t border-border px-5 py-4 bg-muted/20">
                      <div className="space-y-4">
                        <div className="hidden md:grid grid-cols-[2fr_1fr_3fr_auto] gap-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
                          <span>Role</span>
                          <span className="text-center">Median</span>
                          <span>Range (LPA)</span>
                          <span className="text-right">Max</span>
                        </div>
                        {ind.roles.map((role) => (
                          <div key={role.title} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_3fr_auto] gap-2 md:gap-4 items-center">
                            <span className="text-sm font-semibold text-foreground">{role.title}</span>
                            <span className="text-sm font-black text-sky-500 md:text-center">₹{role.median}L</span>
                            <SalaryBar min={role.min} max={role.max} median={role.median} />
                            <span className="text-xs text-muted-foreground text-right whitespace-nowrap">₹{role.min}L – ₹{role.max}L</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <p className="mt-8 text-xs text-muted-foreground text-center">
            Salary data is indicative, based on Tilcons placements and publicly available market surveys. Actual compensation varies by city, company size, and candidate profile.
            <Link href="/contact" className="text-sky-500 hover:underline ml-1">Contact us for a tailored benchmarking report.</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30 border-t">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="h-10 w-10 text-sky-500 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3">Need a custom benchmarking report?</h2>
          <p className="text-muted-foreground mb-8">
            Our team can prepare a detailed, role-specific salary analysis for your hiring plan — across any function, city, or industry.
          </p>
          <Button asChild size="lg" className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-10">
            <Link href="/contact">Request a Report</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
