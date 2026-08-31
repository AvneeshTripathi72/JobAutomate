import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertJobSeekerSchema, jobSeekerLoginSchema } from "@shared/schema";
import type { InsertJobSeeker, JobSeekerLoginCredentials } from "@shared/schema";
import {
  UserCircle, Mail, Lock, Phone, Briefcase, TrendingUp,
  ArrowRight, CheckCircle2, Shield, Zap,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

export default function JobSeekerAuth() {
  useDocumentMeta(
    "Candidate Sign In & Register",
    "Sign in or create your free Tilcons candidate account to access exclusive jobs, track applications and get matched by our AI-powered recruitment team."
  );
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  // Read ?tab=register or ?tab=login from the URL so the candidate
  // dropdown links can deep-link to the right tab.
  const getInitialTab = (): "login" | "register" => {
    if (typeof window === "undefined") return "login";
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") === "register" ? "register" : "login";
  };
  const [activeTab, setActiveTab] = useState<"login" | "register">(getInitialTab);
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, []);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const loginForm = useForm<JobSeekerLoginCredentials>({
    resolver: zodResolver(jobSeekerLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<InsertJobSeeker>({
    resolver: zodResolver(insertJobSeekerSchema),
    defaultValues: {
      fullName: "", email: "", password: "",
      phone: "", currentPosition: "", experienceLevel: "",
    },
  });

  const forgotMutation = useMutation({
    mutationFn: async (email: string) => {
      await apiRequest("POST", "/api/jobseekers/forgot-password", { email });
    },
    onSuccess: () => {
      // Neutral, enumeration-safe message: does not confirm the account
      // exists, AND does not promise successful delivery (so a silent
      // mail-provider outage doesn't leave the user thinking an email is
      // on the way). Identical body for unknown emails and for known
      // emails whose delivery failed server-side, so no enumeration leak.
      toast({
        title: "Request received",
        description:
          "If an account exists for that email, we'll attempt to send a reset link (valid 1 hour). If you don't receive it within 10 minutes, please check spam or contact support@tilcons.com.",
      });
      setShowForgot(false);
      setForgotEmail("");
    },
    onError: () => {
      // Transport-level failure only (the server itself returns 200 for
      // forgot-password regardless of mail outcome, to avoid enumeration).
      toast({
        title: "Network error",
        description:
          "We couldn't reach the server. Please check your connection and try again.",
        variant: "destructive",
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: JobSeekerLoginCredentials) =>
      apiRequest("POST", "/api/jobseekers/login", data),
    onSuccess: () => {
      toast({ title: "Welcome back!", description: "You've successfully logged in." });
      setLocation("/jobseeker-dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertJobSeeker) =>
      apiRequest("POST", "/api/jobseekers/register", data),
    onSuccess: (data, variables) => {
      toast({
        title: "Account created!",
        description: "Logging you in...",
      });
      // Automatically login the user after successful registration
      loginMutation.mutate({ email: variables.email, password: variables.password });
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Unable to create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const fieldClass =
    "w-full bg-white/5 border border-white/15 rounded-md px-3 py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#0ea5e9] transition-colors";
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section
        className="relative pt-16 pb-0 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #163554 100%)` }}
      >
        <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: SKY }} />
        {/* subtle radial glow */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full opacity-30 blur-3xl"
          style={{ background: `radial-gradient(circle, ${SKY} 0%, transparent 70%)` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: SKY }}>
            Your Career · Your Move
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.1] max-w-3xl">
            Get hired faster with <span style={{ color: SKY }}>India's smarter</span> staffing partner.
          </h1>
          <p className="text-white/70 text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
            Let Tilcons' AI-powered recruiters match you to the right roles — often before they ever hit a public job board.
          </p>

          {/* Trust strip */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-white/80">
            {[
              { icon: Zap, text: "AI-matched opportunities" },
              { icon: Shield, text: "Confidential profile" },
              { icon: Briefcase, text: "Exclusive off-market roles" },
              { icon: CheckCircle2, text: "Free for candidates, always" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm font-semibold">
                <Icon className="h-4 w-4" style={{ color: SKY }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-10 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #163554 100%)` }} />
          <div
            className="absolute bottom-0 left-0 right-0 h-10 bg-background"
            style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
          />
        </div>
      </section>

      {/* Main */}
      <section className="py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 items-start">

            {/* Left — benefits */}
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight mb-6" style={{ color: NAVY }}>
                Why register with Tilcons?
              </h2>
              <div className="space-y-4 mb-10">
                {[
                  "Access exclusive jobs not listed publicly",
                  "Dedicated recruiter assigned to your profile",
                  "Track your applications in real time",
                  "Confidential and secure job matching",
                  "Expert CV review and career guidance",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: SKY }}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium leading-snug" style={{ color: NAVY }}>{text}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Zap, stat: "24h", label: "Response time" },
                  { icon: Shield, stat: "100%", label: "Confidential" },
                  { icon: Briefcase, stat: "250+", label: "Placements" },
                ].map(({ icon: Icon, stat, label }) => (
                  <div
                    key={label}
                    className="rounded-md p-4 flex flex-col items-center text-center"
                    style={{ background: NAVY }}
                  >
                    <Icon className="h-5 w-5 mb-2" style={{ color: SKY }} />
                    <span className="text-xl font-black text-white">{stat}</span>
                    <span className="text-xs text-white/50 mt-0.5">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — auth card */}
            <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: NAVY }}>
              {/* Tab switcher */}
              <div className="grid grid-cols-2 border-b border-white/10">
                {(["login", "register"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    data-testid={`tab-${tab}`}
                    className="py-4 text-xs font-black uppercase tracking-widest transition-colors relative"
                    style={{
                      color: activeTab === tab ? SKY : "rgba(255,255,255,0.4)",
                      background: "transparent",
                    }}
                  >
                    {tab === "login" ? "Sign In" : "Register"}
                    {activeTab === tab && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ background: SKY }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {/* FORGOT PASSWORD */}
                {activeTab === "login" && showForgot && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (forgotEmail.trim()) forgotMutation.mutate(forgotEmail.trim());
                    }}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="text-white text-sm font-black uppercase tracking-widest mb-1">
                        Reset your password
                      </h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Enter the email associated with your candidate account and we'll send you a link to reset your password.
                      </p>
                    </div>

                    <div>
                      <Label className={labelClass} htmlFor="forgot-email">Email</Label>
                      <div className="relative">
                        <Mail className={iconClass} />
                        <input
                          id="forgot-email"
                          type="email"
                          required
                          placeholder="your.email@example.com"
                          className={`${fieldClass} pl-10`}
                          data-testid="input-forgot-email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotMutation.isPending}
                      data-testid="button-forgot-submit"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-md font-black text-sm uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ background: SKY }}
                    >
                      {forgotMutation.isPending ? "Sending…" : (
                        <><span>Send Reset Link</span><ArrowRight className="h-4 w-4" /></>
                      )}
                    </button>

                    <p className="text-center text-xs text-white/40 pt-1">
                      <button
                        type="button"
                        onClick={() => { setShowForgot(false); setForgotEmail(""); }}
                        data-testid="button-back-to-login"
                        className="font-bold underline"
                        style={{ color: SKY }}
                      >
                        Back to sign in
                      </button>
                    </p>
                  </form>
                )}

                {/* LOGIN */}
                {activeTab === "login" && !showForgot && (
                  <form
                    onSubmit={loginForm.handleSubmit((d) => loginMutation.mutate(d))}
                    className="space-y-5"
                  >
                    <div>
                      <Label className={labelClass} htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className={iconClass} />
                        <input
                          id="login-email"
                          type="email"
                          placeholder="your.email@example.com"
                          className={`${fieldClass} pl-10`}
                          data-testid="input-login-email"
                          {...loginForm.register("email")}
                        />
                      </div>
                      {loginForm.formState.errors.email && (
                        <p className="text-xs mt-1" style={{ color: SKY }}>
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <Label className={`${labelClass} mb-0`} htmlFor="login-password">Password</Label>
                        <button
                          type="button"
                          onClick={() => setShowForgot(true)}
                          data-testid="button-forgot-password"
                          className="text-[10px] font-bold uppercase tracking-widest underline"
                          style={{ color: SKY }}
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className={iconClass} />
                        <input
                          id="login-password"
                          type="password"
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className={`${fieldClass} pl-10`}
                          data-testid="input-login-password"
                          {...loginForm.register("password")}
                        />
                      </div>
                      {loginForm.formState.errors.password && (
                        <p className="text-xs mt-1" style={{ color: SKY }}>
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        data-testid="button-login-submit"
                        className="flex items-center justify-center gap-2 py-3 rounded-md font-black text-sm uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                        style={{ background: SKY }}
                      >
                        {loginMutation.isPending ? "Signing in…" : (
                          <><span>Sign In</span><ArrowRight className="h-4 w-4" /></>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("register")}
                        data-testid="button-switch-register"
                        className="px-5 py-3 rounded-md font-black text-sm uppercase tracking-widest text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors"
                      >
                        Register
                      </button>
                    </div>
                  </form>
                )}

                {/* REGISTER */}
                {activeTab === "register" && (
                  <form
                    onSubmit={registerForm.handleSubmit((d) => registerMutation.mutate(d))}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className={labelClass} htmlFor="register-fullName">Full Name *</Label>
                        <div className="relative">
                          <UserCircle className={iconClass} />
                          <input
                            id="register-fullName"
                            type="text"
                            placeholder="Jane Doe"
                            className={`${fieldClass} pl-10`}
                            data-testid="input-register-fullname"
                            {...registerForm.register("fullName")}
                          />
                        </div>
                        {registerForm.formState.errors.fullName && (
                          <p className="text-xs mt-1" style={{ color: SKY }}>
                            {registerForm.formState.errors.fullName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className={labelClass} htmlFor="register-email">Email *</Label>
                        <div className="relative">
                          <Mail className={iconClass} />
                          <input
                            id="register-email"
                            type="email"
                            placeholder="jane@example.com"
                            className={`${fieldClass} pl-10`}
                            data-testid="input-register-email"
                            {...registerForm.register("email")}
                          />
                        </div>
                        {registerForm.formState.errors.email && (
                          <p className="text-xs mt-1" style={{ color: SKY }}>
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className={labelClass} htmlFor="register-password">Password *</Label>
                        <div className="relative">
                          <Lock className={iconClass} />
                          <input
                            id="register-password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            className={`${fieldClass} pl-10`}
                            data-testid="input-register-password"
                            {...registerForm.register("password")}
                          />
                        </div>
                        {registerForm.formState.errors.password && (
                          <p className="text-xs mt-1" style={{ color: SKY }}>
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className={labelClass} htmlFor="register-phone">Phone</Label>
                        <div className="relative">
                          <Phone className={iconClass} />
                          <input
                            id="register-phone"
                            type="tel"
                            placeholder="+91-9876543210"
                            className={`${fieldClass} pl-10`}
                            data-testid="input-register-phone"
                            {...registerForm.register("phone")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className={labelClass} htmlFor="register-currentPosition">Current Role</Label>
                        <div className="relative">
                          <Briefcase className={iconClass} />
                          <input
                            id="register-currentPosition"
                            type="text"
                            placeholder="Software Engineer"
                            className={`${fieldClass} pl-10`}
                            data-testid="input-register-position"
                            {...registerForm.register("currentPosition")}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className={labelClass} htmlFor="register-experienceLevel">Experience Level</Label>
                        <div className="relative">
                          <TrendingUp className={iconClass} />
                          <input
                            id="register-experienceLevel"
                            type="text"
                            placeholder="Mid-Level (3–5 yrs)"
                            className={`${fieldClass} pl-10`}
                            data-testid="input-register-experience"
                            {...registerForm.register("experienceLevel")}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={registerMutation.isPending}
                      data-testid="button-register-submit"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-md font-black text-sm uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ background: SKY }}
                    >
                      {registerMutation.isPending ? "Creating account…" : (
                        <><span>Create Account</span><ArrowRight className="h-4 w-4" /></>
                      )}
                    </button>

                    <p className="text-center text-xs text-white/40 pt-1">
                      Already registered?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("login")}
                        className="font-bold underline"
                        style={{ color: SKY }}
                      >
                        Sign in
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
