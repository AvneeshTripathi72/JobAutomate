import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, BrainCircuit, ShieldCheck, Sparkles, Loader2, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Link } from "wouter";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

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

const COVERS = [
  "Walkthrough of Tilcons ATS + CRM tailored to Indian staffing workflows",
  "How candidate sourcing, hotlisting and submissions work end-to-end",
  "Plans, pricing in INR and what ships in your first 30 days",
];

const TRUST = [
  { icon: BrainCircuit, label: "AI-assisted screening" },
  { icon: ShieldCheck, label: "Built for GST / PF / TDS readiness" },
  { icon: Sparkles, label: "Naukri-first distribution" },
];

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  companyName: string;
  industry: string;
  teamSize: string;
};

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
  companyName: "",
  industry: "",
  teamSize: "",
};

export default function GetStarted() {
  useDocumentMeta(
    "Book a Tilcons Demo — See How You Can Fill Roles 3x Faster",
    "Get a personalised 20-minute demo of the Tilcons ATS + CRM built for Indian staffing agencies. Pricing in INR, GST-ready, Naukri-first distribution.",
  );
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((s) => ({ ...s, [k]: v }));

  const mutation = useMutation({
    mutationFn: async (payload: FormState) => {
      const message = [
        `Demo request from ${payload.firstName} ${payload.lastName}`.trim(),
        `Company: ${payload.companyName}`,
        `Job title: ${payload.jobTitle}`,
        `Industry: ${payload.industry}`,
        payload.teamSize ? `Team size: ${payload.teamSize}` : null,
      ]
        .filter(Boolean)
        .join("\n");
      return apiRequest("POST", "/api/contacts", {
        name: `${payload.firstName} ${payload.lastName}`.trim(),
        email: payload.email,
        phone: payload.phone,
        inquiryType: "Demo Request",
        message,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({ title: "Thanks — we'll be in touch", description: "Our team will reach out within 1 business day to schedule your demo." });
      setForm(EMPTY);
    },
    onError: (err: Error) => {
      toast({ title: "Could not submit", description: err.message, variant: "destructive" });
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.jobTitle || !form.companyName || !form.industry) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Top promo strip — mirrors Ceipal's green banner but on-brand */}
      <div className="w-full text-white text-sm" style={{ background: NAVY }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-center gap-3 text-center">
          <span className="font-semibold">Live in Q3 2026:</span>
          <span className="opacity-90">Naukri-first distribution, GST invoicing and AI candidate ranking</span>
          <Link href="/roadmap" className="font-bold underline underline-offset-4" style={{ color: SKY }} data-testid="link-getstarted-roadmap">
            See roadmap →
          </Link>
        </div>
      </div>

      {/* Hero + form, two-column on desktop, stacked on mobile */}
      <section className="flex-1 py-10 md:py-16" style={{ background: NAVY }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: pitch */}
          <div className="text-white">
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-4" style={{ color: SKY }}>
              All-in-one ATS + CRM
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              See How You Can Fill Roles{" "}
              <span style={{ color: SKY }}>3x Faster</span>
            </h1>
            <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl">
              Tilcons is the staffing operating system built for Indian recruiters. Sourcing, hotlists, submissions, interviews, CRM and invoicing — one platform, INR pricing, GST-ready.
            </p>

            <p className="text-sm font-bold uppercase tracking-wider mb-4 text-white/70">
              Your 20-minute demo will cover
            </p>
            <ul className="space-y-3 mb-8">
              {COVERS.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm md:text-base" data-testid={`text-demo-cover-${c.slice(0, 12)}`}>
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: SKY }} />
                  <span className="text-white/90">{c}</span>
                </li>
              ))}
            </ul>

            <div className="grid sm:grid-cols-3 gap-3 pt-6 border-t border-white/10">
              {TRUST.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs md:text-sm text-white/80" data-testid={`trust-${label.slice(0, 10)}`}>
                  <Icon className="h-4 w-4 flex-shrink-0" style={{ color: SKY }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Sales deck download */}
            <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-5" data-testid="card-sales-deck">
              <div className="flex items-start gap-3 mb-4">
                <div className="rounded-lg p-2 flex-shrink-0" style={{ background: `${SKY}26` }}>
                  <FileText className="h-5 w-5" style={{ color: SKY }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: SKY }}>For your team</p>
                  <h3 className="text-base md:text-lg font-bold text-white mb-1">Tilcons Sales Deck</h3>
                  <p className="text-xs md:text-sm text-white/70">
                    Feature-by-feature walkthrough, demo script, objection-handling cheatsheet and ROI numbers — share with your hiring team or download for offline pitching.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/downloads/tilcons-sales-deck.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-white hover-elevate active-elevate-2"
                  style={{ background: SKY }}
                  data-testid="link-download-deck-pdf"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </a>
                <a
                  href="/downloads/tilcons-sales-deck.pptx"
                  download
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold border border-white/30 text-white hover-elevate active-elevate-2"
                  data-testid="link-download-deck-pptx"
                >
                  <Download className="h-4 w-4" /> Download PPTX
                </a>
              </div>
            </div>
          </div>

          {/* Right: form card */}
          <div className="bg-white text-foreground rounded-2xl shadow-2xl p-6 md:p-8 lg:sticky lg:top-24">
            {submitted ? (
              <div className="text-center py-8" data-testid="state-getstarted-success">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${SKY}1a` }}>
                  <CheckCircle2 className="h-8 w-8" style={{ color: SKY }} />
                </div>
                <h2 className="text-2xl font-black mb-2" style={{ color: NAVY }}>You're on the list</h2>
                <p className="text-sm text-muted-foreground mb-6">Our team will reach out within 1 business day to confirm your demo slot.</p>
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  data-testid="button-submit-another"
                  className="font-bold uppercase tracking-wider text-sm"
                >
                  Submit another request
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: NAVY }}>
                  Get a free Tilcons demo
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  No credit card. No sales pressure. Just a real product walkthrough.
                </p>

                <form onSubmit={onSubmit} className="space-y-4" data-testid="form-getstarted">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" data-testid="input-firstname" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" data-testid="input-lastname" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Work Email *</Label>
                      <Input id="email" type="email" data-testid="input-email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" data-testid="input-phone" placeholder="+91" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input id="companyName" data-testid="input-company" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input id="jobTitle" data-testid="input-jobtitle" value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Industry *</Label>
                      <Select value={form.industry} onValueChange={(v) => set("industry", v)}>
                        <SelectTrigger data-testid="select-industry"><SelectValue placeholder="Choose industry" /></SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map((i) => <SelectItem key={i} value={i} data-testid={`option-industry-${i.slice(0, 10)}`}>{i}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Recruiting team size</Label>
                      <Select value={form.teamSize} onValueChange={(v) => set("teamSize", v)}>
                        <SelectTrigger data-testid="select-teamsize"><SelectValue placeholder="Optional" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 recruiters</SelectItem>
                          <SelectItem value="6-20">6-20 recruiters</SelectItem>
                          <SelectItem value="21-50">21-50 recruiters</SelectItem>
                          <SelectItem value="50+">50+ recruiters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    By submitting, you agree to our{" "}
                    <Link href="/privacy" className="underline hover:text-foreground" data-testid="link-getstarted-privacy">Privacy Policy</Link>.
                  </p>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-bold uppercase tracking-wider text-sm text-white"
                    style={{ background: SKY }}
                    disabled={mutation.isPending}
                    data-testid="button-submit-demo"
                  >
                    {mutation.isPending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…</>
                    ) : (
                      "Book My Demo"
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/signin" className="font-bold underline" style={{ color: SKY }} data-testid="link-getstarted-signin">Sign in</Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
