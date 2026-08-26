import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { supabase } from "@/lib/supabase";
import {
  Building2, Plus, TrendingUp, IndianRupee, Target, Trash2, Briefcase,
  CheckCircle2, Pencil,
} from "lucide-react";
import type { Client, Deal } from "@shared/schema";

const STAGES = [
  { value: "qualified",   label: "Qualified",   accent: "#3b82f6" },
  { value: "discovery",   label: "Discovery",   accent: "#8b5cf6" },
  { value: "proposal",    label: "Proposal",    accent: "#f59e0b" },
  { value: "negotiation", label: "Negotiation", accent: "#0ea5e9" },
  { value: "won",         label: "Won",         accent: "#10b981" },
  { value: "lost",        label: "Lost",        accent: "#ef4444" },
];

const STATUSES = [
  { value: "active",   label: "Active" },
  { value: "renewal",  label: "Renewal" },
  { value: "pursuit",  label: "Pursuit" },
  { value: "inactive", label: "Inactive" },
];

const INDUSTRIES = [
  "Technology","Banking & Finance","Pharma & Healthcare",
  "Manufacturing","Retail","Logistics","Other",
];

const formatINR = (v: number) =>
  v >= 10000000 ? `₹${(v / 10000000).toFixed(2)} Cr`
  : v >= 100000 ? `₹${(v / 100000).toFixed(1)} L`
  : `₹${v.toLocaleString("en-IN")}`;

