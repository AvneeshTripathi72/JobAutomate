import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Search, MapPin, BrainCircuit, Sparkles } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_office_collaboration_scene_5a689ad5.png";

export default function Hero() {
  const [, setLocation] = useLocation();
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle) params.append("q", searchTitle);
    if (searchLocation) params.append("l", searchLocation);
    setLocation(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[300px] md:min-h-[360px] flex items-center overflow-hidden">
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d2137]/95 via-[#0d2137]/85 to-[#0d2137]/40" />

      <div className="absolute inset-0 ai-grid-overlay pointer-events-none" />
      <div className="absolute inset-0 ai-hero-glow pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, #0ea5e9, #38bdf8, #0ea5e9)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent)" }} />

      <div className="absolute top-8 right-12 ai-node hidden md:block" style={{ animationDelay: "0s" }} />
      <div className="absolute top-20 right-32 ai-node hidden md:block" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-16 right-20 ai-node hidden md:block" style={{ animationDelay: "2s" }} />
      <div className="absolute top-12 right-20 ai-connection-line w-24 hidden md:block" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] mb-5 border" style={{ background: "rgba(14,165,233,0.1)", borderColor: "rgba(14,165,233,0.3)", color: "#0ea5e9" }}>
            <BrainCircuit className="h-3.5 w-3.5" />
            AI-Powered Recruitment
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight mb-6 md:mb-8">
            Find a job that's<br />
            <span className="ai-gradient-text">right for you.</span>
          </h1>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row rounded-md overflow-hidden shadow-2xl border border-white/10"
            style={{ boxShadow: "0 0 30px rgba(14,165,233,0.1)" }}
          >
            <div className="flex-1 flex items-center bg-white px-4 border-r border-slate-200">
              <Search className="h-4 w-4 text-slate-400 shrink-0 mr-3" />
              <Input
                data-testid="input-job-search"
                placeholder="Job title or keywords"
                className="border-none shadow-none focus-visible:ring-0 text-slate-800 placeholder:text-slate-400 py-4 h-auto text-sm"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center bg-white px-4">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0 mr-3" />
              <Input
                data-testid="input-location-search"
                placeholder="City or region"
                className="border-none shadow-none focus-visible:ring-0 text-slate-800 placeholder:text-slate-400 py-4 h-auto text-sm"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <button
              type="submit"
              data-testid="button-search-submit"
              className="bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-bold px-8 py-4 text-sm uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              AI Search
            </button>
          </form>

          <div className="flex items-center gap-x-4 gap-y-1 mt-3 md:mt-4 flex-wrap">
            <span className="text-white/50 text-xs uppercase tracking-wider flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              Trending:
            </span>
            {["Technology", "Finance", "Healthcare", "Manufacturing", "Executive"].map((s) => (
              <button
                key={s}
                onClick={() => setLocation(`/jobs?q=${s}`)}
                className="text-white/70 hover:text-sky-400 text-xs transition-colors underline underline-offset-2 decoration-white/20 hover:decoration-sky-400"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}