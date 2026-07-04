import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  ClipboardCheck, Plus, CheckCircle2, Clock, FileText, Pencil, Trash2,
} from "lucide-react";
import type { Onboarding } from "@shared/schema";

const STATUSES = [
  "Background Check",
  "Document Upload",
  "I-9 Verification",
  "Equipment Pickup",
  "Offer Acceptance",
  "MSA Review",
  "NDA Signing",
  "Profile Setup",
  "Cleared"
];

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

type OnboardingForm = {
  candidateName: string;
  jobTitle: string;
  company: string;
  status: string;
  progress: number;
  etaDays: number;
};

const DEFAULT_FORM: OnboardingForm = {
  candidateName: "",
  jobTitle: "",
  company: "",
  status: "Background Check",
  progress: 0,
  etaDays: 7,
};

function OnboardingFormFields({ form, setForm }: { form: OnboardingForm; setForm: (f: OnboardingForm) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="cn">Candidate Name *</Label>
        <Input id="cn" value={form.candidateName} onChange={e => setForm({ ...form, candidateName: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="jt">Job Title *</Label>
          <Input id="jt" value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="co">Company *</Label>
          <Input id="co" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Status *</Label>
        <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="pr">Progress (%)</Label>
          <Input id="pr" type="number" min="0" max="100" value={form.progress} onChange={e => setForm({ ...form, progress: Number(e.target.value) || 0 })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="eta">ETA (Days)</Label>
          <Input id="eta" type="number" min="0" value={form.etaDays} onChange={e => setForm({ ...form, etaDays: Number(e.target.value) || 0 })} />
        </div>
      </div>
    </div>
  );
}

function NewOnboardingDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<OnboardingForm>(DEFAULT_FORM);

  const mutation = useMutation({
    mutationFn: async (data: OnboardingForm) => {
      const res = await apiRequest("POST", "/api/onboardings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/onboardings"] });
      toast({ title: "Onboarding created" });
      setOpen(false);
      setForm(DEFAULT_FORM);
    },
    onError: () => toast({ title: "Could not create", variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-white">
          <Plus className="h-4 w-4 mr-1.5" /> New Onboarding
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Onboarding</DialogTitle>
        </DialogHeader>
        <OnboardingFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.candidateName || !form.jobTitle || !form.company}
            className="bg-sky-500 hover:bg-sky-400 text-white"
          >
            {mutation.isPending ? "Saving…" : "Save Onboarding"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditOnboardingDialog({ item, onClose }: { item: Onboarding; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState<OnboardingForm>({
    candidateName: item.candidateName,
    jobTitle: item.jobTitle,
    company: item.company,
    status: item.status,
    progress: item.progress ?? 0,
    etaDays: item.etaDays ?? 7,
  });

  const mutation = useMutation({
    mutationFn: async (data: OnboardingForm) => {
      const res = await apiRequest("PATCH", `/api/onboardings/${item.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/onboardings"] });
      toast({ title: "Onboarding updated" });
      onClose();
    },
    onError: () => toast({ title: "Could not update", variant: "destructive" }),
  });

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Onboarding</DialogTitle>
        </DialogHeader>
        <OnboardingFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.candidateName || !form.jobTitle || !form.company}
            className="bg-sky-500 hover:bg-sky-400 text-white"
          >
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function OnboardingWorkspace() {
  const { toast } = useToast();
  const { data: onboardings = [], isLoading } = useQuery<Onboarding[]>({ queryKey: ["/api/onboardings"] });
  const [editingItem, setEditingItem] = useState<Onboarding | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/onboardings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/onboardings"] });
      toast({ title: "Onboarding removed" });
    },
  });

  const activeCount = onboardings.filter(o => o.status !== "Cleared").length;
  const completedCount = onboardings.filter(o => o.status === "Cleared").length;
  const avgEta = activeCount > 0 ? (onboardings.filter(o => o.status !== "Cleared").reduce((acc, o) => acc + (o.etaDays || 0), 0) / activeCount).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {editingItem && <EditOnboardingDialog item={editingItem} onClose={() => setEditingItem(null)} />}

      <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-3 flex items-start gap-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Live Onboarding · Scoped to your account</p>
          <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
            Records are saved to your live Postgres database and visible only to your account.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground leading-tight">Onboarding</h2>
            <p className="text-xs text-muted-foreground">Documents, I-9 and compliance</p>
          </div>
        </div>
        <NewOnboardingDialog />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Onboardings" value={isLoading ? "—" : String(activeCount)} sub="In progress" accent="#0ea5e9" icon={ClipboardCheck} />
        <StatCard label="Avg Days to Start" value={isLoading ? "—" : String(avgEta)} sub="Estimated" accent="#10b981" icon={Clock} />
        <StatCard label="Completed" value={isLoading ? "—" : String(completedCount)} sub="Fully cleared" accent="#8b5cf6" icon={CheckCircle2} />
        <StatCard label="Pending Docs" value="0" sub="Mocked stat" accent="#f59e0b" icon={FileText} />
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Active Onboarding Pipeline</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading onboardings…</div>
          ) : onboardings.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <ClipboardCheck className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-bold text-foreground mb-1">No onboardings yet</p>
              <p className="text-xs text-muted-foreground mb-4">Add your first candidate onboarding to track progress.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {onboardings.map((i) => (
                <div key={i.id} className="px-5 py-4 hover-elevate group">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{i.candidateName}</p>
                      <p className="text-xs text-muted-foreground truncate">{i.jobTitle} · {i.company}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">{i.status}</Badge>
                    <span className="text-xs text-muted-foreground w-16 text-right shrink-0">ETA {i.etaDays}d</span>
                    <span className="text-xs font-bold text-foreground w-10 text-right tabular-nums shrink-0">{i.progress}%</span>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" onClick={() => setEditingItem(i)}>
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete this record?")) deleteMutation.mutate(i.id); }}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-sky-500" style={{ width: `${i.progress}%` }} />
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
