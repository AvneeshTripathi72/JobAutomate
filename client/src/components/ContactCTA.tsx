import { Link } from "wouter";
import { Phone, Mail, ArrowRight, BrainCircuit } from "lucide-react";

export default function ContactCTA() {
  return (
    <section
      className="py-16 md:py-20 relative overflow-hidden ai-scan-line"
      style={{ background: "linear-gradient(135deg,#0d2137 0%,#163554 100%)" }}
    >
      <div className="absolute inset-0 ai-grid-overlay pointer-events-none" />
      <div className="absolute inset-0 ai-hero-glow pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, #0ea5e9, #38bdf8, #0ea5e9)" }} />

      <div className="absolute top-10 right-20 ai-node hidden md:block" style={{ animationDelay: "0s" }} />
      <div className="absolute bottom-12 left-16 ai-node hidden md:block" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/4 ai-node hidden md:block" style={{ animationDelay: "2s" }} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 flex items-center justify-center gap-1.5" style={{ color: "#0ea5e9" }}>
          <BrainCircuit className="h-3.5 w-3.5" />
          AI-Powered Connections
        </p>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-white/65 text-base mb-10 max-w-xl mx-auto leading-relaxed">
          Whether you're looking for your next opportunity or need to fill critical roles,
          our AI-driven team is here to help you succeed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/contact" data-testid="link-cta-contact">
            <button
              className="inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest px-8 py-4 rounded-md text-white transition-opacity hover:opacity-90"
              style={{ background: "#0ea5e9", boxShadow: "0 0 20px rgba(14,165,233,0.25)" }}
            >
              <Mail className="h-4 w-4" />
              Contact Us Today
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <a href="tel:+917276105036" data-testid="link-cta-phone">
            <button
              className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-md text-white transition-all hover:opacity-80"
              style={{ border: "1px solid rgba(14,165,233,0.5)", background: "rgba(14,165,233,0.15)" }}
            >
              <Phone className="h-4 w-4" />
              +91-7276105036
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}