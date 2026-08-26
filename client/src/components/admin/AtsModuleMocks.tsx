import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Building2, Users, TrendingUp, Target, ClipboardCheck, FileSignature, Clock, CheckCircle2,
  Wallet, Receipt, BarChart3, Plug, Globe2, Mail, CalendarDays, ShieldCheck, PenLine,
  Search, Plus, ArrowUpRight, MoreHorizontal, AlertCircle, MessageSquare, Video, FileText,
  Send, Award, Sparkles,
} from "lucide-react";
export type AtsModuleKey =
  | "crm"
  | "onboarding"
  | "financials"
  | "vms-sync"
  | "job-boards"
  | "email-calendar"
  | "background-checks"
  | "esignature"
  | "reports";

export const ATS_MODULE_KEYS: AtsModuleKey[] = [
  "onboarding",
  "financials",
  "vms-sync",
  "job-boards",
  "email-calendar",
  "background-checks",
  "esignature",
  "reports",
];

export const ATS_MODULE_META: Record<AtsModuleKey, { label: string; icon: any; tagline: string }> = {
  crm: { label: "CRM · Clients", icon: Building2, tagline: "Accounts, contacts and opportunities" },
  onboarding: { label: "Onboarding", icon: ClipboardCheck, tagline: "Documents, I-9 and compliance" },
  financials: { label: "Financials", icon: Wallet, tagline: "Billing, payroll and margins" },
  "vms-sync": { label: "VMS Sync", icon: Plug, tagline: "Beeline · Fieldglass · SAP" },
  "job-boards": { label: "Job Boards", icon: Globe2, tagline: "Multi-board distribution" },
  "email-calendar": { label: "Inbox & Calendar", icon: Mail, tagline: "Outlook · Gmail · Meet" },
  "background-checks": { label: "Background Checks", icon: ShieldCheck, tagline: "Checkr · Sterling · HireRight" },
  esignature: { label: "E-Signature", icon: PenLine, tagline: "DocuSign · Adobe Sign" },
  reports: { label: "Reports & Analytics", icon: BarChart3, tagline: "Dashboards and insights" },
};

