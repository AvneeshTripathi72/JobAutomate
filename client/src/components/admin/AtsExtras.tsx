import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Interview, Submission, Activity, Client, JobSeeker, Application } from "@shared/schema";
import { supabase } from "@/lib/supabase";
import {
  CalendarClock, Send, Plus, Flame, FlameKindling, Trash2,
  Phone, Video, MapPin, FileText, History, Building2, Mail,
  CheckCircle2, XCircle, AlertCircle, ClipboardEdit,
} from "lucide-react";

const SUBMISSION_STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  client_review: "Client Review",
  interview: "Interview",
  rejected: "Rejected",
  selected: "Selected",
};
const INTERVIEW_STATUS_LABEL: Record<string, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show",
};
const MODE_ICON: Record<string, any> = { phone: Phone, video: Video, onsite: MapPin };

function fmtDateTime(d: Date | string) {
  return new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Activity Timeline ────────────────────────────────────────────────────────
export function ActivityTimeline({ applicationId }: { applicationId: string }) {
  const { data: items = [], isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities", applicationId],
    queryFn: () => fetch(`/api/activities?applicationId=${applicationId}`, { credentials: "include" }).then((r) => r.json()),
  });
  const { toast } = useToast();
  const [note, setNote] = useState("");

  const addNote = useMutation({
    mutationFn: () => apiRequest("POST", "/api/activities", { applicationId, type: "note", description: note }),
    onSuccess: () => {
      setNote("");
      queryClient.invalidateQueries({ queryKey: ["/api/activities", applicationId] });
      toast({ title: "Note added" });
    },
    onError: () => toast({ title: "Failed to add note", variant: "destructive" }),
  });

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a quick note..."
          data-testid="input-activity-note" onKeyDown={(e) => { if (e.key === "Enter" && note.trim()) addNote.mutate(); }} />
        <Button onClick={() => addNote.mutate()} disabled={!note.trim() || addNote.isPending}
          className="bg-[#0ea5e9] hover:bg-[#0ea5e9] text-white border-0" data-testid="button-add-note">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {isLoading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">No activity yet — add a note or update the candidate's stage.</div>
      ) : (
        <ul className="space-y-2.5">
          {items.map((a) => {
            const Icon = a.type === "status_change" ? History : a.type === "interview" ? CalendarClock : a.type === "submission" ? Send : a.type === "hotlist" ? Flame : ClipboardEdit;
            return (
              <li key={a.id} className="flex gap-3 border rounded-lg p-3 bg-muted/10" data-testid={`activity-${a.id}`}>
                <div className="h-7 w-7 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-[#0ea5e9]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">{a.description}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{fmtDateTime(a.createdAt)} · {a.type.replace("_", " ")}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── Interviews List + Schedule Dialog ────────────────────────────────────────
export function InterviewsTab({ applicationId }: { applicationId: string }) {
  const { data: items = [], isLoading } = useQuery<Interview[]>({
    queryKey: ["/api/interviews", applicationId],
    queryFn: () => fetch(`/api/interviews?applicationId=${applicationId}`, { credentials: "include" }).then((r) => r.json()),
  });
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const remove = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/interviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interviews", applicationId] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities", applicationId] });
      toast({ title: "Interview deleted" });
    },
  });

  return (
    <div className="space-y-3">
      <Button onClick={() => setShowDialog(true)} className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9] text-white border-0" data-testid="button-schedule-interview">
        <CalendarClock className="h-4 w-4 mr-2" /> Schedule Interview
      </Button>
      {isLoading ? (
        <div className="space-y-2">{[1, 2].map((i) => <div key={i} className="h-20 bg-muted/30 rounded-lg animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">No interviews scheduled yet.</div>
      ) : (
        <ul className="space-y-2.5">
          {items.map((it) => {
            const ModeIcon = MODE_ICON[it.mode] || Video;
            return (
              <li key={it.id} className="border rounded-lg p-3 bg-muted/10" data-testid={`interview-${it.id}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <ModeIcon className="h-3.5 w-3.5 text-[#0ea5e9]" />
                      <span className="text-sm font-semibold">{it.interviewerName}</span>
                      <Badge variant="secondary" className="text-[10px]">{INTERVIEW_STATUS_LABEL[it.status] ?? it.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{fmtDateTime(it.scheduledAt)} · {it.mode}</p>
                    {it.interviewerEmail && <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Mail className="h-3 w-3" />{it.interviewerEmail}</p>}
                    {it.feedback && <p className="text-xs italic text-muted-foreground mt-1.5 border-l-2 border-muted pl-2">{it.feedback}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <EditInterviewButton interview={it} applicationId={applicationId} />
                    <Button size="icon" variant="ghost" onClick={() => remove.mutate(it.id)} data-testid={`button-delete-interview-${it.id}`}>
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {showDialog && <ScheduleInterviewDialog applicationId={applicationId} onClose={() => setShowDialog(false)} />}
    </div>
  );
}

function ScheduleInterviewDialog({ applicationId, onClose }: { applicationId: string; onClose: () => void }) {
  const { toast } = useToast();
  const [scheduledAt, setScheduledAt] = useState("");
  const [mode, setMode] = useState<"phone" | "video" | "onsite">("video");
  const [interviewerName, setInterviewerName] = useState("");
  const [interviewerEmail, setInterviewerEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  const create = useMutation({
    mutationFn: () => apiRequest("POST", "/api/interviews", {
      applicationId, scheduledAt: new Date(scheduledAt).toISOString(), mode, interviewerName,
      interviewerEmail: interviewerEmail || null, status: "scheduled", feedback: feedback || null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interviews", applicationId] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities", applicationId] });
      toast({ title: "Interview scheduled" });
      onClose();
    },
    onError: () => toast({ title: "Failed to schedule", variant: "destructive" }),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Schedule Interview</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Date & Time</Label>
            <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} data-testid="input-interview-date" />
          </div>
          <div>
            <Label className="text-xs">Mode</Label>
            <Select value={mode} onValueChange={(v: any) => setMode(v)}>
              <SelectTrigger data-testid="select-interview-mode"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="video">Video call</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Interviewer Name</Label>
            <Input value={interviewerName} onChange={(e) => setInterviewerName(e.target.value)} placeholder="e.g. Priya Sharma" data-testid="input-interviewer-name" />
          </div>
          <div>
            <Label className="text-xs">Interviewer Email (optional)</Label>
            <Input type="email" value={interviewerEmail} onChange={(e) => setInterviewerEmail(e.target.value)} data-testid="input-interviewer-email" />
          </div>
          <div>
            <Label className="text-xs">Notes (optional)</Label>
            <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} data-testid="input-interview-notes" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => create.mutate()} disabled={!scheduledAt || !interviewerName || create.isPending}
            className="bg-[#0ea5e9] hover:bg-[#0ea5e9] text-white border-0" data-testid="button-confirm-schedule">
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Interview Dialog (update status + feedback) ─────────────────────────
function EditInterviewButton({ interview, applicationId }: { interview: Interview; applicationId: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(interview.status);
  const [feedback, setFeedback] = useState(interview.feedback ?? "");

  const update = useMutation({
    mutationFn: () => apiRequest("PATCH", `/api/interviews/${interview.id}`, { status, feedback: feedback || null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interviews", applicationId] });
      toast({ title: "Interview updated" });
      setOpen(false);
    },
    onError: () => toast({ title: "Failed to update", variant: "destructive" }),
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors"
        data-testid={`button-edit-interview-${interview.id}`}
        title="Update status / feedback"
      >
        <ClipboardEdit className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {open && (
        <Dialog open onOpenChange={(o) => !o && setOpen(false)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Update Interview</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger data-testid="select-interview-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No-show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Feedback / Notes</Label>
                <Textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  rows={4}
                  placeholder="Add interviewer feedback, observations..."
                  data-testid="input-interview-feedback"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                onClick={() => update.mutate()}
                disabled={update.isPending}
                className="bg-[#0ea5e9] hover:bg-[#0ea5e9] text-white border-0"
                data-testid="button-confirm-interview-update"
              >
                {update.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// ─── Submissions Tab + Add Dialog ─────────────────────────────────────────────
export function SubmissionsTab({ applicationId }: { applicationId: string }) {
  const { data: items = [], isLoading } = useQuery<Submission[]>({
    queryKey: ["/api/submissions", applicationId],
    queryFn: () => fetch(`/api/submissions?applicationId=${applicationId}`, { credentials: "include" }).then((r) => r.json()),
  });
  const { data: clients = [] } = useQuery<Client[]>({ queryKey: ["/api/crm/clients"] });
  const clientMap = new Map(clients.map((c) => [c.id, c]));
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const remove = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/submissions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions", applicationId] });
      toast({ title: "Submission deleted" });
    },
  });

  return (
    <div className="space-y-3">
      <Button onClick={() => setShowDialog(true)} className="w-full bg-[#0ea5e9] hover:bg-[#0ea5e9] text-white border-0"
        disabled={clients.length === 0} data-testid="button-add-submission">
        <Send className="h-4 w-4 mr-2" />
        {clients.length === 0 ? "Add a CRM client first" : "Submit to Client"}
      </Button>
      {isLoading ? (
        <div className="space-y-2">{[1, 2].map((i) => <div key={i} className="h-20 bg-muted/30 rounded-lg animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">No submissions yet.</div>
      ) : (
        <ul className="space-y-2.5">
          {items.map((s) => {
            const client = clientMap.get(s.clientId);
            return (
              <li key={s.id} className="border rounded-lg p-3 bg-muted/10" data-testid={`submission-${s.id}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Building2 className="h-3.5 w-3.5 text-[#0ea5e9]" />
                      <span className="text-sm font-semibold truncate">{client?.companyName ?? "(deleted client)"}</span>
                      <Badge variant="secondary" className="text-[10px]">{SUBMISSION_STATUS_LABEL[s.status] ?? s.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{fmtDateTime(s.submittedAt)}{s.rateOfferedInr ? ` · ₹${s.rateOfferedInr.toLocaleString("en-IN")}` : ""}</p>
                    {s.notes && <p className="text-xs italic text-muted-foreground mt-1.5 border-l-2 border-muted pl-2">{s.notes}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <EditSubmissionButton submission={s} applicationId={applicationId} />
                    <Button size="icon" variant="ghost" onClick={() => remove.mutate(s.id)} data-testid={`button-delete-submission-${s.id}`}>
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {showDialog && <AddSubmissionDialog applicationId={applicationId} clients={clients} onClose={() => setShowDialog(false)} />}
    </div>
  );
}

function AddSubmissionDialog({ applicationId, clients, onClose }: { applicationId: string; clients: Client[]; onClose: () => void }) {
  const { toast } = useToast();
  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState<"submitted" | "client_review" | "interview" | "rejected" | "selected">("submitted");
  const [rate, setRate] = useState("");
  const [notes, setNotes] = useState("");

  const create = useMutation({
    mutationFn: () => apiRequest("POST", "/api/submissions", {
      applicationId, clientId, status,
      rateOfferedInr: rate ? parseInt(rate, 10) : null,
      notes: notes || null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions", applicationId] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities", applicationId] });
      toast({ title: "Candidate submitted" });
      onClose();
    },
    onError: () => toast({ title: "Failed to submit", variant: "destructive" }),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Submit Candidate to Client</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger data-testid="select-submission-client"><SelectValue placeholder="Choose a client..." /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => <SelectItem key={c.id || Math.random().toString()} value={c.id || ""}>{c.companyName} · {c.city}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={(v: any) => setStatus(v)}>
              <SelectTrigger data-testid="select-submission-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="client_review">Client Review</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="selected">Selected</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Rate Offered (INR, optional)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 1200000" data-testid="input-submission-rate" />
          </div>
          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} data-testid="input-submission-notes" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => create.mutate()} disabled={!clientId || create.isPending}
            className="bg-[#0ea5e9] hover:bg-[#0ea5e9] text-white border-0" data-testid="button-confirm-submission">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Submission Dialog ────────────────────────────────────────────────────
function EditSubmissionButton({ submission, applicationId }: { submission: Submission; applicationId: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(submission.status);
  const [notes, setNotes] = useState(submission.notes ?? "");
  const [rate, setRate] = useState(submission.rateOfferedInr?.toString() ?? "");

  const update = useMutation({
    mutationFn: () => apiRequest("PATCH", `/api/submissions/${submission.id}`, {
      status, notes: notes || null,
      rateOfferedInr: rate ? parseInt(rate, 10) : null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions", applicationId] });
      toast({ title: "Submission updated" });
      setOpen(false);
    },
    onError: () => toast({ title: "Failed to update", variant: "destructive" }),
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors"
        data-testid={`button-edit-submission-${submission.id}`}
        title="Update status / notes"
      >
        <ClipboardEdit className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {open && (
        <Dialog open onOpenChange={(o) => !o && setOpen(false)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Update Submission</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger data-testid="select-edit-submission-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="client_review">Client Review</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="selected">Selected</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Rate Offered (INR, optional)</Label>
                <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 1200000" data-testid="input-edit-submission-rate" />
              </div>
              <div>
                <Label className="text-xs">Notes</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Client feedback, next steps..." data-testid="input-edit-submission-notes" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => update.mutate()} disabled={update.isPending}
                className="bg-[#0ea5e9] hover:bg-[#0ea5e9] text-white border-0" data-testid="button-confirm-submission-update">
                {update.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// ─── Hotlist Toggle (small button for candidate panel) ────────────────────────
export function HotlistToggleButton({ jobSeekerId, isHotlisted }: { jobSeekerId: string; isHotlisted: boolean }) {
  const { toast } = useToast();
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesText, setNotesText] = useState("");

  const toggle = useMutation({
    mutationFn: async (payload: { isHotlisted: boolean; hotlistNotes?: string | null }) => {
      const { data, error } = await supabase
        .from("resumes")
        .update({
          is_hotlisted: payload.isHotlisted,
          hotlist_notes: payload.hotlistNotes
        })
        .eq("id", jobSeekerId)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/jobseekers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/hotlist"] });
      toast({ title: payload.isHotlisted ? "Added to hotlist" : "Removed from hotlist" });
      setNotesOpen(false);
    },
    onError: () => toast({ title: "Failed to update hotlist", variant: "destructive" }),
  });

  if (isHotlisted) {
    return (
      <>
        <Button size="sm" variant="default"
          className="bg-orange-500 hover:bg-orange-400 text-white border-0"
          onClick={() => toggle.mutate({ isHotlisted: false, hotlistNotes: null })}
          disabled={toggle.isPending}
          data-testid="button-toggle-hotlist">
          <Flame className="h-3.5 w-3.5 mr-1.5" /> Hotlisted
        </Button>
      </>
    );
  }

  return (
    <>
      <Button size="sm" variant="outline"
        className=""
        onClick={() => setNotesOpen(true)}
        disabled={toggle.isPending}
        data-testid="button-toggle-hotlist">
        <Flame className="h-3.5 w-3.5 mr-1.5" /> Hotlist
      </Button>

      {notesOpen && (
        <Dialog open onOpenChange={(o) => !o && setNotesOpen(false)}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><Flame className="h-4 w-4 text-orange-500" /> Add to Hotlist</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Label className="text-xs">Notes (optional)</Label>
              <Textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                rows={3}
                placeholder="e.g. Strong Java background, available immediately…"
                data-testid="input-hotlist-notes"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNotesOpen(false)}>Cancel</Button>
              <Button
                onClick={() => toggle.mutate({ isHotlisted: true, hotlistNotes: notesText || null })}
                disabled={toggle.isPending}
                className="bg-orange-500 hover:bg-orange-400 text-white border-0"
                data-testid="button-confirm-hotlist">
                {toggle.isPending ? "Saving…" : "Add to Hotlist"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// ─── Hotlist View (full admin tab) ────────────────────────────────────────────
export function HotlistView() {
  const { data: candidates = [], isLoading } = useQuery<JobSeeker[]>({
    queryKey: ["/api/hotlist"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("is_hotlisted", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        currentPosition: row.desired_position,
        experienceLevel: `${row.years_experience} Yrs`,
        createdAt: row.created_at ? new Date(row.created_at) : new Date(),
        isHotlisted: true,
        hotlistNotes: row.hotlist_notes
      } as any));
    }
  });
  const { toast } = useToast();
  const toggle = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("resumes")
        .update({ is_hotlisted: false, hotlist_notes: null })
        .eq("id", id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hotlist"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/jobseekers"] });
      toast({ title: "Removed from hotlist" });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-orange-500/15 flex items-center justify-center">
          <Flame className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Hotlist / Bench Pool</h2>
          <p className="text-sm text-muted-foreground">Candidates marked as ready-to-place for incoming client requirements.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted/30 rounded-lg animate-pulse" />)}</div>
      ) : candidates.length === 0 ? (
        <div className="border rounded-lg p-10 text-center bg-muted/10">
          <FlameKindling className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium">No hotlisted candidates yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Open any registered candidate and tap the Hotlist button to add them here.</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {candidates.map((c) => (
            <li key={c.id || Math.random().toString()} className="border rounded-lg p-4 bg-background hover-elevate" data-testid={`hotlist-${c.id || ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{c.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.currentPosition || "—"}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1 flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</p>
                  {c.experienceLevel && <Badge variant="secondary" className="mt-2 text-[10px]">{c.experienceLevel}</Badge>}
                  {c.hotlistNotes && <p className="text-xs italic text-muted-foreground mt-2 border-l-2 border-orange-500/40 pl-2">{c.hotlistNotes}</p>}
                </div>
                <Button size="icon" variant="ghost" onClick={() => toggle.mutate(c.id || "")} data-testid={`button-remove-hotlist-${c.id || ""}`}>
                  <Flame className="h-4 w-4 text-orange-500" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
