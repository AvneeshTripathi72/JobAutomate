import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ShieldCheck, Clock, CheckCircle2, AlertCircle, TrendingUp, MoreHorizontal, Plus, Trash2, Pencil } from "lucide-react";
import type { BackgroundCheck } from "@shared/schema";

const PROVIDERS = ["Checkr", "Sterling", "AuthBridge", "HireRight", "First Advantage"];
const STATUSES = ["Pending", "In Progress", "Cleared", "Flagged"];

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

type BackgroundCheckForm = {
  candidateName: string;
  provider: string;
  status: string;
  etaDays: number;
};

const DEFAULT_FORM: BackgroundCheckForm = {
  candidateName: "",
  provider: "Checkr",
  status: "In Progress",
  etaDays: 3,
};

function BackgroundCheckFormFields({ form, setForm }: { form: BackgroundCheckForm; setForm: (f: BackgroundCheckForm) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="candidateName">Candidate Name *</Label>
        <Input id="candidateName" placeholder="e.g. John Doe" value={form.candidateName} onChange={e => setForm({ ...form, candidateName: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Provider *</Label>
        <Select value={form.provider} onValueChange={v => setForm({ ...form, provider: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Status *</Label>
          <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="eta">ETA (Days)</Label>
          <Input id="eta" type="number" min="0" value={form.etaDays} onChange={e => setForm({ ...form, etaDays: Number(e.target.value) || 0 })} />
        </div>
      </div>
    </div>
  );
}

function NewCheckDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<BackgroundCheckForm>(DEFAULT_FORM);

  const mutation = useMutation({
    mutationFn: async (data: BackgroundCheckForm) => {
      const res = await apiRequest("POST", "/api/background-checks", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/background-checks"] });
      toast({ title: "Background check initiated" });
      setOpen(false);
      setForm(DEFAULT_FORM);
    },
    onError: () => toast({ title: "Could not create", variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-white">
          <Plus className="h-4 w-4 mr-1.5" /> New Check
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Initiate Background Check</DialogTitle>
        </DialogHeader>
        <BackgroundCheckFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.candidateName}
            className="bg-sky-500 hover:bg-sky-400 text-white"
          >
            {mutation.isPending ? "Starting…" : "Start Check"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditCheckDialog({ item, onClose }: { item: BackgroundCheck; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState<BackgroundCheckForm>({
    candidateName: item.candidateName,
    provider: item.provider,
    status: item.status,
    etaDays: item.etaDays ?? 3,
  });

  const mutation = useMutation({
    mutationFn: async (data: BackgroundCheckForm) => {
      const res = await apiRequest("PATCH", `/api/background-checks/${item.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/background-checks"] });
      toast({ title: "Check updated" });
      onClose();
    },
    onError: () => toast({ title: "Could not update", variant: "destructive" }),
  });

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Background Check</DialogTitle>
        </DialogHeader>
        <BackgroundCheckFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.candidateName}
            className="bg-sky-500 hover:bg-sky-400 text-white"
          >
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function BackgroundChecksWorkspace() {
  const { toast } = useToast();
  const { data: checks = [], isLoading } = useQuery<BackgroundCheck[]>({ queryKey: ["/api/background-checks"] });
  const [editingItem, setEditingItem] = useState<BackgroundCheck | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/background-checks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/background-checks"] });
      toast({ title: "Check removed" });
    },
  });

  const inProgressCount = checks.filter(c => c.status === "In Progress" || c.status === "Pending").length;
  const clearedCount = checks.filter(c => c.status === "Cleared").length;
  const flaggedCount = checks.filter(c => c.status === "Flagged").length;

  const statusColor = (s: string) =>
    s === "Cleared" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
    s === "Flagged" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" :
    (s === "In Progress" || s === "Pending") ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" :
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";

  return (
    <div className="space-y-6">
      {editingItem && <EditCheckDialog item={editingItem} onClose={() => setEditingItem(null)} />}

      <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-3 flex items-start gap-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Live Background Checks · Scoped to your account</p>
          <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
            Records are saved to your live Postgres database and visible only to your account.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground leading-tight">Background Checks</h2>
            <p className="text-xs text-muted-foreground">Checkr · Sterling · HireRight</p>
          </div>
        </div>
        <NewCheckDialog />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="In Progress" value={isLoading ? "—" : String(inProgressCount)} sub="Running checks" accent="#0ea5e9" icon={Clock} />
        <StatCard label="Cleared" value={isLoading ? "—" : String(clearedCount)} sub="Passed verification" accent="#10b981" icon={CheckCircle2} />
        <StatCard label="Flagged" value={isLoading ? "—" : String(flaggedCount)} sub="Needs review" accent="#ef4444" icon={AlertCircle} />
        <StatCard label="Total Checks" value={isLoading ? "—" : String(checks.length)} sub="All time" accent="#8b5cf6" icon={TrendingUp} />
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Background Checks in Flight</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading checks…</div>
          ) : checks.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <ShieldCheck className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-bold text-foreground mb-1">No background checks found</p>
              <p className="text-xs text-muted-foreground mb-4">Start your first check to ensure compliance.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {checks.map((c) => (
                <div key={c.id} className="px-5 py-3 flex items-center gap-4 hover-elevate group">
                  <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center text-xs font-black shrink-0">
                    {c.candidateName.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{c.candidateName}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.provider} · Started {new Date(c.createdAt).toLocaleDateString()} · ETA {c.etaDays}d
                    </p>
                  </div>
                  <Badge className={statusColor(c.status)}>{c.status}</Badge>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => setEditingItem(c)}>
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete this record?")) deleteMutation.mutate(c.id); }}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
