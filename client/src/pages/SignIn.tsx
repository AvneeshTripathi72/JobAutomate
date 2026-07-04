import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Eye, EyeOff, Loader2, BrainCircuit, Sparkles, Users2, BarChart3, CheckCircle2, ScanLine } from "lucide-react";
import { SiGoogle, SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import tilconsLogo from "@assets/Top_Logo_Tilcons_SkyBlue.png";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

const FEATURES = [
  {
    pill: "AI Resume Match",
    title: "AI Matching & Ranking",
    desc: "Tilcons' AI surfaces the strongest candidates per JD and ranks them on skill, role and experience fit — saving hours of manual screening.",
    icon: BrainCircuit,
  },
  {
    pill: "Pipeline OS",
    title: "Unified ATS + CRM Pipeline",
    desc: "Manage candidates, clients and submissions in one workspace. 8-stage pipeline tuned for Indian staffing — Applied to Joined.",
    icon: Users2,
  },
  {
    pill: "Hotlist & Bench",
    title: "Hotlist & Bench Marketing",
    desc: "Maintain a live hotlist of available consultants. Submit instantly to clients with rate, notes and AI-suggested matches.",
    icon: Sparkles,
  },
  {
    pill: "Naukri-first",
    title: "Naukri-first Distribution",
    desc: "Post once, distribute to Naukri, LinkedIn and free boards. Sourcing built for the Indian market, not retrofitted from the US.",
    icon: BarChart3,
  },
  {
    pill: "GST / TDS ready",
    title: "Indian Compliance, Out of the Box",
    desc: "Invoicing in INR, GST-ready exports, PF/ESI/TDS field templates — staffing operations meet Indian regulatory needs.",
    icon: ScanLine,
  },
];

const INDUSTRIES = [
  "Staffing & Recruiting Agencies",
  "IT Services & Consulting",
  "Healthcare Staffing",
  "BFSI & Financial Services",
  "Manufacturing & Engineering",
  "Internal / Corporate Hiring",
  "Global Capability Centres (GCCs)",
  "Other",
];

const TEAM_SIZES = ["1-5", "6-20", "21-50", "51-200", "200+"];

type TrialState = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  jobTitle: string;
  industry: string;
  teamSize: string;
};

const EMPTY_TRIAL: TrialState = {
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  jobTitle: "",
  industry: "",
  teamSize: "",
};

