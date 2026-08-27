import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Building2, Users, Plus, LogOut, Globe, Trash2,
  CheckCircle2, XCircle, Pencil, LayoutGrid, BookOpen,
  Briefcase, ShieldCheck, TrendingUp, Eye, Mail, UserCheck, UserX,
} from "lucide-react";
import logoPath from "@assets/Top_Logo_Tilcons_SkyBlue.png";
import type { Company, Contact } from "@shared/schema";

// ─── Types ────────────────────────────────────────────────────────────────────
type CompanyUser = {
  id: number; username: string; role: string;
  email?: string; fullName?: string; isActive: boolean; createdAt: string;
};

const PLAN_COLORS: Record<string, string> = {
  starter: "#0ea5e9", pro: "#8b5cf6", enterprise: "#f59e0b",
};

// ─── Onboard Company Dialog ───────────────────────────────────────────────────
function OnboardDialog({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    companyName: "", domain: "", plan: "starter" as "starter" | "pro" | "enterprise",
    adminUsername: "", adminPassword: "", adminEmail: "", adminFullName: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/superadmin/companies", {
        ...form, domain: form.domain || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superadmin/companies"] });
      toast({ title: "Company onboarded!", description: `${form.companyName} is now live.` });
      onClose();
    },
    onError: async (err: any) => {
      const msg = err?.message ?? "Failed to onboard company";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const valid = form.companyName && form.adminUsername && form.adminPassword.length >= 8 && form.adminEmail && form.adminFullName;

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-sky-500" /> Onboard New Company
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">This creates the company and its admin account in one step.</p>
          <div className="border-t pt-3 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Company Details</p>
            <div className="space-y-1.5">
              <Label htmlFor="cn">Company Name *</Label>
              <Input id="cn" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} data-testid="input-company-name" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="dom">Domain / Website</Label>
                <Input id="dom" placeholder="abc.com" value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Plan</Label>
                <Select value={form.plan} onValueChange={(v: any) => setForm(f => ({ ...f, plan: v }))}>
                  <SelectTrigger data-testid="select-plan"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="border-t pt-3 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Admin Account</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="au">Username *</Label>
                <Input id="au" value={form.adminUsername} onChange={e => setForm(f => ({ ...f, adminUsername: e.target.value }))} data-testid="input-admin-username" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ap">Password * (min 8)</Label>
                <Input id="ap" type="password" value={form.adminPassword} onChange={e => setForm(f => ({ ...f, adminPassword: e.target.value }))} data-testid="input-admin-password" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="afn">Full Name *</Label>
              <Input id="afn" value={form.adminFullName} onChange={e => setForm(f => ({ ...f, adminFullName: e.target.value }))} data-testid="input-admin-fullname" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ae">Email *</Label>
              <Input id="ae" type="email" value={form.adminEmail} onChange={e => setForm(f => ({ ...f, adminEmail: e.target.value }))} data-testid="input-admin-email" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={!valid || mutation.isPending}
            className="bg-sky-500 hover:bg-sky-400 text-white"
            data-testid="button-confirm-onboard"
          >
            {mutation.isPending ? "Creating…" : "Onboard Company"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Company Users Drawer ─────────────────────────────────────────────────────
function CompanyUsersDialog({ company, onClose }: { company: Company; onClose: () => void }) {
  const { data: users = [], isLoading } = useQuery<CompanyUser[]>({
    queryKey: ["/api/superadmin/companies", company.id, "users"],
    queryFn: () => fetch(`/api/superadmin/companies/${company.id}/users`, { credentials: "include" }).then(r => r.json()),
  });

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-sky-500" /> {company.name} — Users
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No users yet in this company.</p>
        ) : (
          <ul className="space-y-2">
            {users.map(u => (
              <li key={u.id} className="border rounded-lg px-4 py-2.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center text-xs font-bold">
                  {(u.fullName ?? u.username)?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{u.fullName ?? u.username}</p>
                  <p className="text-xs text-muted-foreground">{u.username} · {u.email ?? "no email"}</p>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase">{u.role.replace("_", " ")}</Badge>
                {u.isActive
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  : <XCircle className="h-4 w-4 text-red-400" />}
              </li>
            ))}
          </ul>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Resolve Onboarding Request Dialog ────────────────────────────────────────
function ResolveDialog({ request, onClose, onResolve }: { request: Contact; onClose: () => void; onResolve: (plan: string) => void }) {
  const [plan, setPlan] = useState("starter");
  
  // Parse company name from structured message
  let companyName = request.name + "'s Team";
  if (request.message) {
    const companyMatch = request.message.match(/Company:\s*(.*)/i);
    if (companyMatch && companyMatch[1]) {
      companyName = companyMatch[1].trim();
    }
  }

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-sky-500" /> Onboard {companyName}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Approve onboarding for {request.name}. A company workspace will be created, and the credentials will be emailed to <strong>{request.email}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Select Subscription Plan</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="starter">Starter Plan (INR pricing)</SelectItem>
                <SelectItem value="pro">Pro Plan (INR pricing)</SelectItem>
                <SelectItem value="enterprise">Enterprise Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="text-xs">Cancel</Button>
          <Button onClick={() => onResolve(plan)} className="bg-sky-500 hover:bg-sky-400 text-white text-xs">
            Approve & Create Workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main SuperAdmin Page ─────────────────────────────────────────────────────
const TABS = [
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "website",   label: "Website",   icon: Globe },
] as const;
type Tab = typeof TABS[number]["id"];

export default function SuperAdmin() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("companies");
  const [showOnboard, setShowOnboard] = useState(false);
  const [viewUsers, setViewUsers] = useState<Company | null>(null);
  const [resolveRequestItem, setResolveRequestItem] = useState<Contact | null>(null);

  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/superadmin/companies"],
  });

  const { data: pendingRequests = [] } = useQuery<Contact[]>({
    queryKey: ["/api/superadmin/pending-requests"],
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiRequest("PATCH", `/api/superadmin/companies/${id}`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/superadmin/companies"] }),
  });

  const deleteCompany = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/superadmin/companies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/superadmin/companies"] });
      toast({ title: "Company deleted" });
    },
  });

  const resolveRequest = useMutation({
    mutationFn: async ({ requestId, action, plan }: { requestId: string; action: "accept" | "reject"; plan?: string }) => {
      const res = await apiRequest("POST", "/api/superadmin/resolve-request", { requestId, action, plan });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/superadmin/companies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/superadmin/pending-requests"] });
      toast({
        title: variables.action === "accept" ? "Company Onboarded! 🎉" : "Request Rejected",
        description: variables.action === "accept" ? "Workspace created & credentials emailed." : "Rejection email sent.",
      });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const totalActive = companies.filter(c => c.isActive).length;

  return (
    <div className="h-screen flex overflow-hidden bg-muted/20">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0d2137] flex flex-col h-full shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="bg-white rounded-md px-3 py-2 inline-block">
            <img src={logoPath} alt="Tilcons" className="h-7 w-auto object-contain" />
          </div>
          <p className="text-white/40 text-[10px] uppercase tracking-widest mt-3 font-semibold">Super Admin</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              data-testid={`nav-super-${id}`}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeTab === id ? "bg-[#0ea5e9] text-white" : "text-white/70 hover:text-white hover:bg-white/8"
              }`}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div className="h-7 w-7 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-bold text-white">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.email?.split('@')[0] ?? "Super Admin"}</p>
              <p className="text-white/40 text-[10px]">Super Admin</p>
            </div>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 text-sm transition-all"
            data-testid="button-super-logout"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background border-b px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold">
              {activeTab === "companies" ? "Company Management" : "Website Administration"}
            </h1>
            <p className="text-xs text-muted-foreground">Tilcons Super Admin · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
          </div>
          {activeTab === "companies" && (
            <Button
              onClick={() => setShowOnboard(true)}
              className="bg-sky-500 hover:bg-sky-400 text-white"
              data-testid="button-onboard-company"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Onboard Company
            </Button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6">

          {/* ── Companies Tab ── */}
          {activeTab === "companies" && (
            <div className="space-y-5 max-w-5xl">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total Companies", value: companies.length, icon: Building2, accent: "#0ea5e9" },
                  { label: "Active", value: totalActive, icon: CheckCircle2, accent: "#10b981" },
                  { label: "Suspended", value: companies.length - totalActive, icon: XCircle, accent: "#ef4444" },
                ].map(s => (
                  <Card key={s.label} className="border-0 shadow-sm">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{s.label}</p>
                        <p className="text-3xl font-black" style={{ color: s.accent }}>{s.value}</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.accent}18` }}>
                        <s.icon className="h-5 w-5" style={{ color: s.accent }} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pending Requests notifications */}
              {pendingRequests.length > 0 && (
                <Card className="border-0 shadow-sm border-l-4 border-amber-500 bg-amber-500/5">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide flex items-center gap-2">
                        <Mail className="h-4 w-4 animate-bounce" /> Pending Onboarding Requests
                      </CardTitle>
                      <p className="text-xs text-amber-700/80 mt-0.5">Approve or reject agency signup submissions.</p>
                    </div>
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-bold">{pendingRequests.length} Pending</Badge>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-amber-100 dark:divide-amber-950/30">
                      {pendingRequests.map(request => {
                        let companyName = request.name + "'s Team";
                        if (request.message) {
                          const companyMatch = request.message.match(/Company:\s*(.*)/i);
                          if (companyMatch && companyMatch[1]) {
                            companyName = companyMatch[1].trim();
                          }
                        }
                        return (
                          <div key={request.id} className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{companyName}</span>
                                <Badge variant="outline" className="text-[9px] uppercase border-amber-300 text-amber-700 bg-amber-50/50">Demo Request</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Requested by: <strong>{request.name}</strong> ({request.email}) {request.phone ? `· ${request.phone}` : ""}
                              </p>
                              {request.message && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 bg-white/70 dark:bg-black/30 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/50 italic whitespace-pre-line leading-relaxed max-w-3xl">
                                  {request.message}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                size="sm"
                                onClick={() => setResolveRequestItem(request)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5"
                              >
                                <UserCheck className="h-3.5 w-3.5" /> Onboard (Accept)
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to reject the onboarding request from ${request.name}?`)) {
                                    resolveRequest.mutate({ requestId: request.id || "", action: "reject" });
                                  }
                                }}
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs gap-1.5"
                              >
                                <UserX className="h-3.5 w-3.5" /> Reject
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Companies table */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Onboarded Companies</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="px-5 py-10 text-center text-sm text-muted-foreground">Loading…</div>
                  ) : companies.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                      <Building2 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm font-bold mb-1">No companies yet</p>
                      <p className="text-xs text-muted-foreground mb-4">Click "Onboard Company" to add the first staffing agency.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {companies.map(c => (
                        <div key={c.id} className="px-5 py-3.5 flex items-center gap-4" data-testid={`row-company-${c.id}`}>
                          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center text-xs font-black">
                            {c.name.split(" ").map((p: string) => p[0]).slice(0, 2).join("").toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{c.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{c.domain ?? "No domain"} · Joined {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : ""}</p>
                          </div>
                          <Badge style={{ backgroundColor: `${PLAN_COLORS[c.plan || "free"]}18`, color: PLAN_COLORS[c.plan || "free"], borderColor: `${PLAN_COLORS[c.plan || "free"]}40` }} className="border text-[10px] uppercase">{c.plan || "free"}</Badge>
                          <Badge variant={c.isActive ? "default" : "secondary"} className="text-[10px] uppercase">
                            {c.isActive ? "Active" : "Suspended"}
                          </Badge>
                          <Button size="icon" variant="ghost" onClick={() => setViewUsers(c)} title="View users" data-testid={`button-view-users-${c.id || ""}`}>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            size="icon" variant="ghost"
                            onClick={() => toggleActive.mutate({ id: c.id || "", isActive: !c.isActive })}
                            title={c.isActive ? "Suspend" : "Activate"}
                            data-testid={`button-toggle-${c.id || ""}`}
                          >
                            {c.isActive
                              ? <XCircle className="h-4 w-4 text-amber-500" />
                              : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                          </Button>
                          <Button
                            size="icon" variant="ghost"
                            onClick={() => { if (confirm(`Permanently delete ${c.name} and all its users?`)) deleteCompany.mutate(c.id || ""); }}
                            data-testid={`button-delete-company-${c.id || ""}`}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ── Website Tab ── */}
          {activeTab === "website" && (
            <div className="max-w-2xl space-y-4">
              <div className="rounded-lg border bg-sky-50 dark:bg-sky-900/10 border-sky-200 dark:border-sky-800 px-4 py-3">
                <p className="text-sm font-bold text-sky-900 dark:text-sky-200">Website Management</p>
                <p className="text-xs text-sky-700 dark:text-sky-300/80 mt-0.5">Manage public-facing content: job postings, articles, and site settings. These are only visible to Super Admins.</p>
              </div>
              {[
                { icon: Briefcase, label: "Job Postings", sub: "Create and manage public job listings", href: "/admin?tab=jobs", accent: "#0ea5e9" },
                { icon: BookOpen, label: "Articles & Blog", sub: "Manage career advice and hiring insight articles", href: "/admin?tab=articles", accent: "#8b5cf6" },
                { icon: TrendingUp, label: "Analytics", sub: "View public stats and pipeline metrics", href: "/admin?tab=dashboard", accent: "#10b981" },
              ].map(({ icon: Icon, label, sub, href, accent }) => (
                <Card key={label} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation(href)}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}18` }}>
                      <Icon className="h-5 w-5" style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{label}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showOnboard && <OnboardDialog onClose={() => setShowOnboard(false)} />}
      {viewUsers && <CompanyUsersDialog company={viewUsers} onClose={() => setViewUsers(null)} />}
      {resolveRequestItem && (
        <ResolveDialog
          request={resolveRequestItem}
          onClose={() => setResolveRequestItem(null)}
          onResolve={(plan) => {
            resolveRequest.mutate({
              requestId: resolveRequestItem.id || "",
              action: "accept",
              plan
            });
            setResolveRequestItem(null);
          }}
        />
      )}
    </div>
  );
}