function StatCard({ label, value, sub, accent, icon: Icon }: { label: string; value: string; sub: string; accent: string; icon: any }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <p className="text-3xl font-black text-foreground leading-none">{value}</p>
            <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>
          </div>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}18` }}>
            <Icon className="h-5 w-5" style={{ color: accent }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ModuleHeader({ k, action }: { k: AtsModuleKey; action?: { label: string; icon?: any } }) {
  const { label, tagline, icon: Icon } = ATS_MODULE_META[k];
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground leading-tight">{label}</h2>
          <p className="text-xs text-muted-foreground">{tagline}</p>
        </div>
      </div>
      {action && (
        <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-white">
          {action.icon ? <action.icon className="h-4 w-4 mr-1.5" /> : <Plus className="h-4 w-4 mr-1.5" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}

function DemoBanner({ eta = "Q3 2026" }: { eta?: string }) {
  return (
    <div className="mb-5 rounded-lg border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/10 px-4 py-3 flex items-start gap-3">
      <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Roadmap Preview</p>
          <span className="px-2 py-0.5 rounded-md bg-amber-200/60 dark:bg-amber-700/40 text-[10px] font-black uppercase tracking-wider text-amber-900 dark:text-amber-100">
            Coming {eta}
          </span>
        </div>
        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1">
          This is a design preview, not a live module. Sample data shown for illustration only — see the
          {" "}<a href="/roadmap" className="font-bold underline decoration-amber-600/50 underline-offset-2 hover:text-amber-900 dark:hover:text-amber-100">full product roadmap</a>.
        </p>
      </div>
    </div>
  );
}

// ─── CRM ──────────────────────────────────────────────────────────────────────
export function CrmModule() {
  const clients = [
    { name: "Acme Bank", logo: "AB", status: "Active", arr: "₹1.85 Cr", owner: "Priya S.", last: "2h ago", health: "Strong" },
    { name: "Globex Pharma", logo: "GP", status: "Active", arr: "₹1.20 Cr", owner: "Rohan M.", last: "1d ago", health: "Strong" },
    { name: "Initech IT", logo: "IT", status: "Renewal", arr: "₹95 L", owner: "Priya S.", last: "3d ago", health: "Watch" },
    { name: "Umbrella Health", logo: "UH", status: "Active", arr: "₹78 L", owner: "Anjali K.", last: "5d ago", health: "Strong" },
    { name: "Stark Industries", logo: "SI", status: "Pursuit", arr: "—", owner: "Rohan M.", last: "1w ago", health: "Cold" },
    { name: "Wayne Logistics", logo: "WL", status: "Active", arr: "₹62 L", owner: "Anjali K.", last: "1w ago", health: "Strong" },
    { name: "Soylent Foods", logo: "SF", status: "Active", arr: "₹54 L", owner: "Priya S.", last: "2w ago", health: "Watch" },
    { name: "Hooli Cloud", logo: "HC", status: "Pursuit", arr: "—", owner: "Vikram R.", last: "2w ago", health: "Cold" },
  ];
  const opps = [
    { name: "Acme — DevOps Pod (8 contractors)", value: "₹42 L", stage: "Negotiation", close: "Q3 FY26" },
    { name: "Globex — RPA Engineers (12)", value: "₹68 L", stage: "Proposal", close: "Q3 FY26" },
    { name: "Initech — SAP S/4HANA Renewal", value: "₹95 L", stage: "Discovery", close: "Q4 FY26" },
    { name: "Hooli — Cloud Migration RTB", value: "₹1.10 Cr", stage: "Qualified", close: "Q1 FY27" },
  ];
  return (
    <div className="space-y-6">
      <ModuleHeader k="crm" action={{ label: "Add Client" }} />
      <DemoBanner />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Clients" value="42" sub="+3 this quarter" accent="#0ea5e9" icon={Building2} />
        <StatCard label="Open Opportunities" value="18" sub="₹4.8 Cr pipeline" accent="#8b5cf6" icon={Target} />
        <StatCard label="Win Rate (90d)" value="38%" sub="vs 31% LY" accent="#10b981" icon={TrendingUp} />
        <StatCard label="At-Risk Accounts" value="3" sub="Needs touch this week" accent="#f59e0b" icon={AlertCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3 flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Top Accounts</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search clients" className="pl-8 h-8 w-48 text-xs" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {clients.map((c) => (
                <div key={c.name} className="px-5 py-3 flex items-center gap-4 hover-elevate">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center text-xs font-black">{c.logo}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">Owner: {c.owner} · Last touch {c.last}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{c.status}</Badge>
                  <p className="text-sm font-bold text-foreground w-20 text-right tabular-nums">{c.arr}</p>
                  <Badge className={c.health === "Strong" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : c.health === "Watch" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"}>
                    {c.health}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Hot Opportunities</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {opps.map((o) => (
                <div key={o.name} className="px-5 py-3 hover-elevate">
                  <p className="text-sm font-bold text-foreground leading-snug">{o.name}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <Badge variant="secondary" className="text-[10px]">{o.stage}</Badge>
                    <span className="text-xs text-muted-foreground">{o.close}</span>
                  </div>
                  <p className="text-sm font-black text-sky-500 mt-1">{o.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────────────────
export function OnboardingModule() {
  const items = [
    { name: "Anjali Mehta", role: "Senior Java Developer · Acme", progress: 85, step: "Background Check", eta: "2 days" },
    { name: "Vikram Rao", role: "DevOps Engineer · Globex", progress: 60, step: "I-9 Verification", eta: "4 days" },
    { name: "Sneha Iyer", role: "Data Scientist · Initech", progress: 40, step: "Document Upload", eta: "1 week" },
    { name: "Karthik Nair", role: "RPA Lead · Globex", progress: 95, step: "Equipment Pickup", eta: "1 day" },
    { name: "Priyanka Shah", role: "QA Automation · Acme", progress: 25, step: "Offer Acceptance", eta: "1 week" },
    { name: "Rahul Sharma", role: "Cloud Architect · Hooli", progress: 70, step: "MSA Review", eta: "3 days" },
    { name: "Divya Pillai", role: "Scrum Master · Wayne", progress: 50, step: "NDA Signing", eta: "5 days" },
    { name: "Arjun Singh", role: "ML Engineer · Stark", progress: 15, step: "Profile Setup", eta: "2 weeks" },
  ];
  return (
    <div className="space-y-6">
      <ModuleHeader k="onboarding" action={{ label: "New Onboarding" }} />
      <DemoBanner />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Onboardings" value="24" sub="+5 this week" accent="#0ea5e9" icon={ClipboardCheck} />
        <StatCard label="Avg Days to Start" value="6.2" sub="-1.4 vs last quarter" accent="#10b981" icon={Clock} />
        <StatCard label="Pending Documents" value="11" sub="Across 7 candidates" accent="#f59e0b" icon={FileText} />
        <StatCard label="Completed This Month" value="38" sub="100% compliance" accent="#8b5cf6" icon={CheckCircle2} />
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Active Onboarding Pipeline</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {items.map((i) => (
              <div key={i.name} className="px-5 py-4 hover-elevate">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{i.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{i.role}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{i.step}</Badge>
                  <span className="text-xs text-muted-foreground w-14 text-right shrink-0">ETA {i.eta}</span>
                  <span className="text-xs font-bold text-foreground w-10 text-right tabular-nums shrink-0">{i.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-sky-500" style={{ width: `${i.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Financials ───────────────────────────────────────────────────────────────
export function FinancialsModule() {
  const invoices = [
    { id: "INV-2026-0184", client: "Acme Bank", amount: "₹14,82,000", due: "5 May 2026", status: "Sent" },
    { id: "INV-2026-0183", client: "Globex Pharma", amount: "₹9,45,000", due: "12 May 2026", status: "Viewed" },
    { id: "INV-2026-0182", client: "Initech IT", amount: "₹6,80,000", due: "30 Apr 2026", status: "Overdue" },
    { id: "INV-2026-0181", client: "Wayne Logistics", amount: "₹5,20,000", due: "28 Apr 2026", status: "Paid" },
    { id: "INV-2026-0180", client: "Umbrella Health", amount: "₹4,15,000", due: "25 Apr 2026", status: "Paid" },
    { id: "INV-2026-0179", client: "Soylent Foods", amount: "₹3,80,000", due: "22 Apr 2026", status: "Paid" },
  ];
  const statusColor = (s: string) =>
    s === "Paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
    s === "Overdue" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" :
    s === "Viewed" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" :
    "bg-muted text-muted-foreground";
  return (
    <div className="space-y-6">
      <ModuleHeader k="financials" action={{ label: "New Invoice", icon: Receipt }} />
      <DemoBanner />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="MTD Revenue" value="₹62.4 L" sub="+18% vs LM" accent="#10b981" icon={TrendingUp} />
        <StatCard label="Outstanding" value="₹38.2 L" sub="Across 14 invoices" accent="#f59e0b" icon={Receipt} />
        <StatCard label="Payroll Due" value="₹24.8 L" sub="48 contractors · 5 May" accent="#0ea5e9" icon={Wallet} />
        <StatCard label="Gross Margin" value="22.4%" sub="+1.2 pts QoQ" accent="#8b5cf6" icon={BarChart3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Recent Invoices</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {invoices.map((inv) => (
                <div key={inv.id} className="px-5 py-3 flex items-center gap-4 hover-elevate">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{inv.id}</p>
                    <p className="text-xs text-muted-foreground">{inv.client} · Due {inv.due}</p>
                  </div>
                  <Badge className={statusColor(inv.status)}>{inv.status}</Badge>
                  <p className="text-sm font-bold text-foreground w-28 text-right tabular-nums">{inv.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Quick Pay Run</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border p-4 bg-muted/30">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Next Run</p>
              <p className="text-2xl font-black text-foreground">5 May 2026</p>
              <p className="text-xs text-muted-foreground mt-1">48 contractors · ₹24.8 L gross</p>
            </div>
            <Button className="w-full bg-sky-500 hover:bg-sky-400 text-white">
              <Send className="h-4 w-4 mr-2" /> Run Payroll
            </Button>
            <Button variant="outline" className="w-full">Export to QuickBooks</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── VMS Sync ─────────────────────────────────────────────────────────────────
export function VmsSyncModule() {
  const reqs = [
    { vms: "Beeline", client: "Acme Bank", role: "Senior Java Developer", posted: "12 min ago", status: "New", subs: 0 },
    { vms: "Fieldglass", client: "Globex Pharma", role: "Clinical Data Manager", posted: "47 min ago", status: "In Progress", subs: 2 },
    { vms: "Beeline", client: "Initech IT", role: "Salesforce Admin", posted: "2h ago", status: "In Progress", subs: 4 },
    { vms: "SAP Fieldglass", client: "Hooli Cloud", role: "AWS DevOps Engineer", posted: "5h ago", status: "Submitted", subs: 6 },
    { vms: "Beeline", client: "Wayne Logistics", role: "Network Engineer", posted: "1d ago", status: "Submitted", subs: 5 },
    { vms: "Fieldglass", client: "Stark Industries", role: "Embedded Systems Engineer", posted: "1d ago", status: "On Hold", subs: 1 },
    { vms: "Beeline", client: "Umbrella Health", role: "EMR Implementation Lead", posted: "2d ago", status: "Closed", subs: 8 },
  ];
  const statusColor = (s: string) =>
    s === "New" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" :
    s === "In Progress" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" :
    s === "Submitted" ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" :
    s === "Closed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
    "bg-muted text-muted-foreground";
  return (
    <div className="space-y-6">
      <ModuleHeader k="vms-sync" action={{ label: "Sync Now", icon: ArrowUpRight }} />
      <DemoBanner />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Connected VMS" value="3" sub="Beeline · Fieldglass · SAP" accent="#0ea5e9" icon={Plug} />
        <StatCard label="New Reqs Today" value="12" sub="Across 7 clients" accent="#8b5cf6" icon={Sparkles} />
        <StatCard label="Submissions Out" value="38" sub="Awaiting client review" accent="#f59e0b" icon={Send} />
        <StatCard label="Avg Time-to-Submit" value="2.4h" sub="Industry: 18h" accent="#10b981" icon={Clock} />
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Live Job Orders from VMS</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {reqs.map((r, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4 hover-elevate">
                <div className="w-12 text-center">
                  <Badge variant="outline" className="text-[10px]">{r.vms}</Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{r.role}</p>
                  <p className="text-xs text-muted-foreground">{r.client} · Posted {r.posted}</p>
                </div>
                <span className="text-xs text-muted-foreground w-20 text-right">{r.subs} subs</span>
                <Badge className={statusColor(r.status)}>{r.status}</Badge>
                <Button size="sm" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Job Boards ───────────────────────────────────────────────────────────────
export function JobBoardsModule() {
  const boards = [
    { name: "LinkedIn", posts: 28, apps: 142, spend: "₹48,000", cpa: "₹338", color: "#0a66c2" },
    { name: "Naukri", posts: 28, apps: 318, spend: "₹22,000", cpa: "₹69", color: "#4a90e2" },
    { name: "Indeed", posts: 24, apps: 96, spend: "₹18,000", cpa: "₹187", color: "#003a9b" },
    { name: "Monster", posts: 18, apps: 54, spend: "₹12,000", cpa: "₹222", color: "#5e2ca5" },
    { name: "Dice", posts: 14, apps: 38, spend: "₹14,000", cpa: "₹368", color: "#0a8aff" },
    { name: "Glassdoor", posts: 12, apps: 41, spend: "₹9,000", cpa: "₹220", color: "#0caa41" },
  ];
  return (
    <div className="space-y-6">
      <ModuleHeader k="job-boards" action={{ label: "Post a Job", icon: Send }} />
      <DemoBanner />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Boards Connected" value="6" sub="LinkedIn · Naukri · Indeed +3" accent="#0ea5e9" icon={Globe2} />
        <StatCard label="Posts Live" value="124" sub="Across 6 boards" accent="#8b5cf6" icon={Send} />
        <StatCard label="Applicants Today" value="89" sub="+22% vs yesterday" accent="#10b981" icon={Users} />
        <StatCard label="Avg Cost-per-App" value="₹172" sub="-₹38 vs LM" accent="#f59e0b" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((b) => (
          <Card key={b.name} className="border-0 shadow-sm hover-elevate">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: b.color }}>
                    {b.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.posts} posts live</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px]">Connected</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Apps</p>
                  <p className="text-lg font-black text-foreground tabular-nums">{b.apps}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Spend</p>
                  <p className="text-lg font-black text-foreground tabular-nums">{b.spend}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">CPA</p>
                  <p className="text-lg font-black text-sky-500 tabular-nums">{b.cpa}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Email & Calendar ─────────────────────────────────────────────────────────
export function EmailCalendarModule() {
  const emails = [
    { from: "Anjali Mehta", subject: "Re: Java Developer Role at Acme — Available for interview Tuesday", time: "2m ago", unread: true },
    { from: "Sarah Lin (Acme HR)", subject: "Submission acknowledged — DevOps Engineer pos.", time: "12m ago", unread: true },
    { from: "Vikram Rao", subject: "Updated résumé attached", time: "1h ago", unread: true },
    { from: "Globex Talent Team", subject: "Interview confirmation: Karthik Nair, 4 May 11:00 IST", time: "2h ago", unread: false },
    { from: "Sneha Iyer", subject: "Notice period clarification", time: "3h ago", unread: false },
    { from: "DocuSign", subject: "Offer Letter signed: Priyanka Shah", time: "5h ago", unread: false },
  ];
  const meetings = [
    { time: "10:00", title: "Weekly Pipeline Review · Internal", duration: "30 min" },
    { time: "11:00", title: "Karthik Nair · L2 Interview · Globex", duration: "60 min" },
    { time: "13:30", title: "Acme Bank — Quarterly Review", duration: "45 min" },
    { time: "15:00", title: "Sneha Iyer · Screening Call", duration: "30 min" },
    { time: "16:30", title: "Hooli Discovery Call", duration: "45 min" },
  ];
  return (
    <div className="space-y-6">
      <ModuleHeader k="email-calendar" action={{ label: "Compose", icon: Mail }} />
      <DemoBanner />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Unread" value="8" sub="3 from candidates" accent="#0ea5e9" icon={Mail} />
        <StatCard label="Meetings Today" value="5" sub="Next at 10:00" accent="#8b5cf6" icon={CalendarDays} />
        <StatCard label="Templates Sent (24h)" value="42" sub="Outreach + screening" accent="#f59e0b" icon={Send} />
        <StatCard label="Reply Rate (7d)" value="34%" sub="+6 pts vs LW" accent="#10b981" icon={MessageSquare} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3 flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Inbox · Synced with Outlook</CardTitle>
            <Badge variant="secondary" className="text-[10px]"><CheckCircle2 className="h-3 w-3 mr-1" /> Connected</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {emails.map((e, i) => (
                <div key={i} className="px-5 py-3 flex items-start gap-3 hover-elevate">
                  {e.unread && <div className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />}
                  {!e.unread && <div className="w-2 h-2 mt-2 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate ${e.unread ? "font-bold text-foreground" : "text-muted-foreground"}`}>{e.from}</p>
                      <span className="text-xs text-muted-foreground shrink-0">{e.time}</span>
                    </div>
                    <p className={`text-xs truncate ${e.unread ? "text-foreground" : "text-muted-foreground"}`}>{e.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3 flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Today's Calendar</CardTitle>
            <Video className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {meetings.map((m, i) => (
                <div key={i} className="px-5 py-3 flex items-start gap-4 hover-elevate">
                  <p className="text-sm font-black text-sky-500 tabular-nums w-12 shrink-0">{m.time}</p>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Background Checks ────────────────────────────────────────────────────────
export function BackgroundChecksModule() {
  const checks = [
    { candidate: "Anjali Mehta", provider: "Checkr", started: "1 May", eta: "3 May", status: "Cleared" },
    { candidate: "Vikram Rao", provider: "Sterling", started: "2 May", eta: "5 May", status: "In Progress" },
    { candidate: "Sneha Iyer", provider: "AuthBridge", started: "2 May", eta: "6 May", status: "In Progress" },
    { candidate: "Karthik Nair", provider: "HireRight", started: "30 Apr", eta: "4 May", status: "Education Pending" },
    { candidate: "Priyanka Shah", provider: "Checkr", started: "29 Apr", eta: "3 May", status: "Cleared" },
    { candidate: "Rahul Sharma", provider: "First Advantage", started: "28 Apr", eta: "2 May", status: "Flagged" },
    { candidate: "Divya Pillai", provider: "AuthBridge", started: "27 Apr", eta: "1 May", status: "Cleared" },
  ];
  const statusColor = (s: string) =>
    s === "Cleared" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
    s === "Flagged" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" :
    s === "In Progress" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" :
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
  return (
    <div className="space-y-6">
      <ModuleHeader k="background-checks" action={{ label: "New Check", icon: ShieldCheck }} />
      <DemoBanner />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="In Progress" value="14" sub="Across 4 providers" accent="#0ea5e9" icon={Clock} />
        <StatCard label="Cleared (30d)" value="62" sub="98% pass rate" accent="#10b981" icon={CheckCircle2} />
        <StatCard label="Flagged" value="1" sub="Needs adverse-action review" accent="#ef4444" icon={AlertCircle} />
        <StatCard label="Avg Turnaround" value="3.4d" sub="-0.6d vs LM" accent="#8b5cf6" icon={TrendingUp} />
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Background Checks in Flight</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {checks.map((c, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4 hover-elevate">
                <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center text-xs font-black">
                  {c.candidate.split(" ").map(p => p[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{c.candidate}</p>
                  <p className="text-xs text-muted-foreground">{c.provider} · Started {c.started} · ETA {c.eta}</p>
                </div>
                <Badge className={statusColor(c.status)}>{c.status}</Badge>
                <Button size="sm" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── E-Signature ──────────────────────────────────────────────────────────────
export function ESignatureModule() {
  const docs = [
    { title: "Offer Letter — Anjali Mehta", recipient: "anjali.mehta@email.com", status: "Signed", date: "1 May" },
    { title: "MSA — Globex Pharma 2026", recipient: "procurement@globex.com", status: "Signed", date: "30 Apr" },
    { title: "NDA — Vikram Rao", recipient: "vikram.rao@email.com", status: "Viewed", date: "2 May" },
    { title: "Contractor Agreement — Sneha Iyer", recipient: "sneha.iyer@email.com", status: "Sent", date: "2 May" },
    { title: "Offer Letter — Karthik Nair", recipient: "karthik.nair@email.com", status: "Sent", date: "2 May" },
    { title: "MSA Renewal — Initech IT", recipient: "legal@initech.com", status: "Viewed", date: "1 May" },
    { title: "NDA — Rahul Sharma", recipient: "rahul.sharma@email.com", status: "Signed", date: "29 Apr" },
  ];
  const statusColor = (s: string) =>
    s === "Signed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
    s === "Viewed" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" :
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
  return (
    <div className="space-y-6">
      <ModuleHeader k="esignature" action={{ label: "Send Document", icon: PenLine }} />
      <DemoBanner />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Signatures" value="9" sub="3 awaiting client, 6 candidate" accent="#f59e0b" icon={Clock} />
        <StatCard label="Signed (7d)" value="24" sub="100% on first send" accent="#10b981" icon={CheckCircle2} />
        <StatCard label="Avg Time-to-Sign" value="4.8h" sub="-2.1h vs LM" accent="#0ea5e9" icon={TrendingUp} />
        <StatCard label="Templates" value="14" sub="Offer · MSA · NDA · SOW" accent="#8b5cf6" icon={FileSignature} />
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 flex-row items-center justify-between gap-2 space-y-0">
          <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Recent Documents · DocuSign</CardTitle>
          <Badge variant="secondary" className="text-[10px]"><CheckCircle2 className="h-3 w-3 mr-1" /> Connected</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {docs.map((d, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4 hover-elevate">
                <FileSignature className="h-4 w-4 text-sky-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{d.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{d.recipient} · Sent {d.date}</p>
                </div>
                <Badge className={statusColor(d.status)}>{d.status}</Badge>
                <Button size="sm" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────
export function ReportsModule() {
  const funnel = [
    { stage: "Applied", count: 1248, pct: 100 },
    { stage: "Screened", count: 612, pct: 49 },
    { stage: "Submitted", count: 284, pct: 23 },
    { stage: "Interview", count: 142, pct: 11 },
    { stage: "Offer", count: 58, pct: 5 },
    { stage: "Placed", count: 42, pct: 3 },
  ];
  const sources = [
    { name: "LinkedIn", hires: 14, pct: 33 },
    { name: "Naukri", hires: 11, pct: 26 },
    { name: "Referrals", hires: 8, pct: 19 },
    { name: "Indeed", hires: 5, pct: 12 },
    { name: "Direct Apply", hires: 4, pct: 10 },
  ];
  const leaderboard = [
    { name: "Priya S.", subs: 48, ints: 22, hires: 9, revenue: "₹38 L" },
    { name: "Rohan M.", subs: 41, ints: 18, hires: 7, revenue: "₹29 L" },
    { name: "Anjali K.", subs: 36, ints: 15, hires: 6, revenue: "₹24 L" },
    { name: "Vikram R.", subs: 29, ints: 11, hires: 4, revenue: "₹16 L" },
    { name: "Karthik P.", subs: 24, ints: 9, hires: 3, revenue: "₹12 L" },
  ];
  return (
    <div className="space-y-6">
      <ModuleHeader k="reports" action={{ label: "Build Report", icon: BarChart3 }} />
      <DemoBanner />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Time-to-Fill" value="14.2d" sub="-3.6d vs industry" accent="#10b981" icon={Clock} />
        <StatCard label="Submission-to-Hire" value="14.8%" sub="+2.4 pts vs LQ" accent="#8b5cf6" icon={TrendingUp} />
        <StatCard label="Active Recruiters" value="12" sub="MoM productivity ↑" accent="#0ea5e9" icon={Users} />
        <StatCard label="Quarter Revenue" value="₹1.62 Cr" sub="84% to plan" accent="#f59e0b" icon={Award} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Hiring Funnel — Last 90 days</CardTitle></CardHeader>
          <CardContent className="space-y-3 pt-2">
            {funnel.map((f) => (
              <div key={f.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-foreground">{f.stage}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{f.count.toLocaleString()} · {f.pct}%</span>
                </div>
                <div className="h-7 rounded bg-muted overflow-hidden">
                  <div className="h-full rounded bg-gradient-to-r from-sky-500 to-sky-400" style={{ width: `${f.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Source of Hire</CardTitle></CardHeader>
          <CardContent className="space-y-3 pt-2">
            {sources.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-foreground">{s.name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{s.hires} hires · {s.pct}%</span>
                </div>
                <div className="h-2 rounded bg-muted overflow-hidden">
                  <div className="h-full rounded bg-sky-500" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Recruiter Leaderboard — Quarter to Date</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {leaderboard.map((r, i) => (
              <div key={r.name} className="px-5 py-3 flex items-center gap-4 hover-elevate">
                <div className="w-8 text-center text-sm font-black text-sky-500">#{i + 1}</div>
                <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center text-xs font-black">
                  {r.name.split(" ").map(p => p[0]).join("")}
                </div>
                <p className="flex-1 text-sm font-bold text-foreground">{r.name}</p>
                <span className="text-xs text-muted-foreground w-20 text-right tabular-nums">{r.subs} subs</span>
                <span className="text-xs text-muted-foreground w-20 text-right tabular-nums">{r.ints} ints</span>
                <span className="text-sm font-bold text-foreground w-20 text-right tabular-nums">{r.hires} hires</span>
                <span className="text-sm font-black text-sky-500 w-24 text-right tabular-nums">{r.revenue}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AtsModule({ moduleKey }: { moduleKey: AtsModuleKey }) {
  switch (moduleKey) {
    case "crm": return <CrmModule />;
    case "onboarding": return <OnboardingModule />;
    case "financials": return <FinancialsModule />;
    case "vms-sync": return <VmsSyncModule />;
    case "job-boards": return <JobBoardsModule />;
    case "email-calendar": return <EmailCalendarModule />;
    case "background-checks": return <BackgroundChecksModule />;
    case "esignature": return <ESignatureModule />;
    case "reports": return <ReportsModule />;
  }
}