export default function SignIn() {
  useDocumentMeta(
    "Sign in to Tilcons — ATS + CRM",
    "Sign in to your Tilcons recruiter workspace, or request a free trial of the all-in-one ATS + CRM built for Indian staffing agencies.",
  );
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loginMutation } = useAuth();

  useEffect(() => {
    if (user) {
      const dest = (user as any).role === "super_admin" ? "/super-admin" : "/admin";
      window.location.replace(dest);
    }
  }, [user]);

  // ── Carousel ──
  const [feat, setFeat] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFeat((i) => (i + 1) % FEATURES.length), 4500);
    return () => clearInterval(id);
  }, []);
  const current = FEATURES[feat];
  const CurrentIcon = current.icon;

  // ── Tab state ──
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // ── Sign-in state ──
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const submitting = loginMutation.isPending;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || loginMutation.isPending) return;
    if (!username.trim() || !password) {
      toast({ title: "Missing fields", description: "Username and password are required.", variant: "destructive" });
      return;
    }
    loginMutation.mutate(
      { username: username.trim(), password },
      {
        onSuccess: (userData: any) => {
          toast({ title: "Welcome back", description: "Redirecting to your workspace…" });
          const dest = userData?.role === "super_admin" ? "/super-admin" : "/admin";
          window.location.replace(dest);
        },
      },
    );
  };

  // ── Trial / Sign-Up state ──
  const [trial, setTrial] = useState<TrialState>(EMPTY_TRIAL);
  const [agree, setAgree] = useState(false);
  const [trialDone, setTrialDone] = useState(false);

  const trialMutation = useMutation({
    mutationFn: async (data: TrialState) => {
      const messageBody = [
        `Free trial request from Tilcons sign-in page.`,
        ``,
        `Name: ${data.fullName}`,
        `Job title: ${data.jobTitle || "—"}`,
        `Company: ${data.companyName}`,
        `Industry: ${data.industry}`,
        `Team size: ${data.teamSize || "—"}`,
        `Phone: ${data.phone}`,
        `Email: ${data.email}`,
      ].join("\n");
      return apiRequest("POST", "/api/contacts", {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        company: data.companyName,
        inquiryType: "Demo Request",
        message: messageBody,
      });
    },
    onSuccess: () => {
      setTrialDone(true);
      toast({ title: "Request received", description: "Our team will reach out shortly." });
    },
    onError: (err: any) => {
      toast({ title: "Could not submit", description: err?.message ?? "Please try again.", variant: "destructive" });
    },
  });

  const handleTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trialMutation.isPending) return;
    if (!trial.fullName.trim() || !trial.companyName.trim() || !trial.email.trim() || !trial.phone.trim() || !trial.industry) {
      toast({ title: "Missing fields", description: "Please complete all required fields.", variant: "destructive" });
      return;
    }
    if (!agree) {
      toast({ title: "Please accept the terms", variant: "destructive" });
      return;
    }
    trialMutation.mutate({ ...trial, fullName: trial.fullName.trim(), email: trial.email.trim(), companyName: trial.companyName.trim(), phone: trial.phone.trim() });
  };

  const ssoToast = (provider: string) =>
    toast({ title: `${provider} sign-in coming soon`, description: "For now, please use your username and password." });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* ── LEFT: feature carousel (light) ── */}
      <aside className="relative lg:w-1/2 bg-slate-50 px-6 sm:px-12 py-10 lg:py-16 flex flex-col items-center justify-center overflow-hidden">
        <div className="max-w-xl w-full text-center relative z-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: NAVY }}>
            Fully Scalable, Fully Integrated
            <br />
            <span style={{ color: SKY }}>ATS + CRM for Indian Staffing</span>
          </h1>

          {/* Feature visual */}
          <div className="relative mt-10 mb-8 mx-auto w-full max-w-sm aspect-square">
            {/* Concentric orbit rings */}
            <div className="absolute inset-0 rounded-full border border-sky-200/70" />
            <div className="absolute inset-6 rounded-full border border-sky-200/60" />
            <div className="absolute inset-14 rounded-full border border-sky-200/50" />

            {/* Pill (top-left) */}
            <div
              className="absolute top-6 left-2 bg-white rounded-full px-3 py-2 shadow-md flex items-center gap-2 text-xs font-bold"
              style={{ color: NAVY }}
              data-testid="feature-pill"
              key={`pill-${feat}`}
            >
              <CurrentIcon className="h-4 w-4" style={{ color: SKY }} />
              {current.pill}
            </div>

            {/* Center "resume" card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 md:w-52 bg-white rounded-xl shadow-xl border border-border p-3 md:p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-sky-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2 rounded bg-slate-200 w-3/4" />
                  <div className="h-1.5 rounded bg-slate-100 w-1/2" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 rounded bg-slate-100 w-full" />
                <div className="h-1.5 rounded bg-slate-100 w-5/6" />
                <div className="h-1.5 rounded bg-slate-100 w-4/6" />
              </div>
              <div className="mt-3 flex items-center justify-center">
                <div className="rounded-full w-10 h-10 flex items-center justify-center" style={{ background: SKY }}>
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            {/* Score chip (bottom-left) */}
            <div className="absolute bottom-8 left-2 rounded-lg shadow-lg overflow-hidden">
              <div className="px-3 py-2 text-[10px] font-bold text-white" style={{ background: NAVY }}>Score</div>
              <div className="bg-white px-3 py-2 flex items-center gap-1.5 text-base font-black" style={{ color: NAVY }}>
                <span style={{ color: SKY }}>92%</span>
              </div>
            </div>

            {/* AI badge (bottom-left smaller) */}
            <div className="absolute bottom-0 left-12 w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg" style={{ background: "#f59e0b" }}>
              AI
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mb-5" data-testid="feature-dots">
            {FEATURES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show feature ${i + 1}`}
                onClick={() => setFeat(i)}
                className={`h-1.5 rounded-full transition-all ${i === feat ? "w-6" : "w-1.5"}`}
                style={{ background: i === feat ? SKY : "#cbd5e1" }}
                data-testid={`dot-${i}`}
              />
            ))}
          </div>

          <div key={`copy-${feat}`} className="animate-in fade-in duration-500">
            <h3 className="text-lg md:text-xl font-black" style={{ color: SKY }} data-testid="feature-title">{current.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">{current.desc}</p>
          </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} Tileshwar Consulting Services Pvt. Ltd. ·{" "}
          <Link href="/privacy" className="hover:underline">Privacy</Link> ·{" "}
          <Link href="/terms" className="hover:underline">Terms</Link>
        </div>
      </aside>

      {/* ── RIGHT: form panel (white) ── */}
      <main className="lg:w-1/2 flex items-center justify-center px-6 sm:px-10 py-10 lg:py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="flex justify-end mb-6">
            <Link href="/" data-testid="link-signin-home">
              <img src={tilconsLogo} alt="Tilcons" className="h-12 w-auto object-contain" />
            </Link>
          </div>

          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-1" style={{ color: NAVY }} data-testid="text-signin-heading">
            {tab === "signin" ? "Sign In" : "Sign Up"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {tab === "signin" ? (
              <>Don't have an account yet?{" "}
                <button type="button" onClick={() => setTab("signup")} className="font-bold hover:underline" style={{ color: SKY }} data-testid="link-switch-signup">Sign Up</button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button type="button" onClick={() => setTab("signin")} className="font-bold hover:underline" style={{ color: SKY }} data-testid="link-switch-signin">Sign In</button>
              </>
            )}
          </p>

          {tab === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4" data-testid="form-signin">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="sr-only">User Name</Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="User Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  data-testid="input-username"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="sr-only">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    data-testid="input-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="button-toggle-password"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    data-testid="checkbox-remember"
                  />
                  Remember me
                </label>
                <Link href="/reset-password" className="font-bold hover:underline" style={{ color: SKY }} data-testid="link-forgot-password">
                  Forgot Credentials?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-white font-bold uppercase tracking-wider text-sm"
                style={{ background: NAVY }}
                disabled={submitting}
                data-testid="button-submit-signin"
              >
                {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</>) : (<>Sign In</>)}
              </Button>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-muted-foreground">Unable to Login?</span>
                <Link href="/contact" className="font-bold hover:underline" style={{ color: SKY }} data-testid="link-unblock">
                  Unblock
                </Link>
              </div>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <span className="relative flex justify-center text-xs uppercase tracking-wider bg-white px-3 text-muted-foreground">or Sign in with</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => ssoToast("Google")} className="flex items-center justify-center gap-2 border border-border rounded-md py-2.5 text-sm font-bold hover-elevate active-elevate-2" data-testid="button-sso-google">
                  <SiGoogle className="h-4 w-4" style={{ color: "#4285F4" }} /> Google
                </button>
                <button type="button" onClick={() => ssoToast("LinkedIn")} className="flex items-center justify-center gap-2 border border-border rounded-md py-2.5 text-sm font-bold hover-elevate active-elevate-2" data-testid="button-sso-linkedin">
                  <SiLinkedin className="h-4 w-4" style={{ color: "#0A66C2" }} /> LinkedIn
                </button>
                <button type="button" onClick={() => ssoToast("Office 365")} className="flex items-center justify-center gap-2 border border-border rounded-md py-2.5 text-sm font-bold hover-elevate active-elevate-2" data-testid="button-sso-office">
                  <span className="h-4 w-4 inline-block bg-orange-500 rounded-sm" /> Office 365
                </button>
                <button type="button" onClick={() => ssoToast("Azure")} className="flex items-center justify-center gap-2 border border-border rounded-md py-2.5 text-sm font-bold hover-elevate active-elevate-2" data-testid="button-sso-azure">
                  <span className="h-4 w-4 inline-block bg-blue-500" style={{ clipPath: "polygon(0 100%, 60% 100%, 100% 0, 40% 0)" }} /> Azure
                </button>
              </div>
            </form>
          ) : trialDone ? (
            <div className="text-center py-8" data-testid="trial-success">
              <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-black mb-1" style={{ color: NAVY }}>Request received</h3>
              <p className="text-sm text-muted-foreground mb-5">Our team will reach out within one business day to set up your free Tilcons workspace.</p>
              <Button type="button" variant="outline" onClick={() => { setTrial(EMPTY_TRIAL); setAgree(false); setTrialDone(false); setTab("signin"); }} data-testid="button-back-signin">
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleTrialSubmit} className="space-y-3" data-testid="form-trial">
              <div className="space-y-1.5">
                <Label htmlFor="t-name" className="text-xs font-bold">Full Name *</Label>
                <Input id="t-name" value={trial.fullName} onChange={(e) => setTrial({ ...trial, fullName: e.target.value })} placeholder="Priya Sharma" data-testid="input-trial-name" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-company" className="text-xs font-bold">Company Name *</Label>
                <Input id="t-company" value={trial.companyName} onChange={(e) => setTrial({ ...trial, companyName: e.target.value })} placeholder="Acme Staffing Pvt. Ltd." data-testid="input-trial-company" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="t-email" className="text-xs font-bold">Work Email *</Label>
                  <Input id="t-email" type="email" value={trial.email} onChange={(e) => setTrial({ ...trial, email: e.target.value })} placeholder="priya@acme.com" data-testid="input-trial-email" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="t-phone" className="text-xs font-bold">Phone *</Label>
                  <Input id="t-phone" type="tel" value={trial.phone} onChange={(e) => setTrial({ ...trial, phone: e.target.value })} placeholder="+91 98765 43210" data-testid="input-trial-phone" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="t-jobtitle" className="text-xs font-bold">Job Title</Label>
                <Input id="t-jobtitle" value={trial.jobTitle} onChange={(e) => setTrial({ ...trial, jobTitle: e.target.value })} placeholder="Talent Acquisition Lead" data-testid="input-trial-jobtitle" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="t-industry" className="text-xs font-bold">Industry *</Label>
                  <Select value={trial.industry} onValueChange={(v) => setTrial({ ...trial, industry: v })}>
                    <SelectTrigger id="t-industry" data-testid="select-trial-industry"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="t-teamsize" className="text-xs font-bold">Team Size</Label>
                  <Select value={trial.teamSize} onValueChange={(v) => setTrial({ ...trial, teamSize: v })}>
                    <SelectTrigger id="t-teamsize" data-testid="select-trial-teamsize"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{TEAM_SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <label className="flex items-start gap-2 text-xs text-muted-foreground pt-1 cursor-pointer">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5" data-testid="checkbox-trial-agree" />
                <span>By registering you accept the <Link href="/terms" className="font-bold hover:underline" style={{ color: SKY }}>Terms and Conditions</Link>.</span>
              </label>
              <Button type="submit" size="lg" className="w-full text-white font-bold uppercase tracking-wider text-sm" style={{ background: NAVY }} disabled={trialMutation.isPending} data-testid="button-submit-trial">
                {trialMutation.isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>) : (<>Try It Free <ArrowRight className="ml-2 h-4 w-4" /></>)}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
