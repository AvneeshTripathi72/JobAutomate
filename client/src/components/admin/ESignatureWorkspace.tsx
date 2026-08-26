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
  FileSignature, Plus, CheckCircle2, Clock, FileText, Pencil, Trash2, Mail
} from "lucide-react";
import type { ESignature } from "@shared/schema";

const STATUSES = ["Sent", "Viewed", "Signed"];

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

type ESignatureForm = {
  title: string;
  recipient: string;
  status: string;
};

const DEFAULT_FORM: ESignatureForm = {
  title: "",
  recipient: "",
  status: "Sent",
};

function ESignatureFormFields({ form, setForm }: { form: ESignatureForm; setForm: (f: ESignatureForm) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="title">Document Title *</Label>
        <Input id="title" placeholder="e.g. Offer Letter - Anjali Mehta" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="recipient">Recipient Email *</Label>
        <Input id="recipient" type="email" placeholder="anjali.mehta@example.com" value={form.recipient} onChange={e => setForm({ ...form, recipient: e.target.value })} />
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
    </div>
  );
}

function NewESignatureDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ESignatureForm>(DEFAULT_FORM);

  const mutation = useMutation({
    mutationFn: async (data: ESignatureForm) => {
      const res = await apiRequest("POST", "/api/esignatures", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/esignatures"] });
      toast({ title: "Document sent for signature" });
      setOpen(false);
      setForm(DEFAULT_FORM);
    },
    onError: () => toast({ title: "Could not send", variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-white">
          <Plus className="h-4 w-4 mr-1.5" /> Send Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Document for E-Signature</DialogTitle>
        </DialogHeader>
        <ESignatureFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.title || !form.recipient}
            className="bg-sky-500 hover:bg-sky-400 text-white"
          >
            {mutation.isPending ? "Sending…" : "Send Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditESignatureDialog({ item, onClose }: { item: ESignature; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState<ESignatureForm>({
    title: item.title,
    recipient: item.recipient,
    status: item.status,
  });

  const mutation = useMutation({
    mutationFn: async (data: ESignatureForm) => {
      const res = await apiRequest("PATCH", `/api/esignatures/${item.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/esignatures"] });
      toast({ title: "Document updated" });
      onClose();
    },
    onError: () => toast({ title: "Could not update", variant: "destructive" }),
  });

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit E-Signature</DialogTitle>
        </DialogHeader>
        <ESignatureFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.title || !form.recipient}
            className="bg-sky-500 hover:bg-sky-400 text-white"
          >
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ESignatureWorkspace() {
  const { toast } = useToast();
  const { data: esignatures = [], isLoading } = useQuery<ESignature[]>({ queryKey: ["/api/esignatures"] });
  const [editingItem, setEditingItem] = useState<ESignature | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/esignatures/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/esignatures"] });
      toast({ title: "Document removed" });
    },
  });

  const sentCount = esignatures.filter(o => o.status === "Sent").length;
  const viewedCount = esignatures.filter(o => o.status === "Viewed").length;
  const signedCount = esignatures.filter(o => o.status === "Signed").length;
  const totalCount = esignatures.length;

  return (
    <div className="space-y-6">
      {editingItem && <EditESignatureDialog item={editingItem} onClose={() => setEditingItem(null)} />}

      <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-3 flex items-start gap-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Live E-Signatures · Scoped to your account</p>
          <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
            Records are saved to your live Postgres database and visible only to your account.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <FileSignature className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground leading-tight">E-Signature</h2>
            <p className="text-xs text-muted-foreground">Manage and track documents</p>
          </div>
        </div>
        <NewESignatureDialog />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Sent" value={isLoading ? "—" : String(totalCount)} sub="All time documents" accent="#0ea5e9" icon={Mail} />
        <StatCard label="Pending" value={isLoading ? "—" : String(sentCount)} sub="Awaiting view" accent="#f59e0b" icon={Clock} />
        <StatCard label="Viewed" value={isLoading ? "—" : String(viewedCount)} sub="Not yet signed" accent="#8b5cf6" icon={FileText} />
        <StatCard label="Signed" value={isLoading ? "—" : String(signedCount)} sub="Completed" accent="#10b981" icon={CheckCircle2} />
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Recent Documents</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading documents…</div>
          ) : esignatures.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <FileSignature className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-bold text-foreground mb-1">No documents sent</p>
              <p className="text-xs text-muted-foreground mb-4">Send your first document for e-signature.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {esignatures.map((i) => (
                <div key={i.id} className="px-5 py-4 hover-elevate group">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{i.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{i.recipient}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">{i.status}</Badge>
                    <span className="text-xs text-muted-foreground w-24 text-right shrink-0">{new Date(i.createdAt).toLocaleDateString()}</span>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" onClick={() => setEditingItem(i)}>
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete this document?")) deleteMutation.mutate(i.id); }}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
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
