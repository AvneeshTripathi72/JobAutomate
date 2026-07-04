import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Loader2, MapPin, Briefcase, Filter, Bell, X, ArrowRight, BrainCircuit, Sparkles } from "lucide-react";
import { formatPostedDate } from "@/lib/utils";
import type { Job } from "@shared/schema";
import { useDocumentMeta } from "@/hooks/use-document-meta";

export default function Jobs() {
  useDocumentMeta(
    "Live Jobs",
    "Browse live jobs across India in technology, manufacturing, healthcare, finance, logistics and more. Apply directly to AI-matched roles via Tilcons."
  );
  const searchString = useSearch();
  const searchParams = useMemo(() => new URLSearchParams(searchString), [searchString]);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [locationTerm, setLocationTerm] = useState(searchParams.get("l") || "");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
    setLocationTerm(searchParams.get("l") || "");
  }, [searchParams]);

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const featuredJobs = [
    {
      id: "8d9dafb8-2bb8-4d08-b021-6de5d8cd400a",
      title: "Business Development Associate",
      company: "Tilcons Global",
      location: "New York, NY",
      jobType: "Full-time",
      industry: "Technology",
      description: "Tilcons Global is looking for a motivated Business Development Associate to join our New York team. You will be responsible for driving growth through strategic partnerships, lead generation, and client relationship management. Ideal candidates will have a strong background in sales development and a passion for professional services recruitment.",
      salary: "Competitive Package",
      postedDate: new Date()
    }
  ];

  const industries = ["Manufacturing", "Healthcare", "Technology", "Finance", "Administrative", "Logistics"];

  const filteredJobs = useMemo(() => {
    const allJobs = [...featuredJobs, ...jobs];
    return allJobs.filter(job => {
      const matchesSearch = !searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = !locationTerm ||
        job.location.toLowerCase().includes(locationTerm.toLowerCase());

      const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(job.industry);

      return matchesSearch && matchesLocation && matchesIndustry;
    });
  }, [jobs, searchTerm, locationTerm, selectedIndustries]);

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const hasFilters = searchTerm || locationTerm || selectedIndustries.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero / Search header */}
      <section className="py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 100%)" }}>
        <div className="absolute inset-0 ai-grid-overlay pointer-events-none" />
        <div className="absolute inset-0 ai-hero-glow pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, #0ea5e9, #38bdf8, #0ea5e9)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent)" }} />
        <div className="absolute top-6 right-12 ai-node hidden md:block" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-10 left-16 ai-node hidden md:block" style={{ animationDelay: "1.5s" }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] mb-5 border" style={{ background: "rgba(14,165,233,0.1)", borderColor: "rgba(14,165,233,0.3)", color: "#0ea5e9" }}>
              <BrainCircuit className="h-3.5 w-3.5" />
              Browse Opportunities
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Find Your <span className="ai-gradient-text">Next Role</span>
            </h1>
            <p className="text-white/60 text-base">
              Search across hundreds of live roles with Tilcons specialist consultants.
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 bg-white/5 backdrop-blur-xl p-3 rounded-xl border border-white/10">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-sky-400 transition-colors" />
                <Input
                  placeholder="Job title or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search-term"
                  className="h-11 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-sky-400/50 focus-visible:border-transparent"
                />
              </div>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-sky-400 transition-colors" />
                <Input
                  placeholder="City or region"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  data-testid="input-location-term"
                  className="h-11 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-sky-400/50 focus-visible:border-transparent"
                />
              </div>
              <Button
                className="h-11 bg-sky-500 hover:bg-sky-600 text-white font-bold uppercase tracking-wider text-xs px-6 flex items-center gap-2 whitespace-nowrap"
                data-testid="button-search"
              >
                <Sparkles className="h-4 w-4" /> AI Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-5">
              {/* Filter panel */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="h-1 w-full bg-sky-500" />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5 text-sky-500" /> Filters
                    </h2>
                    {hasFilters && (
                      <button
                        onClick={() => { setSearchTerm(""); setLocationTerm(""); setSelectedIndustries([]); }}
                        className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-sky-500 transition-colors flex items-center gap-1"
                        data-testid="button-clear-filters"
                      >
                        <X className="h-3 w-3" /> Clear
                      </button>
                    )}
                  </div>

                  <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">
                    Industry
                  </h3>
                  <div className="space-y-2.5">
                    {industries.map((industry) => (
                      <div
                        key={industry}
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => toggleIndustry(industry)}
                        data-testid={`filter-industry-${industry.toLowerCase()}`}
                      >
                        <Checkbox
                          id={industry}
                          checked={selectedIndustries.includes(industry)}
                          onCheckedChange={() => toggleIndustry(industry)}
                          className="rounded-sm data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                        />
                        <label
                          htmlFor={industry}
                          className={`text-sm cursor-pointer font-medium transition-colors ${
                            selectedIndustries.includes(industry)
                              ? "text-sky-500"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        >
                          {industry}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Job alerts CTA */}
              <div
                className="rounded-xl p-5 text-white space-y-3 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 100%)" }}
              >
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-sky-500/10 rounded-full blur-2xl" />
                <Bell className="h-7 w-7 text-sky-400" />
                <h3 className="text-sm font-black uppercase tracking-wider">Get Job Alerts</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Be the first to hear about new roles matching your expertise.
                </p>
                <Button
                  size="sm"
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5"
                  data-testid="button-create-alert"
                >
                  Create Alert <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </aside>

            {/* Job listings */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Results bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Showing{" "}
                      <span className="text-foreground">{filteredJobs.length}</span>{" "}
                      {filteredJobs.length === 1 ? "result" : "results"}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <Briefcase className="h-3 w-3" />
                      <span>Updated just now</span>
                    </div>
                  </div>

                  {filteredJobs.length > 0 ? (
                    <div className="space-y-4">
                      {filteredJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          {...job}
                          postedDate={formatPostedDate(job.postedDate)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="border border-border border-dashed rounded-xl p-16 text-center">
                      <div className="w-14 h-14 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                        <Search className="h-7 w-7 text-sky-500/50" />
                      </div>
                      <h4 className="text-lg font-black text-foreground uppercase tracking-tight mb-2">
                        No jobs found
                      </h4>
                      <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                        We couldn't find any roles matching your search. Try adjusting your filters.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => { setSearchTerm(""); setLocationTerm(""); setSelectedIndustries([]); }}
                        className="font-bold uppercase tracking-wider text-xs border-[#0d2137] text-[#0d2137] dark:border-white dark:text-white"
                        data-testid="button-clear-search"
                      >
                        View All Opportunities
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
