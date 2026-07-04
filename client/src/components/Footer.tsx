import { Link } from "wouter";
import { Facebook, Linkedin, BrainCircuit } from "lucide-react";
import tilconsLogo from "@assets/Top_Logo_Tilcons_SkyBlue.png";

export default function Footer() {
  return (
    <footer className="relative border-t border-card-border overflow-hidden" style={{ background: "linear-gradient(180deg, #0d2137 0%, #091a2d 100%)" }}>
      <div className="absolute inset-0 ai-grid-overlay pointer-events-none opacity-40" />
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent)" }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="block mb-4">
              <div className="bg-white rounded px-2.5 py-1.5 inline-block">
                <img src={tilconsLogo} alt="Tilcons" className="h-12 w-auto object-contain" />
              </div>
            </Link>
            <p className="text-sm text-white/50 mb-4 leading-relaxed">
              Connecting exceptional talent with outstanding opportunities across the globe since 2024.
            </p>
            <div className="flex items-center gap-1.5 mb-4">
              <BrainCircuit className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">AI-Powered Recruitment</span>
            </div>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/tilcons" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md text-white/40 hover:text-sky-400 transition-colors" data-testid="link-facebook" aria-label="Visit Tilcons on Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/tilcons" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md text-white/40 hover:text-sky-400 transition-colors" data-testid="link-linkedin" aria-label="Visit Tilcons on LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">For Job Seekers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="text-white/50 hover:text-sky-400 transition-colors px-2 py-1 block" data-testid="link-footer-browse-jobs">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/submit-resume" className="text-white/50 hover:text-sky-400 transition-colors px-2 py-1 block" data-testid="link-footer-submit-resume">
                  Submit Resume
                </Link>
              </li>
              <li>
                <Link href="/career-advice" className="text-white/50 hover:text-sky-400 transition-colors px-2 py-1 block" data-testid="link-footer-career-advice">
                  Career Advice
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/upload-job-description" className="text-white/50 hover:text-sky-400 transition-colors px-2 py-1 block" data-testid="link-footer-post-job">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/employers" className="text-white/50 hover:text-sky-400 transition-colors px-2 py-1 block" data-testid="link-footer-our-services">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/industries" className="text-white/50 hover:text-sky-400 transition-colors px-2 py-1 block" data-testid="link-footer-industries">
                  Industries We Serve
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-white/50 hover:text-sky-400 transition-colors px-2 py-1 block" data-testid="link-footer-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/50 hover:text-sky-400 transition-colors px-2 py-1 block" data-testid="link-footer-contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-white/50 hover:text-sky-400 transition-colors px-2 py-1 block" data-testid="link-footer-roadmap">
                  Product Roadmap
                </Link>
              </li>
              <li>
                <Link href="/locations" className="text-white/50 hover:text-sky-400 transition-colors px-2 py-1 block" data-testid="link-footer-locations">
                  Locations
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 pb-8">
          <div className="rounded-lg p-6 text-center" style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)" }}>
            <h3 className="text-lg font-semibold text-white mb-2">For Vendor Partners</h3>
            <p className="text-sm text-white/50 mb-4 max-w-2xl mx-auto">
              Join our network of trusted staffing agencies and service providers. Partner with Tilcons to expand your reach and grow your business.
            </p>
            <Link href="/vendor-registration" className="inline-flex items-center justify-center px-6 py-3 text-white rounded-md font-medium text-sm transition-opacity hover:opacity-90" style={{ background: "#0ea5e9", boxShadow: "0 0 15px rgba(14,165,233,0.2)" }} data-testid="link-footer-vendor-registration">
              Become a Partner
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <div className="text-center md:text-left">
              <p>&copy; 2024 Tileshwar Consulting Services Pvt. Ltd. All rights reserved.</p>
              <p className="text-xs mt-1">Doing business as Tilcons</p>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-sky-400 transition-colors px-2 py-1 rounded-md" data-testid="link-privacy">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-sky-400 transition-colors px-2 py-1 rounded-md" data-testid="link-terms">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}