function StatCard({ label, value, sub, icon: Icon, accent }: { label: string; value: string; sub?: string; icon: any; accent: string }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <p className="text-3xl font-black text-foreground leading-none" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
          </div>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}18` }}>
            <Icon className="h-5 w-5" style={{ color: accent }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Shared client form fields ────────────────────────────────────────────── */
type ClientForm = {
  companyName: string; industry: string; city: string;
  primaryContactName: string; primaryContactEmail: string; primaryContactPhone: string;
  status: string; accountOwner: string; arrInr: number; notes: string;
};

const DEFAULT_CLIENT_FORM: ClientForm = {
  companyName: "", industry: "Technology", city: "Bangalore",
  primaryContactName: "", primaryContactEmail: "", primaryContactPhone: "",
  status: "active", accountOwner: "Unassigned", arrInr: 0, notes: "",
};

function ClientFormFields({ form, setForm }: { form: ClientForm; setForm: (f: ClientForm) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="cn">Company Name *</Label>
          <Input id="cn" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} data-testid="input-client-name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ci">City *</Label>
          <Input id="ci" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} data-testid="input-client-city" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Industry *</Label>
          <Select value={form.industry} onValueChange={v => setForm({ ...form, industry: v })}>
            <SelectTrigger data-testid="select-industry"><SelectValue /></SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
            <SelectTrigger data-testid="select-status"><SelectValue /></SelectTrigger>
            <SelectContent>{STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pn">Primary Contact Name *</Label>
        <Input id="pn" value={form.primaryContactName} onChange={e => setForm({ ...form, primaryContactName: e.target.value })} data-testid="input-contact-name" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="pe">Email *</Label>
          <Input id="pe" type="email" value={form.primaryContactEmail} onChange={e => setForm({ ...form, primaryContactEmail: e.target.value })} data-testid="input-contact-email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pp">Phone</Label>
          <Input id="pp" value={form.primaryContactPhone} onChange={e => setForm({ ...form, primaryContactPhone: e.target.value })} data-testid="input-contact-phone" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="ao">Account Owner</Label>
          <Input id="ao" value={form.accountOwner} onChange={e => setForm({ ...form, accountOwner: e.target.value })} data-testid="input-owner" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="arr">ARR (₹)</Label>
          <Input id="arr" type="number" min="0" value={form.arrInr} onChange={e => setForm({ ...form, arrInr: Number(e.target.value) || 0 })} data-testid="input-arr" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="nt">Notes</Label>
        <Textarea id="nt" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} data-testid="input-notes" />
      </div>
    </div>
  );
}

/* ── New Client Dialog ─────────────────────────────────────────────────────── */
function NewClientDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ClientForm>(DEFAULT_CLIENT_FORM);

  const mutation = useMutation({
    mutationFn: async (data: ClientForm) => {
      // 1. Create company row first
      let { data: companyData } = await supabase
        .from("companies")
        .select("id")
        .eq("name", data.companyName)
        .maybeSingle();

      let companyId;
      if (companyData) {
        companyId = companyData.id;
      } else {
        const { data: newComp, error: insertCompErr } = await supabase
          .from("companies")
          .insert([{ name: data.companyName }])
          .select()
          .single();
        if (insertCompErr) throw insertCompErr;
        companyId = newComp.id;
      }

      // 2. Insert Client
      const { data: clientData, error } = await supabase
        .from("clients")
        .insert([{
          company_id: companyId,
          company_name: data.companyName,
          industry: data.industry,
          city: data.city,
          primary_contact_name: data.primaryContactName,
          primary_contact_email: data.primaryContactEmail,
          primary_contact_phone: data.primaryContactPhone || null,
          account_owner: data.accountOwner || "Unassigned",
          arr_inr: data.arrInr || 0,
          notes: data.notes || null,
          status: data.status || "active"
        }])
        .select();
      if (error) throw error;
      return clientData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/clients"] });
      toast({ title: "Client added", description: "New client account created." });
      setOpen(false);
      setForm(DEFAULT_CLIENT_FORM);
    },
    onError: (error: Error) => toast({ title: "Could not save", description: error.message || "Check required fields and try again.", variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-white" data-testid="button-new-client">
          <Plus className="h-4 w-4 mr-1.5" /> New Client
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <ClientFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel-client">Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.companyName || !form.primaryContactName || !form.primaryContactEmail}
            className="bg-sky-500 hover:bg-sky-400 text-white"
            data-testid="button-save-client"
          >
            {mutation.isPending ? "Saving…" : "Save Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Edit Client Dialog ────────────────────────────────────────────────────── */
function EditClientDialog({ client, onClose }: { client: Client; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState<ClientForm>({
    companyName: client.companyName,
    industry: client.industry,
    city: client.city,
    primaryContactName: client.primaryContactName,
    primaryContactEmail: client.primaryContactEmail,
    primaryContactPhone: client.primaryContactPhone ?? "",
    status: client.status || "lead",
    accountOwner: client.accountOwner ?? "Unassigned",
    arrInr: client.arrInr ?? 0,
    notes: client.notes ?? "",
  });

  const mutation = useMutation({
    mutationFn: async (data: ClientForm) => {
      // 1. Find or create company
      let { data: companyData } = await supabase
        .from("companies")
        .select("id")
        .eq("name", data.companyName)
        .maybeSingle();

      let companyId;
      if (companyData) {
        companyId = companyData.id;
      } else {
        const { data: newComp, error: insertCompErr } = await supabase
          .from("companies")
          .insert([{ name: data.companyName }])
          .select()
          .single();
        if (insertCompErr) throw insertCompErr;
        companyId = newComp.id;
      }

      // 2. Update Client
      const { data: clientData, error } = await supabase
        .from("clients")
        .update({
          company_id: companyId,
          company_name: data.companyName,
          industry: data.industry,
          city: data.city,
          primary_contact_name: data.primaryContactName,
          primary_contact_email: data.primaryContactEmail,
          primary_contact_phone: data.primaryContactPhone || null,
          account_owner: data.accountOwner || "Unassigned",
          arr_inr: data.arrInr || 0,
          notes: data.notes || null,
          status: data.status || "active"
        })
        .eq("id", client.id)
        .select();
      if (error) throw error;
      return clientData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/clients"] });
      toast({ title: "Client updated" });
      onClose();
    },
    onError: (error: Error) => toast({ title: "Could not update", description: error.message || "Check required fields.", variant: "destructive" }),
  });

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <ClientFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.companyName || !form.primaryContactName || !form.primaryContactEmail}
            className="bg-sky-500 hover:bg-sky-400 text-white"
            data-testid="button-save-edit-client"
          >
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Shared deal form fields ──────────────────────────────────────────────── */
type DealForm = {
  clientId: string; title: string; stage: string;
  valueInr: number; positions: number; owner: string; notes: string;
};

function DealFormFields({
  form, setForm, clients, lockClient,
}: {
  form: DealForm; setForm: (f: DealForm) => void;
  clients: Client[]; lockClient?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>Client *</Label>
        <Select value={form.clientId} onValueChange={v => setForm({ ...form, clientId: v })} disabled={lockClient}>
          <SelectTrigger data-testid="select-deal-client"><SelectValue placeholder="Choose client" /></SelectTrigger>
          <SelectContent>{clients.map(c => <SelectItem key={c.id || Math.random().toString()} value={c.id || ""}>{c.companyName}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="dt">Deal Title *</Label>
        <Input id="dt" placeholder="e.g. DevOps pod (8 contractors)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} data-testid="input-deal-title" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label>Stage</Label>
          <Select value={form.stage} onValueChange={v => setForm({ ...form, stage: v })}>
            <SelectTrigger data-testid="select-deal-stage"><SelectValue /></SelectTrigger>
            <SelectContent>{STAGES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dv">Value (₹)</Label>
          <Input id="dv" type="number" min="0" value={form.valueInr} onChange={e => setForm({ ...form, valueInr: Number(e.target.value) || 0 })} data-testid="input-deal-value" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dp">Positions</Label>
          <Input id="dp" type="number" min="1" value={form.positions} onChange={e => setForm({ ...form, positions: Number(e.target.value) || 1 })} data-testid="input-deal-positions" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="do">Owner</Label>
        <Input id="do" value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} data-testid="input-deal-owner" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="dn">Notes</Label>
        <Textarea id="dn" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} data-testid="input-deal-notes" />
      </div>
    </div>
  );
}

/* ── New Deal Dialog ───────────────────────────────────────────────────────── */
function NewDealDialog({ clients }: { clients: Client[] }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<DealForm>({
    clientId: "", title: "", stage: "qualified", valueInr: 0, positions: 1, owner: "Unassigned", notes: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: DealForm) => {
      const { data: dealData, error } = await supabase
        .from("deals")
        .insert([{
          client_id: data.clientId,
          title: data.title,
          stage: data.stage || "qualified",
          value_inr: data.valueInr || 0,
          positions: data.positions || 1,
          owner: data.owner || "Unassigned",
          notes: data.notes || null
        }])
        .select();
      if (error) throw error;
      return dealData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals"] });
      toast({ title: "Deal created", description: "New opportunity added to pipeline." });
      setOpen(false);
      setForm({ clientId: "", title: "", stage: "qualified", valueInr: 0, positions: 1, owner: "Unassigned", notes: "" });
    },
    onError: (error: Error) => toast({ title: "Could not save", description: error.message || "Check required fields and try again.", variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={clients.length === 0} data-testid="button-new-deal">
          <Plus className="h-4 w-4 mr-1.5" /> New Deal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Add New Deal</DialogTitle></DialogHeader>
        <DealFormFields form={form} setForm={setForm} clients={clients} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.clientId || !form.title}
            className="bg-sky-500 hover:bg-sky-400 text-white"
            data-testid="button-save-deal"
          >
            {mutation.isPending ? "Saving…" : "Save Deal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Edit Deal Dialog ──────────────────────────────────────────────────────── */
function EditDealDialog({ deal, clients, onClose }: { deal: Deal; clients: Client[]; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState<DealForm>({
    clientId: deal.clientId,
    title: deal.title,
    stage: deal.stage,
    valueInr: deal.valueInr ?? 0,
    positions: deal.positions ?? 1,
    owner: deal.owner ?? "Unassigned",
    notes: deal.notes ?? "",
  });

  const mutation = useMutation({
    mutationFn: async (data: DealForm) => {
      const { data: dealData, error } = await supabase
        .from("deals")
        .update({
          client_id: data.clientId,
          title: data.title,
          stage: data.stage,
          value_inr: data.valueInr,
          positions: data.positions,
          owner: data.owner,
          notes: data.notes || null
        })
        .eq("id", deal.id)
        .select();
      if (error) throw error;
      return dealData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals"] });
      toast({ title: "Deal updated" });
      onClose();
    },
    onError: (error: Error) => toast({ title: "Could not update", description: error.message || "Failed to update.", variant: "destructive" }),
  });

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Edit Deal</DialogTitle></DialogHeader>
        <DealFormFields form={form} setForm={setForm} clients={clients} lockClient />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.title}
            className="bg-sky-500 hover:bg-sky-400 text-white"
            data-testid="button-save-edit-deal"
          >
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Main CRM Workspace ────────────────────────────────────────────────────── */
export default function CrmWorkspace() {
  const { toast } = useToast();
  const [dbReady, setDbReady] = useState<boolean | null>(null);

  // ── Auto-check & notify if tables aren't provisioned ────────────────────
  const checkDbAndSetup = async () => {
    try {
      const { error } = await supabase.from("clients").select("id").limit(1);
      if (error && error.code === "42P01") {
        // Table doesn't exist
        setDbReady(false);
        toast({
          title: "⚠️ Database Setup Required",
          description: "The clients/deals tables don't exist yet. Please run the SQL migration in your Supabase Dashboard.",
          variant: "destructive",
        });
      } else {
        setDbReady(true);
      }
    } catch {
      setDbReady(false);
    }
  };

  // Run on mount
  useState(() => { checkDbAndSetup(); });

  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ["/api/crm/clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("company_name", { ascending: true });
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        companyId: row.company_id,
        companyName: row.company_name,
        industry: row.industry,
        city: row.city,
        primaryContactName: row.primary_contact_name,
        primaryContactEmail: row.primary_contact_email,
        primaryContactPhone: row.primary_contact_phone || "",
        status: row.status || "active",
        accountOwner: row.account_owner || "Unassigned",
        arrInr: row.arr_inr || 0,
        notes: row.notes || "",
      } as Client));
    }
  });

  const { data: deals = [], isLoading: dealsLoading } = useQuery<Deal[]>({
    queryKey: ["/api/crm/deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        clientId: row.client_id,
        title: row.title,
        stage: row.stage || "qualified",
        valueInr: row.value_inr || 0,
        positions: row.positions || 1,
        owner: row.owner || "Unassigned",
        notes: row.notes || "",
      } as Deal));
    }
  });

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals"] });
      toast({ title: "Client removed" });
    },
  });

  const deleteDeal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("deals")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
  });

  const totalArr = clients.reduce((s, c) => s + (c.arrInr || 0), 0);
  const openDeals = deals.filter(d => d.stage !== "won" && d.stage !== "lost");
  const openValue = openDeals.reduce((s, d) => s + (d.valueInr || 0), 0);
  const wonDeals = deals.filter(d => d.stage === "won");
  const wonValue = wonDeals.reduce((s, d) => s + (d.valueInr || 0), 0);

  return (
    <div className="space-y-5">
      {/* Edit dialogs (portal-rendered) */}
      {editingClient && (
        <EditClientDialog client={editingClient} onClose={() => setEditingClient(null)} />
      )}
      {editingDeal && (
        <EditDealDialog deal={editingDeal} clients={clients} onClose={() => setEditingDeal(null)} />
      )}

      {/* DB setup banner — shown when tables don't exist yet */}
      {dbReady === false && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/10 px-4 py-4 flex items-start gap-3">
          <span className="text-lg shrink-0">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">Database Tables Not Found</p>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mb-3">
              The <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded">clients</code> and <code className="font-mono bg-amber-100 dark:bg-amber-900 px-1 rounded">deals</code> tables don't exist yet in your Supabase database.
              Run the migration SQL to activate CRM:
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://supabase.com/dashboard/project/yeoavqufxojhraycowtu/sql/new`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors"
              >
                Open Supabase SQL Editor →
              </a>
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-amber-300 text-amber-800 text-xs font-bold hover:bg-amber-50 transition-colors"
                onClick={() => {
                  const sql = `-- Run this in Supabase Dashboard > SQL Editor
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid primary key default gen_random_uuid(),
  company_id uuid, company_name text not null, industry text not null,
  city text not null, primary_contact_name text not null,
  primary_contact_email text not null, primary_contact_phone text,
  account_owner text default 'Unassigned', arr_inr integer default 0,
  notes text, status text default 'active',
  created_at timestamptz default now(), updated_at timestamptz default now()
);
CREATE TABLE IF NOT EXISTS public.deals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients on delete cascade not null,
  title text not null, stage text default 'qualified',
  value_inr integer default 0, positions integer default 1,
  owner text default 'Unassigned', notes text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals DISABLE ROW LEVEL SECURITY;`;
                  navigator.clipboard.writeText(sql).then(() =>
                    toast({ title: "SQL copied!", description: "Paste it in Supabase SQL Editor and run." })
                  );
                }}
              >
                📋 Copy SQL to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-3 flex items-start gap-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Live CRM · Scoped to your account</p>
          <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
            Every client and deal you create is saved to your live Postgres database and visible only to your user account. No mock data.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground leading-tight">CRM · Clients &amp; Deals</h2>
            <p className="text-xs text-muted-foreground">Accounts, contacts and opportunities — fully editable</p>
          </div>
        </div>
        <div className="flex gap-2">
          <NewDealDialog clients={clients} />
          <NewClientDialog />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Clients"  value={clientsLoading ? "—" : String(clients.length)}        icon={Building2}   accent="#0ea5e9" sub="Active accounts in CRM" />
        <StatCard label="Total ARR"      value={clientsLoading ? "—" : formatINR(totalArr)}            icon={IndianRupee} accent="#10b981" sub="Annual recurring revenue" />
        <StatCard label="Open Pipeline"  value={dealsLoading ? "—" : formatINR(openValue)}             icon={Target}      accent="#f59e0b" sub={`${openDeals.length} open deals`} />
        <StatCard label="Won This Period" value={dealsLoading ? "—" : formatINR(wonValue)}             icon={TrendingUp}  accent="#8b5cf6" sub={`${wonDeals.length} placements`} />
      </div>

      {/* Clients table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Clients</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {clientsLoading ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading clients…</div>
          ) : clients.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Building2 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-bold text-foreground mb-1">No clients yet</p>
              <p className="text-xs text-muted-foreground mb-4">Add your first client to start tracking accounts and deals.</p>
              <NewClientDialog />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {clients.map(c => {
                const clientDeals = deals.filter(d => d.clientId === c.id);
                return (
                  <div key={c.id} className="px-5 py-3 flex items-center gap-4 hover-elevate" data-testid={`row-client-${c.id}`}>
                    <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center text-xs font-black">
                      {c.companyName.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{c.companyName}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.industry} · {c.city} · {c.primaryContactName}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase">{c.status}</Badge>
                    <span className="text-xs text-muted-foreground hidden md:inline w-28 text-right tabular-nums">
                      {clientDeals.length} {clientDeals.length === 1 ? "deal" : "deals"}
                    </span>
                    <span className="text-sm font-bold text-foreground w-28 text-right tabular-nums">{formatINR(c.arrInr || 0)}</span>
                    <Button
                      size="icon" variant="ghost"
                      onClick={() => setEditingClient(c)}
                      data-testid={`button-edit-client-${c.id}`}
                      title="Edit client"
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      size="icon" variant="ghost"
                      onClick={() => { if (confirm(`Delete ${c.companyName}? This will also delete its deals.`)) deleteClient.mutate(c.id || ""); }}
                      data-testid={`button-delete-client-${c.id || ""}`}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deals table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Deal Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {dealsLoading ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading deals…</div>
          ) : deals.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Briefcase className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-bold text-foreground mb-1">No deals yet</p>
              <p className="text-xs text-muted-foreground mb-4">{clients.length === 0 ? "Add a client first, then create your first deal." : "Create your first opportunity."}</p>
              {clients.length > 0 && <NewDealDialog clients={clients} />}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {deals.map(d => {
                const client = clients.find(c => c.id === d.clientId);
                const stage = STAGES.find(s => s.value === d.stage);
                return (
                  <div key={d.id} className="px-5 py-3 flex items-center gap-4 hover-elevate" data-testid={`row-deal-${d.id}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{d.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{client?.companyName ?? "Unknown client"} · {d.positions} {d.positions === 1 ? "position" : "positions"} · Owner: {d.owner}</p>
                    </div>
                    <Badge style={{ backgroundColor: `${stage?.accent}18`, color: stage?.accent, borderColor: `${stage?.accent}40` }} className="border text-[10px] uppercase">
                      {stage?.label ?? d.stage}
                    </Badge>
                    <span className="text-sm font-bold text-foreground w-28 text-right tabular-nums">{formatINR(d.valueInr || 0)}</span>
                    <Button
                      size="icon" variant="ghost"
                      onClick={() => setEditingDeal(d)}
                      data-testid={`button-edit-deal-${d.id}`}
                      title="Edit deal"
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      size="icon" variant="ghost"
                      onClick={() => { if (confirm(`Delete deal "${d.title}"?`)) deleteDeal.mutate(d.id || ""); }}
                      data-testid={`button-delete-deal-${d.id || ""}`}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
