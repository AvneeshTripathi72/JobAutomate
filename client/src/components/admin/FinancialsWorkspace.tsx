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
  Wallet, Plus, TrendingUp, Receipt, BarChart3, CheckCircle2, Pencil, Trash2, Send,
} from "lucide-react";
import type { Invoice } from "@shared/schema";

const INVOICE_STATUSES = ["Sent", "Viewed", "Overdue", "Paid"];

const formatINR = (v: number) =>
  v >= 10000000 ? `₹${(v / 10000000).toFixed(2)} Cr`
  : v >= 100000 ? `₹${(v / 100000).toFixed(1)} L`
  : `₹${v.toLocaleString("en-IN")}`;

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

type InvoiceForm = {
  invoiceNumber: string;
  clientName: string;
  amountInr: number;
  status: string;
  dueDate: string;
};

const DEFAULT_FORM: InvoiceForm = {
  invoiceNumber: "",
  clientName: "",
  amountInr: 0,
  status: "Sent",
  dueDate: new Date().toISOString().split("T")[0],
};

function InvoiceFormFields({ form, setForm }: { form: InvoiceForm; setForm: (f: InvoiceForm) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="invNum">Invoice Number *</Label>
          <Input id="invNum" value={form.invoiceNumber} onChange={e => setForm({ ...form, invoiceNumber: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="clName">Client Name *</Label>
          <Input id="clName" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="amt">Amount (₹) *</Label>
          <Input id="amt" type="number" min="0" value={form.amountInr} onChange={e => setForm({ ...form, amountInr: Number(e.target.value) || 0 })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="due">Due Date *</Label>
          <Input id="due" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Status *</Label>
        <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {INVOICE_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function NewInvoiceDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<InvoiceForm>(DEFAULT_FORM);

  const mutation = useMutation({
    mutationFn: async (data: InvoiceForm) => {
      const res = await apiRequest("POST", "/api/invoices", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({ title: "Invoice created" });
      setOpen(false);
      setForm(DEFAULT_FORM);
    },
    onError: () => toast({ title: "Could not create", variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-white">
          <Plus className="h-4 w-4 mr-1.5" /> New Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Invoice</DialogTitle>
        </DialogHeader>
        <InvoiceFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.invoiceNumber || !form.clientName || form.amountInr <= 0 || !form.dueDate}
            className="bg-sky-500 hover:bg-sky-400 text-white"
          >
            {mutation.isPending ? "Saving…" : "Save Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditInvoiceDialog({ item, onClose }: { item: Invoice; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState<InvoiceForm>({
    invoiceNumber: item.invoiceNumber,
    clientName: item.clientName,
    amountInr: item.amountInr,
    status: item.status,
    dueDate: new Date(item.dueDate).toISOString().split("T")[0],
  });

  const mutation = useMutation({
    mutationFn: async (data: InvoiceForm) => {
      const res = await apiRequest("PATCH", `/api/invoices/${item.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({ title: "Invoice updated" });
      onClose();
    },
    onError: () => toast({ title: "Could not update", variant: "destructive" }),
  });

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
        </DialogHeader>
        <InvoiceFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.invoiceNumber || !form.clientName || form.amountInr <= 0 || !form.dueDate}
            className="bg-sky-500 hover:bg-sky-400 text-white"
          >
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function FinancialsWorkspace() {
  const { toast } = useToast();
  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({ queryKey: ["/api/invoices"] });
  const [editingItem, setEditingItem] = useState<Invoice | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/invoices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({ title: "Invoice removed" });
    },
  });

  const mtdRevenue = invoices.filter(i => i.status === "Paid").reduce((acc, i) => acc + i.amountInr, 0);
  const outstanding = invoices.filter(i => i.status !== "Paid").reduce((acc, i) => acc + i.amountInr, 0);
  const outstandingCount = invoices.filter(i => i.status !== "Paid").length;

  const statusColor = (s: string) =>
    s === "Paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
    s === "Overdue" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" :
    s === "Viewed" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" :
    "bg-muted text-muted-foreground";

  return (
    <div className="space-y-6">
      {editingItem && <EditInvoiceDialog item={editingItem} onClose={() => setEditingItem(null)} />}

      <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-3 flex items-start gap-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Live Financials · Scoped to your account</p>
          <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
            Records are saved to your live Postgres database and visible only to your account.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground leading-tight">Financials</h2>
            <p className="text-xs text-muted-foreground">Billing, payroll and margins</p>
          </div>
        </div>
        <NewInvoiceDialog />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Collected Revenue" value={isLoading ? "—" : formatINR(mtdRevenue)} sub="Total paid" accent="#10b981" icon={TrendingUp} />
        <StatCard label="Outstanding" value={isLoading ? "—" : formatINR(outstanding)} sub={`Across ${outstandingCount} invoices`} accent="#f59e0b" icon={Receipt} />
        <StatCard label="Payroll Due" value="₹0" sub="Coming soon" accent="#0ea5e9" icon={Wallet} />
        <StatCard label="Gross Margin" value="22.4%" sub="Mocked metric" accent="#8b5cf6" icon={BarChart3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Recent Invoices</CardTitle></CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading invoices…</div>
            ) : invoices.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Receipt className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm font-bold text-foreground mb-1">No invoices yet</p>
                <p className="text-xs text-muted-foreground mb-4">Create your first invoice to start tracking revenue.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {invoices.map((inv) => (
                  <div key={inv.id} className="px-5 py-3 flex items-center gap-4 hover-elevate group">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{inv.invoiceNumber}</p>
                      <p className="text-xs text-muted-foreground">{inv.clientName} · Due {new Date(inv.dueDate).toLocaleDateString()}</p>
                    </div>
                    <Badge className={statusColor(inv.status)}>{inv.status}</Badge>
                    <p className="text-sm font-bold text-foreground w-28 text-right tabular-nums">{formatINR(inv.amountInr)}</p>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" onClick={() => setEditingItem(inv)}>
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete this invoice?")) deleteMutation.mutate(inv.id); }}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
