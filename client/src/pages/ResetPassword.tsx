import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

export default function ResetPassword() {
  useDocumentMeta(
    "Reset Your Password",
    "Reset your Tilcons candidate account password securely. Choose a new password to regain access to your applications and saved jobs."
  );
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token") || "";
    setToken(t);
    if (!t) setError("Reset token is missing from the URL. Please use the link from your email.");
  }, []);

  const resetMutation = useMutation({
    mutationFn: async (data: { token: string; password: string }) =>
      apiRequest("POST", "/api/jobseekers/reset-password", data),
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been reset. Please sign in with your new password.",
      });
      setLocation("/jobseeker-auth");
    },
    onError: (err: any) => {
      toast({
        title: "Reset failed",
        description: err.message || "This reset link is invalid or has expired. Please request a new one.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError("Reset token is missing.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    resetMutation.mutate({ token, password });
  };

  const fieldClass =
    "w-full bg-white/5 border border-white/15 rounded-md px-3 py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#0ea5e9] transition-colors";
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section
        className="relative pt-16 pb-0"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #163554 100%)` }}
      >
        <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: SKY }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: SKY }}>
            Candidate Portal
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight">
            Reset <span style={{ color: SKY }}>Password</span>
          </h1>
          <p className="text-white/60 text-base mt-3 max-w-lg">
            Choose a new password to regain access to your candidate account.
          </p>
        </div>
        <div className="h-10 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #163554 100%)` }} />
          <div
            className="absolute bottom-0 left-0 right-0 h-10 bg-background"
            style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
          />
        </div>
      </section>

      <section className="py-14 bg-background">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: NAVY }}>
            <div className="p-8">
              <div className="flex items-center gap-2 mb-5">
                <ShieldCheck className="h-5 w-5" style={{ color: SKY }} />
                <h2 className="text-white text-sm font-black uppercase tracking-widest">
                  Choose a new password
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label className={labelClass} htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className={iconClass} />
                    <input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      className={`${fieldClass} pl-10`}
                      data-testid="input-new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className={labelClass} htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className={iconClass} />
                    <input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Re-enter new password"
                      className={`${fieldClass} pl-10`}
                      data-testid="input-confirm-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs" style={{ color: SKY }} data-testid="text-reset-error">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={resetMutation.isPending || !token}
                  data-testid="button-reset-submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-md font-black text-sm uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: SKY }}
                >
                  {resetMutation.isPending ? "Updating…" : (
                    <><span>Update Password</span><ArrowRight className="h-4 w-4" /></>
                  )}
                </button>

                <p className="text-center text-xs text-white/40 pt-1">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => setLocation("/jobseeker-auth")}
                    data-testid="button-back-to-signin"
                    className="font-bold underline"
                    style={{ color: SKY }}
                  >
                    Sign in
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
