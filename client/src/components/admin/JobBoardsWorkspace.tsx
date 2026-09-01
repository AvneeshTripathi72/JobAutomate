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
  Globe2, Plus, CheckCircle2, Users, XCircle, Pencil, Trash2, ExternalLink,
} from "lucide-react";
import type { JobBoardPosting } from "@shared/schema";

const BOARDS = ["Indeed", "LinkedIn", "Naukri", "ZipRecruiter", "Monster", "Other"];
const STATUSES = ["Live", "Pending", "Expired", "Rejected"];

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

type BoardForm = {
  jobTitle: string;
  board: string;
  status: string;
  applicantsCount: number;
  externalUrl: string;
};

const DEFAULT_FORM: BoardForm = {
  jobTitle: "",
  board: "Indeed",
  status: "Pending",
  applicantsCount: 0,
  externalUrl: "",
};

function statusColor(status: string) {
  if (status === "Live") return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  if (status === "Rejected") return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
  if (status === "Expired") return "bg-muted text-muted-foreground border-border";
  return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
}

function BoardFormFields({ form, setForm }: { form: BoardForm; setForm: (f: BoardForm) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="jt">Job Title *</Label>
        <Input id="jt" value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Job Board *</Label>
          <Select value={form.board} onValueChange={v => setForm({ ...form, board: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {BOARDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
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
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="ac">Applicants</Label>
          <Input id="ac" type="number" min="0" value={form.applicantsCount} onChange={e => setForm({ ...form, applicantsCount: Number(e.target.value) || 0 })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="url">Posting URL</Label>
          <Input id="url" value={form.externalUrl} onChange={e => setForm({ ...form, externalUrl: e.target.value })} placeholder="https://…" />
        </div>
      </div>
    </div>
  );
}

import { supabase } from "@/lib/supabase";

function NewBoardDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<BoardForm>(DEFAULT_FORM);

  const mutation = useMutation({
    mutationFn: async (data: BoardForm) => {
      const { data: res, error } = await supabase.from('job_board_postings').insert({
        job_title: data.jobTitle,
        board: data.board,
        status: data.status,
        applicants_count: data.applicantsCount,
        external_url: data.externalUrl,
        posted_at: data.status === "Live" ? new Date().toISOString() : null
      });
      if (error) throw error;
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-board-postings"] });
      toast({ title: "Posting added" });
      setOpen(false);
      setForm(DEFAULT_FORM);
    },
    onError: () => toast({ title: "Could not add posting", variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-white">
          <Plus className="h-4 w-4 mr-1.5" /> New Posting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Job Board Posting</DialogTitle>
        </DialogHeader>
        <BoardFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.jobTitle}
            className="bg-sky-500 hover:bg-sky-400 text-white"
          >
            {mutation.isPending ? "Saving…" : "Save Posting"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditBoardDialog({ item, onClose }: { item: JobBoardPosting; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState<BoardForm>({
    jobTitle: item.jobTitle,
    board: item.board,
    status: item.status,
    applicantsCount: item.applicantsCount ?? 0,
    externalUrl: item.externalUrl ?? "",
  });

  const mutation = useMutation({
    mutationFn: async (data: BoardForm) => {
      const { data: res, error } = await supabase.from('job_board_postings').update({
        job_title: data.jobTitle,
        board: data.board,
        status: data.status,
        applicants_count: data.applicantsCount,
        external_url: data.externalUrl,
        posted_at: data.status === "Live" ? (item.postedAt ?? new Date().toISOString()) : item.postedAt,
      }).eq('id', item.id);
      if (error) throw error;
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-board-postings"] });
      toast({ title: "Posting updated" });
      onClose();
    },
    onError: () => toast({ title: "Could not update", variant: "destructive" }),
  });

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Job Board Posting</DialogTitle>
        </DialogHeader>
        <BoardFormFields form={form} setForm={setForm} />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.jobTitle}
            className="bg-sky-500 hover:bg-sky-400 text-white"
          >
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function JobBoardsWorkspace() {
  const { toast } = useToast();
  const { data: postings = [], isLoading } = useQuery<JobBoardPosting[]>({ 
    queryKey: ["/api/job-board-postings"],
    queryFn: async () => {
      const { data, error } = await supabase.from('job_board_postings').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        jobTitle: row.job_title,
        board: row.board,
        status: row.status,
        applicantsCount: row.applicants_count,
        externalUrl: row.external_url,
        postedAt: row.posted_at ? new Date(row.posted_at) : undefined,
      } as JobBoardPosting));
    }
  });
  const [editingItem, setEditingItem] = useState<JobBoardPosting | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('job_board_postings').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-board-postings"] });
      toast({ title: "Posting removed" });
    },
  });

  const liveCount = postings.filter(p => p.status === "Live").length;
  const totalApplicants = postings.reduce((acc, p) => acc + (p.applicantsCount || 0), 0);
  const rejectedCount = postings.filter(p => p.status === "Rejected").length;

  return (
    <div className="space-y-6">
      {editingItem && <EditBoardDialog item={editingItem} onClose={() => setEditingItem(null)} />}

      <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-3 flex items-start gap-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Live Job Board Tracking · Scoped to your account</p>
          <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
            Records are saved to your live Postgres database. This tracks postings and applicant counts across boards — automatic distribution to Indeed / LinkedIn / Naukri requires those boards' publisher APIs to be configured separately.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <Globe2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground leading-tight">Job Boards</h2>
            <p className="text-xs text-muted-foreground">Multi-board distribution</p>
          </div>
        </div>
        <NewBoardDialog />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Live Postings" value={isLoading ? "—" : String(liveCount)} sub="Currently active" accent="#0ea5e9" icon={Globe2} />
        <StatCard label="Total Applicants" value={isLoading ? "—" : String(totalApplicants)} sub="Across all boards" accent="#10b981" icon={Users} />
        <StatCard label="Rejected" value={isLoading ? "—" : String(rejectedCount)} sub="By board" accent="#ef4444" icon={XCircle} />
        <StatCard label="Total Postings" value={isLoading ? "—" : String(postings.length)} sub="All time" accent="#8b5cf6" icon={CheckCircle2} />
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Job Board Postings</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading postings…</div>
          ) : postings.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Globe2 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-bold text-foreground mb-1">No job board postings yet</p>
              <p className="text-xs text-muted-foreground mb-4">Track a job posting on Indeed, LinkedIn, Naukri, or another board.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {postings.map((p) => (
                <div key={p.id} className="px-5 py-4 hover-elevate group flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{p.jobTitle}</p>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      {p.board} · {p.applicantsCount} applicants
                      {p.externalUrl ? (
                        <a href={p.externalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-sky-500 hover:underline">
                          <ExternalLink className="h-3 w-3" /> View
                        </a>
                      ) : null}
                    </p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${statusColor(p.status)}`}>{p.status}</Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => setEditingItem(p)}>
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete this posting?")) deleteMutation.mutate(p.id!); }}>
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
