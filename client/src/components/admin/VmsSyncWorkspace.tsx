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
  Plug, Plus, CheckCircle2, RefreshCw, AlertCircle, Pencil, Trash2,
} from "lucide-react";
import type { VmsConnection } from "@shared/schema";

const SYSTEMS = ["Beeline", "Fieldglass", "SAP", "Other"];
const STATUSES = ["Connected", "Pending", "Disconnected", "Error"];

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

type VmsForm = {
  systemName: string;
  clientName: string;
  status: string;
  syncedRecords: number;
  notes: string;
};

const DEFAULT_FORM: VmsForm = {
  systemName: "Beeline",
  clientName: "",
  status: "Pending",
  syncedRecords: 0,
  notes: "",
};

function statusColor(status: string) {
  if (status === "Connected") return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  if (status === "Error") return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
  if (status === "Disconnected") return "bg-muted text-muted-foreground border-border";
  return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
}

function VmsFormFields({ form, setForm }: { form: VmsForm; setForm: (f: VmsForm) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>VMS System *</Label>
        <Select value={form.systemName} onValueChange={v => setForm({ ...form, systemName: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {SYSTEMS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cn">Client / Program Name *</Label>
        <Input id="cn" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} />
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
          <Label htmlFor="sr">Synced Records</Label>
          <Input id="sr" type="number" min="0" value={form.syncedRecords} onChange={e => setForm({ ...form, syncedRecords: Number(e.target.value) || 0 })} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="nt">Notes</Label>
        <Input id="nt" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
      </div>
    </div>
  );
}

import { supabase } from "@/lib/supabase";

function NewVmsDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<VmsForm>(DEFAULT_FORM);

  const mutation = useMutation({
    mutationFn: async (data: VmsForm) => {
      const { data: res, error } = await supabase.from('vms_connections').insert({
        system_name: data.systemName,
        client_name: data.clientName,
        status: data.status,
        synced_records: data.syncedRecords,
        notes: data.notes,
        last_sync_at: data.status === "Connected" ? new Date().toISOString() : null
      });
      if (error) throw error;
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vms-connections"] });
      toast({ title: "VMS connection added" });
      setOpen(false);
      setForm(DEFAULT_FORM);
    },
    onError: () => toast({ title: "Could not add connection", variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-white">
          <Plus className="h-4 w-4 mr-1.5" /> New Connection
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add VMS Connection</DialogTitle>
        </DialogHeader>
        <VmsFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.clientName}
            className="bg-sky-500 hover:bg-sky-400 text-white"
          >
            {mutation.isPending ? "Saving…" : "Save Connection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditVmsDialog({ item, onClose }: { item: VmsConnection; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState<VmsForm>({
    systemName: item.systemName,
    clientName: item.clientName,
    status: item.status,
    syncedRecords: item.syncedRecords ?? 0,
    notes: item.notes ?? "",
  });

  const mutation = useMutation({
    mutationFn: async (data: VmsForm) => {
      const { data: res, error } = await supabase.from('vms_connections').update({
        system_name: data.systemName,
        client_name: data.clientName,
        status: data.status,
        synced_records: data.syncedRecords,
        notes: data.notes,
        last_sync_at: data.status === "Connected" ? new Date().toISOString() : item.lastSyncAt,
      }).eq('id', item.id);
      if (error) throw error;
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vms-connections"] });
      toast({ title: "Connection updated" });
      onClose();
    },
    onError: () => toast({ title: "Could not update", variant: "destructive" }),
  });

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit VMS Connection</DialogTitle>
        </DialogHeader>
        <VmsFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.clientName}
            className="bg-sky-500 hover:bg-sky-400 text-white"
          >
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function VmsSyncWorkspace() {
  const { toast } = useToast();
  const { data: connections = [], isLoading } = useQuery<VmsConnection[]>({ 
    queryKey: ["/api/vms-connections"],
    queryFn: async () => {
      const { data, error } = await supabase.from('vms_connections').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        systemName: row.system_name,
        clientName: row.client_name,
        status: row.status,
        syncedRecords: row.synced_records,
        notes: row.notes,
        lastSyncAt: row.last_sync_at ? new Date(row.last_sync_at) : undefined,
      } as VmsConnection));
    }
  });
  const [editingItem, setEditingItem] = useState<VmsConnection | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('vms_connections').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vms-connections"] });
      toast({ title: "Connection removed" });
    },
  });

  const connectedCount = connections.filter(c => c.status === "Connected").length;
  const errorCount = connections.filter(c => c.status === "Error").length;
  const totalSynced = connections.reduce((acc, c) => acc + (c.syncedRecords || 0), 0);

  return (
    <div className="space-y-6">
      {editingItem && <EditVmsDialog item={editingItem} onClose={() => setEditingItem(null)} />}

      <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-3 flex items-start gap-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Live VMS Tracking · Scoped to your account</p>
          <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
            Records are saved to your live Postgres database. This tracks connection status and sync history — actual data exchange with Beeline / Fieldglass / SAP requires those vendors' API credentials to be configured separately.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <Plug className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground leading-tight">VMS Sync</h2>
            <p className="text-xs text-muted-foreground">Beeline · Fieldglass · SAP</p>
          </div>
        </div>
        <NewVmsDialog />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Connected Systems" value={isLoading ? "—" : String(connectedCount)} sub="Active" accent="#0ea5e9" icon={Plug} />
        <StatCard label="Total Synced Records" value={isLoading ? "—" : String(totalSynced)} sub="All connections" accent="#10b981" icon={RefreshCw} />
        <StatCard label="Errors" value={isLoading ? "—" : String(errorCount)} sub="Need attention" accent="#ef4444" icon={AlertCircle} />
        <StatCard label="Total Connections" value={isLoading ? "—" : String(connections.length)} sub="Configured" accent="#8b5cf6" icon={CheckCircle2} />
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">VMS Connections</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading connections…</div>
          ) : connections.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Plug className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-bold text-foreground mb-1">No VMS connections yet</p>
              <p className="text-xs text-muted-foreground mb-4">Add a connection to Beeline, Fieldglass, SAP, or another VMS to track sync status.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {connections.map((c) => (
                <div key={c.id} className="px-5 py-4 hover-elevate group flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{c.systemName} · {c.clientName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.syncedRecords} records synced{c.lastSyncAt ? ` · Last sync ${new Date(c.lastSyncAt).toLocaleDateString()}` : ""}
                      {c.notes ? ` · ${c.notes}` : ""}
                    </p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${statusColor(c.status)}`}>{c.status}</Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => setEditingItem(c)}>
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete this connection?")) deleteMutation.mutate(c.id); }}>
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
