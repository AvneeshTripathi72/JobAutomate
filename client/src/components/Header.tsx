import { useState, useRef } from "react";
import { Link } from "wouter";
import { Menu, X, ChevronDown, LogIn, User, ShieldCheck, Building2, FileText, Lightbulb, Globe, Handshake, Search, LayoutDashboard, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import tilconsLogo from "@assets/Top_Logo_Tilcons_SkyBlue.png";
import { TilconsLogo } from "@/components/TilconsLogo";
import aboutMenuImage from "@assets/generated_images/Hero_office_collaboration_scene_5a689ad5.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobSeekersOpen, setJobSeekersOpen] = useState(false);
  const [employersOpen, setEmployersOpen] = useState(false);
  const [navCompanyOpen, setNavCompanyOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const jobSeekersTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const employersTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navCompanyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loginTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const makeHover = (setOpen: (v: boolean) => void, ref: React.MutableRefObject<NodeJS.Timeout | null>) => ({
    onMouseEnter: () => {
      if (ref.current) clearTimeout(ref.current);
      setOpen(true);
    },
    onMouseLeave: () => {
      ref.current = setTimeout(() => setOpen(false), 150);
    },
  });

  const handleJobSeekersEnter = () => {
    if (jobSeekersTimeoutRef.current) clearTimeout(jobSeekersTimeoutRef.current);
    setJobSeekersOpen(true);
  };
  const handleJobSeekersLeave = () => {
    jobSeekersTimeoutRef.current = setTimeout(() => setJobSeekersOpen(false), 150);
  };
  const handleEmployersEnter = () => {
    if (employersTimeoutRef.current) clearTimeout(employersTimeoutRef.current);
    setEmployersOpen(true);
  };
  const handleEmployersLeave = () => {
    employersTimeoutRef.current = setTimeout(() => setEmployersOpen(false), 150);
  };

  return (
    <>
      {/* ── Top ribbon (scrolls out of view naturally) ── */}
      <div className="hidden md:block bg-[#0d2137] border-b border-white/10 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end gap-1 h-11 overflow-visible">
            <div className="flex items-center gap-1 overflow-visible">

            {/* I'm a Candidate */}
            <div
              className="relative flex items-center h-11"
              onMouseEnter={handleJobSeekersEnter}
              onMouseLeave={handleJobSeekersLeave}
            >
              <button
                className={`flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider px-5 h-7 rounded-full transition-all ${
                  jobSeekersOpen
                    ? "bg-sky-400 text-white"
                    : "bg-sky-500 text-white hover:bg-sky-400"
                }`}
                data-testid="button-job-seekers-menu"
              >
                <User className="h-3.5 w-3.5" />
                I'm a Candidate
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${jobSeekersOpen ? "rotate-180" : ""}`} />
              </button>
              {jobSeekersOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 animate-in fade-in slide-in-from-top-2 duration-200 z-[200]">
                  <div className="w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-visible py-2">
                    <Link href="/jobs" data-testid="link-browse-jobs" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Search className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">Search Jobs</p>
                        <p className="text-xs text-muted-foreground">Find your next opportunity</p>
                      </div>
                    </Link>
                    <Link href="/submit-cv" data-testid="link-submit-cv-new" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">Submit CV</p>
                        <p className="text-xs text-muted-foreground">Let recruiters find you</p>
                      </div>
                    </Link>
                    <Link href="/career-advice" data-testid="link-career-advice" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">Career Advice</p>
                        <p className="text-xs text-muted-foreground">Expert tips for your journey</p>
                      </div>
                    </Link>

                    <div className="my-1.5 border-t border-slate-200 dark:border-slate-700" />

                    <Link href="/jobseeker-auth" data-testid="link-candidate-login" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600">
                        <LogIn className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">Login / Register Free</p>
                        <p className="text-xs text-muted-foreground">Access or create your candidate account</p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* I'm an Employer */}
            <div
              className="relative flex items-center h-11"
              onMouseEnter={handleEmployersEnter}
              onMouseLeave={handleEmployersLeave}
            >
              <button
                className={`flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider px-5 h-7 rounded-full border transition-all ${
                  employersOpen
                    ? "bg-white/15 border-white/50 text-white"
                    : "border-white/30 text-white/90 hover:bg-white/10 hover:border-white/50"
                }`}
                data-testid="button-employers-menu"
              >
                <Building2 className="h-3.5 w-3.5" />
                I'm an Employer
                <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide rounded-sm bg-emerald-500 text-white leading-none">NEW</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${employersOpen ? "rotate-180" : ""}`} />
              </button>
              {employersOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 animate-in fade-in slide-in-from-top-2 duration-200 z-[200]">
                  <div className="w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-visible py-2">
                    <Link href="/employers" data-testid="link-our-services" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">Our Services</p>
                        <p className="text-xs text-muted-foreground">Scalable staffing solutions</p>
                      </div>
                    </Link>
                    <Link href="/upload-job-description" data-testid="link-post-job" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">Upload Job Description</p>
                        <p className="text-xs text-muted-foreground">Hire top talent fast</p>
                      </div>
                    </Link>
                    <Link href="/industries" data-testid="link-industries-we-serve" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600">
                        <Globe className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">Industries We Serve</p>
                        <p className="text-xs text-muted-foreground">Expertise across sectors</p>
                      </div>
                    </Link>

                    <div className="my-1.5 border-t border-slate-200 dark:border-slate-700" />

                    <Link href="/vendor-registration" data-testid="link-become-partner" className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Handshake className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">Become a Partner</p>
                        <p className="text-xs text-muted-foreground">Vendor partnership program</p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ATS + CRM Login dropdown — recruiter workspace only */}
            <div
              className="relative flex items-center h-11"
              onMouseEnter={() => { if (loginTimeoutRef.current) clearTimeout(loginTimeoutRef.current); setLoginOpen(true); }}
              onMouseLeave={() => { loginTimeoutRef.current = setTimeout(() => setLoginOpen(false), 150); }}
            >
              <Link
                href="/signin"
                data-testid="button-login-ats-crm"
                className={`flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider px-5 h-7 rounded-full transition-all ${
                  loginOpen
                    ? "bg-white text-[#0d2137]"
                    : "bg-white/95 text-[#0d2137] hover:bg-white"
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                ATS + CRM Login
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${loginOpen ? "rotate-180" : ""}`} />
              </Link>
              {loginOpen && (
                <div className="absolute top-full right-0 pt-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden py-2">
                    <Link href="/signin" data-testid="link-login-ats-crm" className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
                        <LayoutDashboard className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">Sign in to your workspace</p>
                        <p className="text-xs text-muted-foreground">For ATS + CRM recruiters only</p>
                      </div>
                    </Link>

                    <div className="my-1.5 border-t border-border" />

                    <Link href="/get-started" data-testid="link-login-demo" className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Handshake className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">Don't have an account?</p>
                        <p className="text-xs text-muted-foreground">Reach our team for a demo →</p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky main header bar (sticks to the top) ── */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">

            {/* Integrated Logo (Desktop & Mobile) */}
            <Link href="/" data-testid="link-home" className="flex items-center flex-shrink-0">
              <TilconsLogo className="h-10 md:h-12 w-auto" />
            </Link>

            {/* LEFT nav: Home · About · Contact · Salary Guide */}
            <nav className="hidden md:flex items-center gap-1">
                <Link href="/" data-testid="link-nav-home" className="text-sm font-bold uppercase tracking-wider text-slate-600 hover:text-sky-600 px-3 py-2 rounded-md transition-colors">Home</Link>

                {/* ABOUT mega-menu (Company + Product) */}
                <div className="relative" {...makeHover(setNavCompanyOpen, navCompanyTimeoutRef)}>
                  <button data-testid="button-nav-company" className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wider px-3 py-2 rounded-md transition-colors ${navCompanyOpen ? "text-sky-600" : "text-slate-600 hover:text-sky-600"}`}>
                    About
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${navCompanyOpen ? "rotate-180" : ""}`} />
                  </button>
                  {navCompanyOpen && (
                    <div className="absolute top-full left-0 pt-1 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      <div className="w-[860px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                        <div className="p-6 grid grid-cols-4 gap-6">

                        {/* Column 1: Image card with CTA */}
                        <div className="flex flex-col">
                          <div className="rounded-lg overflow-hidden mb-3 aspect-[4/3] bg-muted">
                            <img src={aboutMenuImage} alt="Tilcons team" className="w-full h-full object-cover" />
                          </div>
                          <h4 className="text-base font-bold text-foreground mb-1.5">Start your career with us</h4>
                          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Tilcons changes lives by connecting talent with opportunity across India.</p>
                          <Link href="/jobs">
                            <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md" data-testid="button-menu-apply-now">Apply now</Button>
                          </Link>
                        </div>

                        {/* Column 2: Primary sub-nav */}
                        <div className="border-l border-border pl-6">
                          <Link href="/about" className="flex items-center justify-between gap-2 py-2.5 text-sm font-semibold text-foreground hover:text-primary transition-colors group">
                            <span>About Tilcons</span>
                            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                          </Link>
                          <Link href="/locations" className="flex items-center justify-between gap-2 py-2.5 text-sm font-semibold text-foreground hover:text-primary transition-colors group">
                            <span>Our Reach</span>
                            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                          </Link>
                          <Link href="/vendor-registration" className="flex items-center justify-between gap-2 py-2.5 text-sm font-semibold text-foreground hover:text-primary transition-colors group">
                            <span>Vendor Partners</span>
                            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                          </Link>
                        </div>

                        {/* Column 3: Our Success */}
                        <div>
                          <p className="pb-3 text-sm font-bold text-foreground">Our Success</p>
                          <div className="flex flex-col gap-2.5">
                            <Link href="/roadmap" className="text-sm text-muted-foreground hover:text-primary transition-colors">Roadmap</Link>
                            <Link href="/salary-guide" className="text-sm text-muted-foreground hover:text-primary transition-colors">Salary Guide 2025</Link>
                            <Link href="/career-advice" className="text-sm text-muted-foreground hover:text-primary transition-colors">Knowledge Hub</Link>
                            <Link href="/industries" className="text-sm text-muted-foreground hover:text-primary transition-colors">Industries</Link>
                          </div>
                        </div>

                        {/* Column 4: Our Product */}
                        <div>
                          <p className="pb-3 text-sm font-bold text-foreground">Our Product</p>
                          <div className="flex flex-col gap-2.5">
                            <Link href="/ats" className="text-sm text-muted-foreground hover:text-primary transition-colors">ATS Platform</Link>
                            <Link href="/crm" className="text-sm text-muted-foreground hover:text-primary transition-colors">CRM Workspace</Link>
                            <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Services</Link>
                          </div>
                        </div>

                        </div>

                        {/* Unified footer row: Coming Soon roadmap pill + Request Demo / Explore Product */}
                        <div className="border-t border-border bg-muted/30 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                          <Link href="/roadmap" data-testid="link-menu-coming-soon" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300 hover:text-amber-600 transition-colors">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 border border-amber-500/30">Coming Soon</span>
                            Naukri · GST · AI matching → See full roadmap
                          </Link>
                          <div className="flex items-center gap-2">
                            <Link href="/contact">
                              <Button size="sm" variant="outline" data-testid="button-menu-request-demo">Request Demo</Button>
                            </Link>
                            <Link href="/ats">
                              <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-white" data-testid="button-menu-explore-product">Explore Product</Button>
                            </Link>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>

                <Link href="/contact" data-testid="link-nav-contact" className="text-sm font-bold uppercase tracking-wider text-slate-600 hover:text-sky-600 px-3 py-2 rounded-md transition-colors">Contact</Link>

                <Link href="/salary-guide" data-testid="link-nav-salary-guide" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700 border border-slate-200 bg-white hover:border-sky-600 hover:text-sky-600 px-3 py-1.5 rounded-md transition-colors ml-1">
                  <IndianRupee className="h-3.5 w-3.5" />
                  Salary Guide
                </Link>

              </nav>

              {/* Right side: mobile hamburger only (employer actions moved into the "I'm an Employer" ribbon menu) */}
              <div className="flex items-center gap-1 ml-auto">

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 text-slate-600 hover:text-sky-600 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-8 animate-in slide-in-from-top duration-300 border-t mt-2">
              <nav className="flex flex-col gap-6 mt-4 px-2">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 flex items-center gap-1.5"><User className="h-3 w-3" />I'm a Candidate</p>
                  <Link href="/jobs" className="block px-3 py-2 text-base font-semibold text-foreground hover:text-primary transition-colors">Search Jobs</Link>
                  <Link href="/submit-resume" className="block px-3 py-2 text-base font-semibold text-foreground hover:text-primary transition-colors">Submit Resume</Link>
                  <Link href="/career-advice" className="block px-3 py-2 text-base font-semibold text-foreground hover:text-primary transition-colors">Career Advice</Link>
                  <Link href="/jobseeker-auth" className="block px-3 py-2 text-base font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 transition-colors">Login / Register Free</Link>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 flex items-center gap-1.5"><Building2 className="h-3 w-3" />I'm an Employer</p>
                  <Link href="/employers" className="block px-3 py-2 text-base font-semibold text-foreground hover:text-primary transition-colors">Our Services</Link>
                  <Link href="/upload-job-description" className="block px-3 py-2 text-base font-semibold text-foreground hover:text-primary transition-colors">Upload Job Description</Link>
                  <Link href="/industries" className="block px-3 py-2 text-base font-semibold text-foreground hover:text-primary transition-colors">Industries We Serve</Link>
                  <Link href="/vendor-registration" className="block px-3 py-2 text-base font-semibold text-foreground hover:text-primary transition-colors">Become a Partner</Link>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 flex items-center gap-1.5"><Globe className="h-3 w-3" />Company</p>
                  <Link href="/" className="block px-3 py-2 text-base font-semibold text-foreground hover:text-primary transition-colors">Home</Link>
                  <Link href="/about" className="block px-3 py-2 text-base font-semibold text-foreground hover:text-primary transition-colors">About</Link>
                  <Link href="/contact" className="block px-3 py-2 text-base font-semibold text-foreground hover:text-primary transition-colors">Contact</Link>
                </div>
                <div className="pt-4 border-t space-y-3">
                  <Link href="/jobseeker-auth" className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-md">
                    <User className="h-5 w-5" /> Candidate Portal
                  </Link>
                  <Link
                    href="/signin"
                    data-testid="link-mobile-login-ats-crm"
                    className="flex items-center gap-3 px-4 py-3 bg-[#0d2137] text-white rounded-xl font-bold shadow-md"
                  >
                    <LogIn className="h-5 w-5" /> ATS + CRM Login
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
