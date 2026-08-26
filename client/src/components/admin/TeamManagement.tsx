import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Users, Plus, UserCheck, Trash2, CheckCircle2, XCircle, Pencil,
} from "lucide-react";

type CompanyUser = {
  id: number; username: string; role: string;
  email?: string | null; fullName?: string | null;
  isActive: boolean; createdAt: string;
};

// ─── Invite/Create User Dialog ────────────────────────────────────────────────
function InviteUserDialog({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    fullName: "", username: "", password: "", email: "",
    role: "recruiter" as "company_admin" | "recruiter",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/company/users", {
        ...form, email: form.email || null,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Failed to create user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company/users"] });
      toast({ title: "Team member added", description: `${form.fullName} can now log in.` });
      onClose();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const valid = form.fullName && form.username.length >= 3 && form.password.length >= 8;

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-sky-500" /> Add Team Member
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Full Name *</Label>
            <Input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} data-testid="input-team-fullname" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>Username * (min 3)</Label>
              <Input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} data-testid="input-team-username" />
            </div>
            <div className="space-y-1.5">
              <Label>Password * (min 8)</Label>
              <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} data-testid="input-team-password" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Email (optional)</Label>
            <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} data-testid="input-team-email" />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v: any) => setForm(f => ({ ...f, role: v }))}>
              <SelectTrigger data-testid="select-team-role"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="company_admin">Company Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={!valid || mutation.isPending}
            className="bg-sky-500 hover:bg-sky-400 text-white"
            data-testid="button-confirm-add-member"
          >
            {mutation.isPending ? "Adding…" : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit User Dialog ─────────────────────────────────────────────────────────
function EditUserDialog({ user, onClose }: { user: CompanyUser; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    fullName: user.fullName ?? "",
    email: user.email ?? "",
    role: user.role as "company_admin" | "recruiter",
    isActive: user.isActive,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", `/api/company/users/${user.id}`, form);
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company/users"] });
      toast({ title: "User updated" });
      onClose();
    },
    onError: () => toast({ title: "Failed to update", variant: "destructive" }),
  });

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Edit Team Member</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v: any) => setForm(f => ({ ...f, role: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="company_admin">Company Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ua"
              checked={form.isActive}
              onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
              className="h-4 w-4"
            />
            <Label htmlFor="ua">Active (can log in)</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="bg-sky-500 hover:bg-sky-400 text-white"
          >
            {mutation.isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main TeamManagement Component ────────────────────────────────────────────
export default function TeamManagement({ companyName }: { companyName?: string }) {
  const { toast } = useToast();
  const [showInvite, setShowInvite] = useState(false);
  const [editUser, setEditUser] = useState<CompanyUser | null>(null);

  const { data: members = [], isLoading } = useQuery<CompanyUser[]>({
    queryKey: ["/api/company/users"],
  });

  const deleteUser = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/company/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company/users"] });
      toast({ title: "User removed" });
    },
  });

  const activeCount = members.filter(m => m.isActive).length;

  return (
    <div className="space-y-5">
      {editUser && <EditUserDialog user={editUser} onClose={() => setEditUser(null)} />}
      {showInvite && <InviteUserDialog onClose={() => setShowInvite(false)} />}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black leading-tight">Team Management</h2>
            <p className="text-xs text-muted-foreground">
              {companyName ? `${companyName} · ` : ""}{activeCount} active member{activeCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button onClick={() => setShowInvite(true)} className="bg-sky-500 hover:bg-sky-400 text-white" data-testid="button-invite-user">
          <Plus className="h-4 w-4 mr-1.5" /> Add Member
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Members", value: members.length, accent: "#0ea5e9", icon: Users },
          { label: "Active", value: activeCount, accent: "#10b981", icon: CheckCircle2 },
          { label: "Inactive", value: members.length - activeCount, accent: "#f59e0b", icon: XCircle },
        ].map(s => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{s.label}</p>
                <p className="text-2xl font-black" style={{ color: s.accent }}>{s.value}</p>
              </div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.accent}18` }}>
                <s.icon className="h-4 w-4" style={{ color: s.accent }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Team Members</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading…</div>
          ) : members.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <UserCheck className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-bold mb-1">No team members yet</p>
              <p className="text-xs text-muted-foreground mb-4">Add recruiters to your team so they can access the ATS &amp; CRM.</p>
              <Button onClick={() => setShowInvite(true)} size="sm" className="bg-sky-500 hover:bg-sky-400 text-white">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add First Member
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {members.map(m => (
                <div key={m.id} className="px-5 py-3 flex items-center gap-4" data-testid={`row-member-${m.id}`}>
                  <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center text-xs font-black shrink-0">
                    {(m.fullName ?? m.username)?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{m.fullName ?? m.username}</p>
                    <p className="text-xs text-muted-foreground truncate">@{m.username} · {m.email ?? "no email"}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase shrink-0">
                    {m.role === "company_admin" ? "Admin" : "Recruiter"}
                  </Badge>
                  <Badge variant={m.isActive ? "default" : "secondary"} className="text-[10px] shrink-0">
                    {m.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button size="icon" variant="ghost" onClick={() => setEditUser(m)} data-testid={`button-edit-member-${m.id}`}>
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                  <Button
                    size="icon" variant="ghost"
                    onClick={() => { if (confirm(`Remove ${m.fullName ?? m.username}?`)) deleteUser.mutate(m.id); }}
                    data-testid={`button-delete-member-${m.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
