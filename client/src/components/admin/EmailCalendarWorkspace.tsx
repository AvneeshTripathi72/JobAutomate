import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Mail, CalendarDays, Send, MessageSquare, Video, CheckCircle2, Trash2 } from "lucide-react";
import type { EmailMessage, Meeting } from "@shared/schema";

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

function ComposeEmailDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: { sender: string; subject: string; body: string; unread: boolean }) => {
      const res = await apiRequest("POST", "/api/emails", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emails"] });
      toast({ title: "Email sent" });
      setOpen(false);
      setSender(""); setSubject(""); setBody("");
    },
    onError: () => toast({ title: "Failed to send", variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-sky-500 hover:bg-sky-400 text-white">
          <Mail className="h-4 w-4 mr-1.5" /> Compose Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Compose New Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Recipient / Sender (Mock)</Label>
            <Input placeholder="e.g. candidate@example.com" value={sender} onChange={e => setSender(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Input placeholder="Interview Request" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Body</Label>
            <Textarea placeholder="Type your message..." rows={5} value={body} onChange={e => setBody(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => mutation.mutate({ sender, subject, body, unread: false })} disabled={mutation.isPending || !sender || !subject} className="bg-sky-500 text-white hover:bg-sky-400">
            {mutation.isPending ? "Sending..." : "Send Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewMeetingDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("30");
  const [startTime, setStartTime] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: { title: string; durationMinutes: number; startTime: string }) => {
      const res = await apiRequest("POST", "/api/meetings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meetings"] });
      toast({ title: "Meeting scheduled" });
      setOpen(false);
      setTitle(""); setDuration("30"); setStartTime("");
    },
    onError: () => toast({ title: "Failed to schedule", variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-sky-200 text-sky-600 hover:bg-sky-50">
          <Video className="h-4 w-4 mr-1.5" /> Schedule Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule New Meeting</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Meeting Title</Label>
            <Input placeholder="e.g. Initial Screening - John Doe" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date & Time</Label>
              <Input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Duration (Minutes)</Label>
              <Input type="number" min="15" step="15" value={duration} onChange={e => setDuration(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => mutation.mutate({ title, durationMinutes: Number(duration), startTime: new Date(startTime).toISOString() })} disabled={mutation.isPending || !title || !startTime} className="bg-sky-500 text-white hover:bg-sky-400">
            {mutation.isPending ? "Scheduling..." : "Schedule Meeting"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function EmailCalendarWorkspace() {
  const { toast } = useToast();
  const { data: emails = [], isLoading: emailsLoading } = useQuery<EmailMessage[]>({ queryKey: ["/api/emails"] });
  const { data: meetings = [], isLoading: meetingsLoading } = useQuery<Meeting[]>({ queryKey: ["/api/meetings"] });

  const deleteEmailMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/emails/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/emails"] }); toast({ title: "Email deleted" }); },
  });

  const toggleReadMutation = useMutation({
    mutationFn: async ({ id, unread }: { id: string; unread: boolean }) => apiRequest("PATCH", `/api/emails/${id}`, { unread }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/emails"] }),
  });

  const deleteMeetingMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/meetings/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/meetings"] }); toast({ title: "Meeting canceled" }); },
  });

  const unreadCount = emails.filter(e => e.unread).length;
  
  // Only show today's and future meetings, sort by time
  const activeMeetings = meetings
    .filter(m => new Date(m.startTime).getTime() >= new Date().setHours(0,0,0,0))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  const meetingsToday = activeMeetings.filter(m => new Date(m.startTime).toDateString() === new Date().toDateString()).length;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-3 flex items-start gap-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">Live Inbox & Calendar · Scoped to your account</p>
          <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
            This module operates as a functional internal communication & scheduling system. Real OAuth sync requires API keys.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground leading-tight">Inbox & Calendar</h2>
            <p className="text-xs text-muted-foreground">Manage communications and schedules</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NewMeetingDialog />
          <ComposeEmailDialog />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Unread" value={emailsLoading ? "—" : String(unreadCount)} sub="Messages pending" accent="#0ea5e9" icon={Mail} />
        <StatCard label="Meetings Today" value={meetingsLoading ? "—" : String(meetingsToday)} sub="Scheduled for today" accent="#8b5cf6" icon={CalendarDays} />
        <StatCard label="Total Emails" value={emailsLoading ? "—" : String(emails.length)} sub="In database" accent="#f59e0b" icon={Send} />
        <StatCard label="Total Meetings" value={meetingsLoading ? "—" : String(meetings.length)} sub="All upcoming" accent="#10b981" icon={MessageSquare} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-3 flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Internal Inbox</CardTitle>
            <Badge variant="secondary" className="text-[10px]"><CheckCircle2 className="h-3 w-3 mr-1" /> Connected</Badge>
          </CardHeader>
          <CardContent className="p-0">
            {emailsLoading ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading emails...</div>
            ) : emails.length === 0 ? (
              <div className="px-5 py-12 text-center text-muted-foreground">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Inbox is empty</p>
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                {emails.map((e) => (
                  <div key={e.id} className="px-5 py-3 flex items-start gap-3 hover-elevate group">
                    <div className="mt-1 shrink-0">
                      <Checkbox 
                        checked={!e.unread} 
                        onCheckedChange={(checked) => toggleReadMutation.mutate({ id: e.id, unread: !checked })} 
                        className="rounded-[4px]"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate ${e.unread ? "font-bold text-foreground" : "text-muted-foreground"}`}>{e.sender}</p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {new Date(e.createdAt).toLocaleDateString()} {new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${e.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}>{e.subject}</p>
                      {e.body && <p className="text-xs text-muted-foreground truncate mt-1">{e.body}</p>}
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => { if (confirm("Delete this email?")) deleteEmailMutation.mutate(e.id); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3 flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Upcoming Calendar</CardTitle>
            <Video className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent className="p-0">
            {meetingsLoading ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">Loading...</div>
            ) : activeMeetings.length === 0 ? (
              <div className="px-5 py-12 text-center text-muted-foreground">
                <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No upcoming meetings</p>
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                {activeMeetings.map((m) => {
                  const dateObj = new Date(m.startTime);
                  const isToday = dateObj.toDateString() === new Date().toDateString();
                  return (
                    <div key={m.id} className="px-5 py-3 flex items-start gap-4 hover-elevate group">
                      <div className="w-12 shrink-0 text-center">
                        <p className={`text-sm font-black tabular-nums ${isToday ? "text-sky-500" : "text-muted-foreground"}`}>
                          {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </p>
                        {!isToday && <p className="text-[10px] uppercase text-muted-foreground mt-0.5">{dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{m.title}</p>
                        <p className="text-xs text-muted-foreground">{m.durationMinutes} min</p>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => { if (confirm("Cancel meeting?")) deleteMeetingMutation.mutate(m.id); }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
