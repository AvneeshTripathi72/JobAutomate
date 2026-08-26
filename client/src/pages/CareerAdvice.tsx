import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileText, Briefcase, Clock, User, X, ArrowRight, ChevronRight, BrainCircuit } from "lucide-react";
import type { Article } from "@shared/schema";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const CATEGORIES = ["All", "Career Advice", "Interview Tips", "Hiring Insights"];

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  const paragraphs = article.content.split("\n\n").filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative ml-auto w-full max-w-2xl bg-background h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover-elevate"
            data-testid="button-close-article"
            aria-label="Close article"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="text-sm text-muted-foreground">Back to articles</span>
        </div>

        <div className="flex-1 px-6 py-8">
          <p className="text-sky-500 text-[10px] font-bold uppercase tracking-widest mb-4">
            {article.category}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {article.readTime}
            </span>
            <span>{formatDate(article.publishedDate)}</span>
          </div>

          <div className="prose prose-gray max-w-none space-y-5">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-base text-foreground/90 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>

        <div className="px-6 py-6 border-t bg-muted/30">
          <p className="text-sm text-muted-foreground mb-3">Ready to take the next step?</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/jobs">
              <Button size="sm" data-testid="link-read-browse-jobs">
                <Briefcase className="h-4 w-4 mr-1.5" /> Browse Jobs
              </Button>
            </Link>
            <Link href="/submit-resume">
              <Button size="sm" variant="outline" data-testid="link-read-submit-resume">
                <FileText className="h-4 w-4 mr-1.5" /> Submit Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ article, onClick }: { article: Article; onClick: () => void }) {
  return (
    <div
      className="group border border-border rounded-xl overflow-hidden bg-background hover:border-sky-500/40 transition-all cursor-pointer hover-elevate flex flex-col h-full"
      onClick={onClick}
      data-testid={`card-article-${article.id}`}
    >
      <div className="h-1.5 w-full bg-sky-500" />
      <div className="p-6 flex flex-col flex-1">
        <p className="text-sky-500 text-[10px] font-bold uppercase tracking-widest mb-3">
          {article.category}
        </p>
        {!article.published && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-2">
            Draft
          </span>
        )}
        <h3 className="text-base font-black text-foreground mb-3 leading-snug group-hover:text-sky-500 transition-colors">
          {article.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-grow">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {article.readTime}
            </span>
            <span>{formatDate(article.publishedDate)}</span>
          </div>
          <span className="flex items-center gap-1 text-sky-500 font-bold text-xs uppercase tracking-wide group-hover:gap-2 transition-all">
            Read More <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CareerAdvice() {
  useDocumentMeta(
    "Career Advice & Hiring Insights",
    "Expert career advice, interview tips and hiring insights from Tilcons recruiters. Read the latest articles to land your next role or build a winning team."
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const publishedArticles = articles.filter((a) => a.published);

  const filtered = activeCategory === "All"
    ? publishedArticles
    : publishedArticles.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}

      {/* Hero */}
      <section className="py-12 md:py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 100%)" }}>
        <div className="absolute inset-0 ai-grid-overlay pointer-events-none" />
        <div className="absolute inset-0 ai-hero-glow pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, #0ea5e9, #38bdf8, #0ea5e9)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent)" }} />
        <div className="absolute top-8 right-16 ai-node hidden md:block" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-10 left-20 ai-node hidden md:block" style={{ animationDelay: "1.5s" }} />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] mb-5 border" style={{ background: "rgba(14,165,233,0.1)", borderColor: "rgba(14,165,233,0.3)", color: "#0ea5e9" }}>
            <BrainCircuit className="h-3.5 w-3.5" />
            Knowledge Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight tracking-tight">
            Career Advice &amp; <span className="ai-gradient-text">Insights</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Practical guidance from our recruitment experts to help you find, win, and grow in the right role.
          </p>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-16 md:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider border transition-colors ${
                  activeCategory === cat
                    ? "bg-[#0d2137] text-white border-[#0d2137]"
                    : "bg-background text-muted-foreground border-border hover:border-sky-500/50 hover:text-foreground"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({publishedArticles.filter((a) => a.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No articles in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => setSelectedArticle(article)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 100%)" }}
      >
        <div className="absolute inset-0 ai-grid-overlay pointer-events-none" />
        <div className="absolute inset-0 ai-hero-glow pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, #0ea5e9, #38bdf8, #0ea5e9)" }} />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#0ea5e9" }}>
            Take the Next Step
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
            Ready to Find Your Next Role?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Browse our latest opportunities or submit your CV and let our consultants find the right match for you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/jobs" data-testid="link-cta-browse-jobs">
              <button
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                style={{ background: "#0ea5e9" }}
              >
                <Briefcase className="h-4 w-4" /> Browse Jobs
              </button>
            </Link>
            <Link href="/submit-resume" data-testid="link-cta-submit-resume">
              <button
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-80"
                style={{ border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.08)" }}
              >
                <FileText className="h-4 w-4" /> Submit Your CV
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
