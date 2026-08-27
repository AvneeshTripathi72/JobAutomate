import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Pencil,
  Trash2,
  LogOut,
  Briefcase,
  Mail,
  Phone,
  FileText,
  Search,
  X,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Star,
  LayoutGrid,
  Hash,
  Users,
  ExternalLink,
  Tag,
  Copy,
  Check,
  BookOpen,
  Plus,
  Globe,
  EyeOff,
  Download,
  TrendingUp,
  BarChart2,
  ChevronRight,
  Settings,
  Bell,
  Menu,
  Layers,
  UserCheck,
  Send,
  CalendarClock,
  Sparkles,
  Flame,
  Activity as ActivityIcon,
  Trash2 as Trash2Icon,
  BrainCircuit,
  Target,
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type {
  Job,
  InsertJob,
  Application,
  Article,
  InsertArticle,
  JobSeeker,
} from "@shared/schema";
import { TilconsLogo } from "@/components/TilconsLogo";
import { supabase } from "@/lib/supabase";
import AtsModule, {
  ATS_MODULE_KEYS,
  ATS_MODULE_META,
  type AtsModuleKey,
} from "@/components/admin/AtsModuleMocks";
import CrmWorkspace from "@/components/admin/CrmWorkspace";
import OnboardingWorkspace from "@/components/admin/OnboardingWorkspace";
import FinancialsWorkspace from "@/components/admin/FinancialsWorkspace";
import ESignatureWorkspace from "@/components/admin/ESignatureWorkspace";
import ReportsWorkspace from "@/components/admin/ReportsWorkspace";
import BackgroundChecksWorkspace from "@/components/admin/BackgroundChecksWorkspace";
import EmailCalendarWorkspace from "@/components/admin/EmailCalendarWorkspace";
import AiRecruiterModule from "@/components/admin/AiRecruiterModule";
import OfferLetterGenerator from "@/components/admin/OfferLetterGenerator";
import BulkEmailDialog from "@/components/admin/BulkEmailDialog";
import { ResumeViewerModal, AtsAnalysisModal } from "@/components/admin/ResumeAnalysis";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ActivityTimeline,
  InterviewsTab,
  SubmissionsTab,
  HotlistToggleButton,
  HotlistView,
} from "@/components/admin/AtsExtras";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Building2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import TeamManagement from "@/components/admin/TeamManagement";

type AtsStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "submitted"
  | "interview"
  | "offer"
  | "joined"
  | "rejected"
  | "hired";
type AdminTab =
  | "dashboard"
  | "ats"
  | "jobs"
  | "crm"
  | "articles"
  | "jobseekers"
  | "hotlist"
  | "ai-recruiter"
  | "team"
  | AtsModuleKey;

const PIPELINE: {
  status: AtsStatus;
  label: string;
  accent: string;
  bg: string;
  icon: any;
}[] = [
  {
    status: "new",
    label: "Applied",
    accent: "#3b82f6",
    bg: "#eff6ff",
    icon: Clock,
  },
  {
    status: "reviewing",
    label: "In Review",
    accent: "#f59e0b",
    bg: "#fffbeb",
    icon: Eye,
  },
  {
    status: "shortlisted",
    label: "Shortlisted",
    accent: "#8b5cf6",
    bg: "#f5f3ff",
    icon: Star,
  },
  {
    status: "submitted",
    label: "Submitted",
    accent: "#06b6d4",
    bg: "#ecfeff",
    icon: Send,
  },
  {
    status: "interview",
    label: "Interview",
    accent: "#a855f7",
    bg: "#faf5ff",
    icon: CalendarClock,
  },
  {
    status: "offer",
    label: "Offer",
    accent: "#f97316",
    bg: "#fff7ed",
    icon: Sparkles,
  },
  {
    status: "joined",
    label: "Joined",
    accent: "#10b981",
    bg: "#ecfdf5",
    icon: CheckCircle2,
  },
  {
    status: "rejected",
    label: "Not Selected",
    accent: "#ef4444",
    bg: "#fef2f2",
    icon: XCircle,
  },
];

type NavItem = { tab: AdminTab; label: string; icon: any; muted?: boolean };
type Workspace = "admin" | "ats" | "crm";

// ADMIN_NAV_ITEMS is built dynamically (see getAdminNavItems below)
const ADMIN_NAV_BASE: NavItem[] = [
  { tab: "dashboard", label: "Dashboard", icon: BarChart2 },
  { tab: "jobseekers", label: "Registered Candidates", icon: UserCheck },
  { tab: "articles", label: "Career Articles", icon: BookOpen },
];
const ADMIN_NAV_TEAM: NavItem = { tab: "team", label: "My Team", icon: Users };

function getAdminNavItems(role?: string): NavItem[] {
  if (role === "company_admin" || role === "super_admin") {
    return [...ADMIN_NAV_BASE, ADMIN_NAV_TEAM];
  }
  return ADMIN_NAV_BASE;
}

// Roadmap-preview ATS modules (still mocked) — onboarding, financials, etc.
const ATS_ROADMAP_NAV_ITEMS: NavItem[] = ATS_MODULE_KEYS.map((k) => ({
  tab: k as AdminTab,
  label: ATS_MODULE_META[k].label,
  icon: ATS_MODULE_META[k].icon,
  muted: ["vms-sync", "job-boards"].includes(k),
}));

const ATS_NAV_ITEMS: NavItem[] = [
  { tab: "ats", label: "Hiring Pipeline", icon: LayoutGrid },
  { tab: "ai-recruiter", label: "AI Recruiter", icon: BrainCircuit },
  { tab: "jobs", label: "Job Postings", icon: Briefcase },
  { tab: "hotlist", label: "Hotlist / Bench", icon: Flame },
  ...ATS_ROADMAP_NAV_ITEMS,
];

const CRM_NAV_ITEMS: NavItem[] = [
  { tab: "crm", label: "Clients & Deals", icon: Building2 },
];

// WORKSPACE_META items are injected per-role inside the Admin component
// (use getWorkspaceMeta(role) below instead of accessing this directly)
const _WORKSPACE_META_ATS_CRM = {
  ats: { label: "ATS", defaultTab: "ats" as AdminTab, items: ATS_NAV_ITEMS },
  crm: { label: "CRM", defaultTab: "crm" as AdminTab, items: CRM_NAV_ITEMS },
};

function getWorkspaceMeta(
  role?: string,
): Record<
  Workspace,
  { label: string; defaultTab: AdminTab; items: NavItem[] }
> {
  return {
    admin: {
      label: "Admin",
      defaultTab: "dashboard",
      items: getAdminNavItems(role),
    },
    ..._WORKSPACE_META_ATS_CRM,
  };
}

function workspaceForTab(tab: AdminTab): Workspace {
  if (CRM_NAV_ITEMS.some((n) => n.tab === tab)) return "crm";
  if (ATS_NAV_ITEMS.some((n) => n.tab === tab)) return "ats";
  return "admin";
}

// ALL_NAV_ITEMS (max set for page-title lookup — role filtered in sidebar)
const ALL_NAV_ITEMS: NavItem[] = [
  ...ADMIN_NAV_BASE,
  ADMIN_NAV_TEAM,
  ...ATS_NAV_ITEMS,
  ...CRM_NAV_ITEMS,
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
function getAvatarColor(name: string) {
  const colors = [
    "bg-blue-500",
    "bg-violet-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  return colors[name.charCodeAt(0) % colors.length];
}
function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  sub,
}: {
  label: string;
  value: number | string;
  icon: any;
  accent: string;
  sub?: string;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              {label}
            </p>
            <p className="text-3xl font-black text-foreground leading-none">
              {value}
            </p>
            {sub && (
              <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>
            )}
          </div>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accent}18` }}
          >
            <Icon className="h-5 w-5" style={{ color: accent }} />
          </div>
        </div>
        <div className="mt-3 h-1 rounded-full bg-muted/50">
          <div
            className="h-full rounded-full"
            style={{ width: "60%", backgroundColor: accent }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Candidate Detail Panel ───────────────────────────────────────────────────
function CandidateDetailPanel({
  app,
  job,
  jobSeeker,
  onClose,
  onUpdate,
  isPending,
}: {
  app: Application;
  job: Job | undefined;
  jobSeeker: JobSeeker | undefined;
  onClose: () => void;
  onUpdate: (id: string, status: string, notes?: string) => void;
  isPending: boolean;
}) {
  const [notes, setNotes] = useState(app.notes ?? "");
  const [selectedStatus, setSelectedStatus] = useState(app.status as AtsStatus);
  const currentStage = PIPELINE.find((p) => p.status === app.status);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-lg bg-background flex flex-col shadow-2xl border-l overflow-y-auto">
        <div
          className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-background z-10"
          style={{ borderTopColor: currentStage?.accent, borderTopWidth: 3 }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getAvatarColor(app.applicantName)}`}
            >
              {getInitials(app.applicantName)}
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {app.applicantName}
              </h2>
              <p className="text-xs text-muted-foreground">{app.jobTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {jobSeeker && (
              <HotlistToggleButton
                jobSeekerId={jobSeeker.id || ""}
                isHotlisted={jobSeeker.isHotlisted ?? false}
              />
            )}
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5 flex-1">
          {/* IDs */}
          <div className="flex flex-wrap gap-2">
            {[
              ["App", app.id],
              ["Job", app.jobId],
            ].map(([label, val]) => (
              <div
                key={label}
                className="flex items-center gap-1.5 bg-muted/60 border rounded-md px-2.5 py-1.5"
              >
                <Hash className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground font-medium">
                  {label}:
                </span>
                <code className="text-xs font-mono font-semibold">
                  {shortId(val || "")}
                </code>
              </div>
            ))}
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Email
              </p>
              <a
                href={`mailto:${app.email}`}
                className="flex items-center gap-1.5 text-sm hover:text-[#0ea5e9] transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {app.email}
              </a>
            </div>
            {app.phone && (
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Phone
                </p>
                <a
                  href={`tel:${app.phone}`}
                  className="flex items-center gap-1.5 text-sm hover:text-[#0ea5e9] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {app.phone}
                </a>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Applied
              </p>
              <p className="flex items-center gap-1.5 text-sm">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {app.appliedDate ? formatDate(app.appliedDate) : ""}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Stage
              </p>
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: `${currentStage?.accent}20`,
                  color: currentStage?.accent,
                }}
              >
                {currentStage?.label}
              </span>
            </div>
          </div>

          {/* Job pill */}
          {job && (
            <div className="border rounded-lg p-3 bg-muted/20">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5" /> Job Details
              </p>
              <p className="text-sm font-semibold">{job.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {job.company} · {job.location} · {job.jobType}
              </p>
              {job.salary && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {job.salary}
                </p>
              )}
            </div>
          )}

          {/* Resume download */}
          {app.resumeUrl && (
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Resume / CV
              </p>
              {app.resumeUrl.startsWith("https://") ? (
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm font-medium hover:bg-[#0ea5e9]/10 hover:border-[#0ea5e9]/50 hover:text-[#0ea5e9] transition-all"
                  data-testid="link-resume-download"
                >
                  <FileText className="h-4 w-4" />
                  View Resume
                </a>
              ) : (
                <a
                  href={`data:application/octet-stream;base64,${app.resumeUrl}`}
                  download={`${app.applicantName.replace(/\s+/g, "_")}_resume`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/30 text-sm font-medium hover:bg-[#0ea5e9]/10 hover:border-[#0ea5e9]/50 hover:text-[#0ea5e9] transition-all"
                  data-testid="link-resume-download"
                >
                  <FileText className="h-4 w-4" />
                  Download Resume
                </a>
              )}
            </div>
          )}

          {app.coverLetter && (
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Cover Letter
              </p>
              <div className="bg-muted/40 rounded-lg p-4 text-sm leading-relaxed">
                {app.coverLetter}
              </div>
            </div>
          )}

          {/* Tabs: Pipeline / Activity / Interviews / Submissions */}
          <Tabs defaultValue="pipeline" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pipeline" data-testid="tab-pipeline">
                Pipeline
              </TabsTrigger>
              <TabsTrigger value="activity" data-testid="tab-activity">
                Activity
              </TabsTrigger>
              <TabsTrigger value="interviews" data-testid="tab-interviews">
                Interviews
              </TabsTrigger>
              <TabsTrigger value="submissions" data-testid="tab-submissions">
                Submit
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pipeline" className="space-y-5 pt-4">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Move to Stage
                </p>
                <div className="flex flex-col gap-2">
                  {PIPELINE.map((stage) => {
                    const Icon = stage.icon;
                    const isSelected = selectedStatus === stage.status;
                    return (
                      <button
                        key={stage.status}
                        onClick={() => setSelectedStatus(stage.status)}
                        data-testid={`button-stage-${stage.status}`}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-all text-left ${
                          isSelected
                            ? "border-transparent text-white"
                            : "border-border bg-transparent hover:bg-muted/40"
                        }`}
                        style={
                          isSelected ? { backgroundColor: stage.accent } : {}
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{stage.label}</span>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Internal Notes
                </p>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add recruiter notes, interview feedback, next steps..."
                  rows={4}
                  data-testid={`input-notes-${app.id}`}
                />
              </div>

              {selectedStatus === "hired" && job && (
                <div className="pt-2">
                  <OfferLetterGenerator
                    candidateName={app.applicantName}
                    jobTitle={job.title}
                    companyName={job.company}
                    applicationId={app.id || ""}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="pt-4">
              <ActivityTimeline applicationId={app.id || ""} />
            </TabsContent>

            <TabsContent value="interviews" className="pt-4">
              <InterviewsTab applicationId={app.id || ""} />
            </TabsContent>

            <TabsContent value="submissions" className="pt-4">
              <SubmissionsTab applicationId={app.id || ""} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="px-6 py-4 border-t bg-muted/20 flex gap-3 sticky bottom-0">
          <Button
            className="flex-1 bg-[#0ea5e9] hover:bg-[#0ea5e9] text-white border-0"
            disabled={isPending}
            onClick={() => onUpdate(app.id || "", selectedStatus, notes)}
            data-testid="button-save-candidate"
          >
            Save Changes
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Kanban Card ──────────────────────────────────────────────────────────────
function KanbanCard({
  app,
  onClick,
}: {
  app: Application;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      data-testid={`card-candidate-${app.id}`}
      className="bg-background border rounded-lg p-3 cursor-pointer hover-elevate select-none"
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 ${getAvatarColor(app.applicantName)}`}
        >
          {getInitials(app.applicantName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate leading-tight">
            {app.applicantName}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {app.jobTitle}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
              <Hash className="h-2.5 w-2.5" />
              {shortId(app.jobId || "")}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="h-2.5 w-2.5" />
              {app.appliedDate ? formatDate(app.appliedDate) : ""}
            </span>
          </div>
        </div>
      </div>
      {app.notes && (
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs text-muted-foreground italic truncate">
            {app.notes}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── ATS View ─────────────────────────────────────────────────────────────────
function ATSView({
  filterJobId,
  setFilterJobId,
}: {
  filterJobId: string;
  setFilterJobId: (id: string) => void;
}) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("applied_date", { ascending: false });
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        companyId: row.company_id,
        jobId: row.job_id,
        jobTitle: row.job_title || "General Application",
        applicantName: row.applicant_name,
        email: row.email,
        phone: row.phone,
        resumeUrl: row.resume_url,
        coverLetter: row.cover_letter,
        status: row.status || "new",
        notes: row.notes,
        appliedDate: row.applied_date ? new Date(row.applied_date) : undefined,
      } as Application));
    }
  });

  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("posted_date", { ascending: false });
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        companyId: row.company_id,
        title: row.title,
        company: row.company_id,
        location: row.location,
        jobType: row.job_type,
        industry: row.industry,
        description: row.description,
        salary: row.salary,
        postedDate: row.posted_date ? new Date(row.posted_date) : undefined,
      } as Job));
    }
  });

  const { data: jobSeekers = [] } = useQuery<JobSeeker[]>({
    queryKey: ["/api/admin/jobseekers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
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
        isHotlisted: row.is_hotlisted ?? false,
        isShortlisted: row.is_shortlisted ?? false,
        additionalInfo: row.additional_info || "",
        resumeUrl: row.resume_url || null,
        status: row.status || "new"
      } as any));
    }
  });

  const jobMap = new Map(jobs.map((j) => [j.id, j]));
  const seekerMap = new Map(jobSeekers.map((s) => [s.id, s]));

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("applications")
        .update({ status, notes })
        .eq("id", id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({ title: "Candidate updated" });
      setSelectedApp((prev) =>
        prev && prev.id === vars.id
          ? { ...prev, status: vars.status, notes: vars.notes ?? prev.notes }
          : prev,
      );
    },
    onError: (error: Error) => toast({ title: error.message || "Failed to update", variant: "destructive" }),
  });

  const filtered = applications.filter((app) => {
    const matchesSearch =
      !search ||
      app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      (app.jobTitle || "").toLowerCase().includes(search.toLowerCase());
    const matchesJob = filterJobId === "all" || app.jobId === filterJobId;
    return matchesSearch && matchesJob;
  });

  const selectedJobName =
    filterJobId !== "all" ? jobMap.get(filterJobId)?.title : undefined;

  return (
    <div className="flex flex-col h-full">
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-9"
            placeholder="Search candidates, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-ats-search"
          />
        </div>
        <Select value={filterJobId} onValueChange={setFilterJobId}>
          <SelectTrigger
            className="w-full sm:w-64"
            data-testid="select-filter-job"
          >
            <SelectValue placeholder="All Positions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              All Positions ({applications.length})
            </SelectItem>
            {jobs.map((job) => (
              <SelectItem key={job.id || Math.random().toString()} value={job.id || ""}>
                {job.title} (
                {applications.filter((a) => a.jobId === job.id).length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedJobName && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-[#0ea5e9]/5 border border-[#0ea5e9]/20 rounded-lg">
          <Briefcase className="h-4 w-4 text-[#0ea5e9] shrink-0" />
          <span className="text-sm font-medium">
            Filtered: <strong>{selectedJobName}</strong>
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto h-6 text-xs"
            onClick={() => setFilterJobId("all")}
          >
            <X className="h-3 w-3 mr-1" /> Clear
          </Button>
        </div>
      )}

      {/* Pipeline summary */}
      <div className="flex flex-wrap gap-2 mb-5">
        {PIPELINE.map((stage) => {
          const Icon = stage.icon;
          const count = filtered.filter(
            (a) => a.status === stage.status,
          ).length;
          return (
            <div
              key={stage.status}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
              style={{
                borderColor: `${stage.accent}40`,
                backgroundColor: `${stage.accent}0d`,
                color: stage.accent,
              }}
            >
              <Icon className="h-3 w-3" />
              <span>{stage.label}</span>
              <span className="font-black ml-0.5">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Kanban board */}
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE.map((stage) => (
            <div key={stage.status} className="flex-shrink-0 w-72">
              <div className="h-10 bg-muted/40 rounded-lg animate-pulse mb-3" />
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-muted/30 rounded-lg animate-pulse mb-2"
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-6 flex-1">
          {PIPELINE.map((stage) => {
            const Icon = stage.icon;
            const colApps = filtered.filter((a) => a.status === stage.status);
            return (
              <div
                key={stage.status}
                className="flex-shrink-0 w-72 flex flex-col"
              >
                <div
                  className="flex items-center justify-between px-3 py-2.5 rounded-t-lg border border-b-0"
                  style={{
                    borderTopColor: stage.accent,
                    borderTopWidth: 3,
                    backgroundColor: stage.bg,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: stage.accent }} />
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#0d2137" }}
                    >
                      {stage.label}
                    </span>
                  </div>
                  <span
                    className="text-xs font-black px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: stage.accent }}
                  >
                    {colApps.length}
                  </span>
                </div>
                <div className="flex-1 min-h-48 border border-t-0 rounded-b-lg p-2 space-y-2 bg-muted/10">
                  {colApps.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground text-xs">
                      No candidates
                    </div>
                  ) : (
                    colApps.map((app) => (
                      <KanbanCard
                        key={app.id}
                        app={app}
                        onClick={() => setSelectedApp(app)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedApp && (
        <CandidateDetailPanel
          app={selectedApp}
          job={jobMap.get(selectedApp.jobId)}
          jobSeeker={
            selectedApp.jobSeekerId
              ? seekerMap.get(selectedApp.jobSeekerId)
              : undefined
          }
          onClose={() => setSelectedApp(null)}
          isPending={updateMutation.isPending}
          onUpdate={(id, status, notes) =>
            updateMutation.mutate({ id, status, notes })
          }
        />
      )}
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({
  job,
  appCount,
  onEdit,
  onDelete,
  onViewApps,
  isDeleting,
}: {
  job: Job;
  appCount: number;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onViewApps: (id: string) => void;
  isDeleting: boolean;
}) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const copyJobId = () => {
    navigator.clipboard.writeText(job.id || "").then(() => {
      setCopied(true);
      toast({ title: "Job ID copied" });
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <Card
      className="hover-elevate border-l-4"
      style={{ borderLeftColor: "#0ea5e9" }}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="font-bold text-foreground">{job.title}</h3>
              <span className="text-xs bg-[#0ea5e9]/10 text-[#0ea5e9] font-semibold px-2 py-0.5 rounded-full">
                {job.industry}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {job.company} · {job.location} · {job.jobType}
            </p>
            {job.salary && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {job.salary}
              </p>
            )}
            <button
              onClick={copyJobId}
              data-testid={`button-copy-jobid-${job.id || ""}`}
              className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded border border-dashed border-muted-foreground/30 bg-muted/30 hover:bg-muted/60 transition-colors text-xs"
            >
              <Hash className="h-3 w-3 text-muted-foreground" />
              <code className="font-mono font-semibold">{shortId(job.id || "")}</code>
              {copied ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3 text-muted-foreground" />
              )}
            </button>
          </div>
          <div className="flex flex-col gap-2 items-end shrink-0">
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(job)}
                data-testid={`button-edit-${job.id || ""}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(job.id || "")}
                disabled={isDeleting}
                data-testid={`button-delete-${job.id || ""}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewApps(job.id || "")}
              data-testid={`button-view-apps-${job.id || ""}`}
              className="text-xs gap-1.5"
            >
              <Users className="h-3 w-3" />
              {appCount} {appCount === 1 ? "Applicant" : "Applicants"}
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────
export default function Admin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute<{ section?: string }>("/admin/:section");
  const { user, logoutMutation } = useAuth();
  const workspaceLabel = "Tilcons Workspace";

  // URL-driven active tab — /admin, /admin/ats, /admin/crm, /admin/jobs, etc.
  const validTabs: AdminTab[] = [
    "dashboard",
    "ats",
    "jobs",
    "crm",
    "articles",
    "jobseekers",
    "hotlist",
    "ai-recruiter",
    "team",
    ...ATS_MODULE_KEYS,
  ];
  const sectionParam = params?.section as AdminTab | undefined;
  // Backwards compat: ?view=ats / ?view=crm still works for the initial mount.
  const legacyView =
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get(
          "view",
        ) as AdminTab | null)
      : null;
  const activeTab: AdminTab =
    (sectionParam && validTabs.includes(sectionParam) ? sectionParam : null) ??
    (legacyView && validTabs.includes(legacyView) ? legacyView : null) ??
    "dashboard";
  const setActiveTab = (tab: AdminTab) => {
    setLocation(tab === "dashboard" ? "/admin" : `/admin/${tab}`);
  };
  const [filterJobId, setFilterJobId] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [seekerSearch, setSeekerSearch] = useState("");
  const [selectedJobSeekers, setSelectedJobSeekers] = useState<string[]>([]);
  const [isBulkEmailOpen, setIsBulkEmailOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("tilcons_read_notifications");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  const markAsRead = (id: string) => {
    setReadNotifications(prev => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem("tilcons_read_notifications", JSON.stringify([...next]));
      return next;
    });
  };

  const markAllAsRead = (ids: string[]) => {
    setReadNotifications(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      localStorage.setItem("tilcons_read_notifications", JSON.stringify([...next]));
      return next;
    });
  };
  const [activeSeeker, setActiveSeeker] = useState<JobSeeker | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [showAts, setShowAts] = useState(false);
  const [noteSeeker, setNoteSeeker] = useState<JobSeeker | null>(null);
  const [noteText, setNoteText] = useState("");

  // Job form
  const [isEditing, setIsEditing] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<InsertJob>({
    title: "",
    company: "",
    location: "",
    jobType: "Full-time",
    industry: "Technology",
    description: "",
    salary: "",
  });

  // Article form
  const defaultArticleForm: InsertArticle = {
    title: "",
    category: "Career Advice",
    excerpt: "",
    content: "",
    author: "Tilcons Team",
    readTime: "3 min read",
    published: true,
  };
  const [articleForm, setArticleForm] =
    useState<InsertArticle>(defaultArticleForm);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isArticleEditing, setIsArticleEditing] = useState(false);

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, companies(name)")
        .order("posted_date", { ascending: false });
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        companyId: row.company_id,
        title: row.title,
        company: (row.companies as any)?.name || "Default Company",
        location: row.location,
        jobType: row.job_type,
        industry: row.industry,
        description: row.description,
        salary: row.salary,
        postedDate: row.posted_date ? new Date(row.posted_date) : undefined,
      } as Job));
    }
  });

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("applied_date", { ascending: false });
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        companyId: row.company_id,
        jobId: row.job_id,
        jobTitle: row.job_title || "General Application",
        applicantName: row.applicant_name,
        email: row.email,
        phone: row.phone,
        resumeUrl: row.resume_url,
        coverLetter: row.cover_letter,
        status: row.status || "new",
        notes: row.notes,
        appliedDate: row.applied_date ? new Date(row.applied_date) : undefined,
      } as Application));
    }
  });

  const { data: articles = [], isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/admin/articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        title: row.title,
        category: row.category,
        excerpt: row.excerpt,
        content: row.content,
        author: row.author,
        readTime: row.read_time,
        published: row.published,
      } as Article));
    }
  });

  const { data: jobSeekers = [], isLoading: jobSeekersLoading } = useQuery<JobSeeker[]>({
    queryKey: ["/api/admin/jobseekers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
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
        isHotlisted: row.is_hotlisted ?? false,
        isShortlisted: row.is_shortlisted ?? false,
        additionalInfo: row.additional_info || "",
        resumeUrl: row.resume_url || null,
        status: row.status || "new"
      } as any));
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate(undefined, { onSuccess: () => setLocation("/auth") });
  };

  const createMutation = useMutation({
    mutationFn: async (data: InsertJob) => {
      // 1. Find or create company
      let { data: companyData } = await supabase
        .from("companies")
        .select("id")
        .eq("name", data.company)
        .maybeSingle();
      
      let companyId;
      if (companyData) {
        companyId = companyData.id;
      } else {
        const { data: newComp, error: insertCompErr } = await supabase
          .from("companies")
          .insert([{ name: data.company }])
          .select()
          .single();
        if (insertCompErr) throw insertCompErr;
        companyId = newComp.id;
      }

      // 2. Insert Job
      const { data: jobData, error: jobErr } = await supabase
        .from("jobs")
        .insert([{
          company_id: companyId,
          title: data.title,
          location: data.location,
          job_type: data.jobType,
          industry: data.industry,
          description: data.description,
          salary: data.salary || null
        }])
        .select();
      if (jobErr) throw jobErr;
      return jobData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({ title: "Job created" });
      resetForm();
    },
    onError: (error: Error) =>
      toast({ title: error.message || "Failed to create job", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertJob }) => {
      // 1. Find or create company
      let { data: companyData } = await supabase
        .from("companies")
        .select("id")
        .eq("name", data.company)
        .maybeSingle();
      
      let companyId;
      if (companyData) {
        companyId = companyData.id;
      } else {
        const { data: newComp, error: insertCompErr } = await supabase
          .from("companies")
          .insert([{ name: data.company }])
          .select()
          .single();
        if (insertCompErr) throw insertCompErr;
        companyId = newComp.id;
      }

      // 2. Update Job
      const { data: jobData, error: jobErr } = await supabase
        .from("jobs")
        .update({
          company_id: companyId,
          title: data.title,
          location: data.location,
          job_type: data.jobType,
          industry: data.industry,
          description: data.description,
          salary: data.salary || null
        })
        .eq("id", id)
        .select();
      if (jobErr) throw jobErr;
      return jobData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({ title: "Job updated" });
      resetForm();
    },
    onError: (error: Error) =>
      toast({ title: error.message || "Failed to update job", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({ title: "Job deleted" });
    },
    onError: (error: Error) =>
      toast({ title: error.message || "Failed to delete job", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      jobType: "Full-time",
      industry: "Technology",
      description: "",
      salary: "",
    });
    setIsEditing(false);
    setEditingJob(null);
  };

  const createArticleMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      const { data: articleData, error } = await supabase
        .from("articles")
        .insert([{
          title: data.title,
          category: data.category,
          excerpt: data.excerpt,
          content: data.content,
          author: data.author || "Tilcons Team",
          read_time: data.readTime || "3 min read",
          published: data.published ?? true
        }])
        .select();
      if (error) throw error;
      return articleData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      toast({ title: "Article created" });
      resetArticleForm();
    },
    onError: (error: Error) =>
      toast({ title: error.message || "Failed to create article", variant: "destructive" }),
  });

  const updateArticleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertArticle }) => {
      const { data: articleData, error } = await supabase
        .from("articles")
        .update({
          title: data.title,
          category: data.category,
          excerpt: data.excerpt,
          content: data.content,
          author: data.author || "Tilcons Team",
          read_time: data.readTime || "3 min read",
          published: data.published ?? true
        })
        .eq("id", id)
        .select();
      if (error) throw error;
      return articleData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      toast({ title: "Article updated" });
      resetArticleForm();
    },
    onError: (error: Error) =>
      toast({ title: error.message || "Failed to update article", variant: "destructive" }),
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      toast({ title: "Article deleted" });
    },
    onError: (error: Error) =>
      toast({ title: error.message || "Failed to delete article", variant: "destructive" }),
  });

  const resetArticleForm = () => {
    setArticleForm(defaultArticleForm);
    setEditingArticle(null);
    setIsArticleEditing(false);
  };
  const handleEditArticle = (article: Article) => {
    setArticleForm({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
      readTime: article.readTime,
      published: article.published,
    });
    setEditingArticle(article);
    setIsArticleEditing(true);
  };
  const handleSubmitArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (isArticleEditing && editingArticle)
      updateArticleMutation.mutate({
        id: editingArticle.id || "",
        data: articleForm,
      });
    else createArticleMutation.mutate(articleForm);
  };
  const handleDeleteArticle = (id: string) => {
    if (window.confirm("Delete this article?"))
      deleteArticleMutation.mutate(id);
  };

  const handleEdit = (job: Job) => {
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      jobType: job.jobType,
      industry: job.industry,
      description: job.description,
      salary: job.salary || "",
    });
    setEditingJob(job);
    setIsEditing(true);
    setActiveTab("jobs");
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingJob)
      updateMutation.mutate({ id: editingJob.id || "", data: formData });
    else createMutation.mutate(formData);
  };
  const handleDelete = (id: string) => {
    if (window.confirm("Delete this job?")) deleteMutation.mutate(id);
  };
  const viewJobApplications = (jobId: string) => {
    setFilterJobId(jobId);
    setActiveTab("ats");
  };

  // Derived stats
  const totalApps = applications.length;
  const hiredCount = applications.filter((a) => a.status === "hired").length;
  const newCount = applications.filter((a) => a.status === "new").length;
  const shortlistedCount = applications.filter(
    (a) => a.status === "shortlisted",
  ).length;
  const submittedCount = applications.filter(
    (a) => a.status === "submitted",
  ).length;

  // KPIs
  const timeToFillDays =
    hiredCount > 0
      ? applications
          .filter((a) => a.status === "hired")
          .reduce((acc, a) => {
            const days =
              (new Date().getTime() - new Date(a.appliedDate || new Date()).getTime()) /
              (1000 * 3600 * 24);
            return acc + days;
          }, 0) / hiredCount
      : 0;

  const sourceData = [
    "LinkedIn",
    "Naukri",
    "Indeed",
    "Direct",
    "Referral",
    "Other",
  ]
    .map((source) => ({
      name: source,
      count: applications.filter(
        (a) => a.source === source || (source === "Other" && !a.source),
      ).length,
    }))
    .sort((a, b) => b.count - a.count);

  const currentWorkspace: Workspace = workspaceForTab(activeTab);
  const workspaceMeta = getWorkspaceMeta(user?.role);

  // Sidebar component
  const Sidebar = () => (
    <aside className="w-60 bg-[#0d2137] flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="bg-white rounded-md px-3 py-2 inline-block">
          <TilconsLogo className="h-7" />
        </div>
        <p
          className="text-white/40 text-[10px] uppercase tracking-widest mt-3 font-semibold"
          data-testid="text-workspace-label"
        >
          Admin Workspace
        </p>
      </div>

      {/* Workspace switcher */}
      <div className="px-3 pt-4 pb-2">
        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-2 pb-2">
          Workspace
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {(["admin", "ats", "crm"] as Workspace[]).map((ws) => {
            const isActive = currentWorkspace === ws;
            return (
              <button
                key={ws}
                onClick={() => {
                  setActiveTab(workspaceMeta[ws].defaultTab);
                  setSidebarOpen(false);
                }}
                data-testid={`workspace-${ws}`}
                className={`px-2 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${
                  isActive
                    ? "bg-[#0ea5e9] text-white"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {workspaceMeta[ws].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav (current workspace items only) */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {workspaceMeta[currentWorkspace].items.map(
          ({ tab, label, icon: Icon, muted }) => {
            const isActive = activeTab === tab;
            const badge =
              tab === "ats"
                ? totalApps
                : tab === "jobs"
                  ? jobs.length
                  : tab === "articles"
                    ? articles.length
                    : tab === "jobseekers"
                      ? jobSeekers.length
                      : null;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSidebarOpen(false);
                }}
                data-testid={`nav-${tab}`}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  isActive
                    ? "bg-[#0ea5e9] text-white"
                    : muted
                      ? "text-white/40 hover:text-white hover:bg-white/8"
                      : "text-white/70 hover:text-white hover:bg-white/8"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {badge !== null && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-white/10 text-white/60"}`}
                  >
                    {badge}
                  </span>
                )}
                {muted && !isActive && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                    Soon
                  </span>
                )}
              </button>
            );
          },
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.email?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {user?.email?.split('@')[0] ?? "Admin"}
            </p>
            <p className="text-white/40 text-xs truncate">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          data-testid="button-logout"
          className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 text-sm transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );

  const pageTitle =
    ALL_NAV_ITEMS.find((n) => n.tab === activeTab)?.label ?? "Dashboard";
  const isAtsModule = (ATS_MODULE_KEYS as string[]).includes(
    activeTab as string,
  );

  return (
    <div className="h-screen flex overflow-hidden bg-muted/20">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="flex">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-background border-b px-6 py-3 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1
                className="text-base font-bold text-foreground leading-tight"
                data-testid="text-page-title"
              >
                {pageTitle}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {workspaceLabel} ·{" "}
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
          {/* Live notifications list compiled directly from Supabase query data */}
          {(() => {
            const list = [
              ...applications.map(app => ({
                id: `app-${app.id}`,
                title: "New Application",
                description: `${app.applicantName} applied for ${app.jobTitle || "a job"}`,
                time: app.appliedDate ? new Date(app.appliedDate) : new Date(),
              })),
              ...jobSeekers.map(seeker => ({
                id: `seeker-${seeker.id}`,
                title: "New Candidate",
                description: `${seeker.fullName} registered as ${seeker.currentPosition || "General Candidate"}`,
                time: seeker.createdAt ? new Date(seeker.createdAt) : new Date(),
              }))
            ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

            const unreadCount = list.filter(item => !readNotifications.has(item.id)).length;

            return (
              <div className="flex items-center gap-2 relative">
                <div className="relative">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative"
                    data-testid="button-bell"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none px-1 animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </Button>

                  {showNotifications && (
                    <div 
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                      data-testid="notifications-dropdown"
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Live Activity</span>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={() => markAllAsRead(list.map(i => i.id))}
                              className="text-[10px] text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                            >
                              Mark all read
                            </button>
                          )}
                          <button 
                            onClick={() => setShowNotifications(false)}
                            className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                      <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-80 overflow-y-auto">
                        {list.length === 0 ? (
                          <div className="px-4 py-8 text-center text-xs text-slate-400">
                            No recent activity found.
                          </div>
                        ) : (
                          list.map((item) => {
                            const isRead = readNotifications.has(item.id);
                            return (
                              <div 
                                key={item.id} 
                                className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left relative ${
                                  isRead ? "opacity-60" : "bg-blue-50/50 dark:bg-blue-950/20"
                                }`}
                              >
                                {!isRead && (
                                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
                                )}
                                <div className="flex justify-between items-start gap-1.5">
                                  <p className={`text-xs font-bold ${isRead ? "text-slate-500 dark:text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>{item.title}</p>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] text-slate-400 whitespace-nowrap">
                                      {Math.max(0, Math.floor((Date.now() - item.time.getTime()) / 60000)) < 60
                                        ? `${Math.max(1, Math.floor((Date.now() - item.time.getTime()) / 60000))}m ago`
                                        : item.time.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                    </span>
                                    {!isRead && (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); markAsRead(item.id); }}
                                        className="text-[9px] text-blue-500 hover:text-blue-700 dark:text-blue-400 font-medium whitespace-nowrap"
                                      >
                                        Read
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className={`text-[11px] mt-0.5 leading-relaxed ${isRead ? "text-slate-400 dark:text-slate-500" : "text-slate-500 dark:text-slate-400"}`}>{item.description}</p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => window.open("/", "_blank")}
                  title="Open Public Careers Site"
                  data-testid="button-globe"
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </div>
            );
          })()}
        </header>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {/* ── Functional Workspaces ── */}
          {activeTab === "onboarding" && <OnboardingWorkspace />}
          {activeTab === "financials" && <FinancialsWorkspace />}
          {activeTab === "esignature" && <ESignatureWorkspace />}
          {activeTab === "reports" && <ReportsWorkspace />}
          {activeTab === "background-checks" && <BackgroundChecksWorkspace />}
          {activeTab === "email-calendar" && <EmailCalendarWorkspace />}

          {/* ── ATS marketed-modules mock screens ── */}
          {isAtsModule && ["vms-sync", "job-boards"].includes(activeTab) && (
            <AtsModule moduleKey={activeTab as AtsModuleKey} />
          )}

          {/* ── Dashboard overview ── */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 max-w-6xl">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total Applications"
                  value={totalApps}
                  icon={Users}
                  accent="#3b82f6"
                  sub="All time"
                />
                <StatCard
                  label="New / Pending"
                  value={newCount}
                  icon={Clock}
                  accent="#f59e0b"
                  sub="Awaiting review"
                />
                <StatCard
                  label="Shortlisted"
                  value={shortlistedCount}
                  icon={Star}
                  accent="#8b5cf6"
                  sub="In progress"
                />
                <StatCard
                  label="Hired"
                  value={hiredCount}
                  icon={CheckCircle2}
                  accent="#10b981"
                  sub="Successfully placed"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Avg. Time-to-Fill"
                  value={
                    timeToFillDays > 0 ? `${Math.round(timeToFillDays)}d` : "—"
                  }
                  icon={Clock}
                  accent="#0ea5e9"
                  sub="Days from application to hire"
                />
                <StatCard
                  label="Submissions to Hire"
                  value={
                    hiredCount > 0 && submittedCount > 0
                      ? `${Math.round((hiredCount / submittedCount) * 100)}%`
                      : "—"
                  }
                  icon={TrendingUp}
                  accent="#10b981"
                  sub="Ratio of placements per sub"
                />
                <StatCard
                  label="Pipeline Win Rate"
                  value={
                    totalApps > 0
                      ? `${Math.round((hiredCount / totalApps) * 100)}%`
                      : "0%"
                  }
                  icon={Target}
                  accent="#ec4899"
                  sub="Total applications → Hired"
                />
                <StatCard
                  label="Active Jobs"
                  value={jobs.length}
                  icon={Briefcase}
                  accent="#f59e0b"
                  sub="Open positions in pipeline"
                />
              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Pipeline breakdown */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                      <Layers className="h-4 w-4" /> Hiring Pipeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {totalApps === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        No applications yet.
                      </p>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                          data={PIPELINE.map((stage) => ({
                            name: stage.label,
                            count: applications.filter(
                              (a) => a.status === stage.status,
                            ).length,
                            accent: stage.accent,
                          }))}
                          margin={{ top: 4, right: 16, left: -16, bottom: 4 }}
                        >
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            cursor={{ fill: "rgba(14,165,233,0.06)" }}
                            contentStyle={{
                              border: "none",
                              borderRadius: 8,
                              fontSize: 12,
                            }}
                          />
                          <Bar
                            dataKey="count"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                          >
                            {PIPELINE.map((stage) => (
                              <Cell key={stage.status} fill={stage.accent} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Source of Hire */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Source of Applicants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {totalApps === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        No data available.
                      </p>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                          data={sourceData}
                          layout="vertical"
                          margin={{ top: 4, right: 16, left: 10, bottom: 4 }}
                        >
                          <XAxis
                            type="number"
                            allowDecimals={false}
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            width={70}
                          />
                          <Tooltip
                            cursor={{ fill: "rgba(14,165,233,0.06)" }}
                            contentStyle={{
                              border: "none",
                              borderRadius: 8,
                              fontSize: 12,
                            }}
                          />
                          <Bar
                            dataKey="count"
                            fill="#0ea5e9"
                            radius={[0, 4, 4, 0]}
                            maxBarSize={20}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick actions */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      label: "Review New Applications",
                      tab: "ats" as AdminTab,
                      icon: LayoutGrid,
                      count: newCount,
                      accent: "#3b82f6",
                    },
                    {
                      label: "Post a New Job",
                      tab: "jobs" as AdminTab,
                      icon: Plus,
                      count: null,
                      accent: "#0ea5e9",
                    },
                    {
                      label: "Manage Articles",
                      tab: "articles" as AdminTab,
                      icon: BookOpen,
                      count: articles.length,
                      accent: "#06b6d4",
                    },
                  ].map(({ label, tab, icon: Icon, count, accent }) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="flex items-center gap-3 p-4 rounded-xl border bg-background hover-elevate text-left transition-all"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${accent}15` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: accent }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {label}
                        </p>
                        {count !== null && (
                          <p className="text-xs text-muted-foreground">
                            {count} items
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ATS / Hiring Pipeline ── */}
          {activeTab === "ats" && (
            <div className="flex flex-col h-full">
              <ATSView
                filterJobId={filterJobId}
                setFilterJobId={setFilterJobId}
              />
            </div>
          )}

          {/* ── CRM · Clients & Deals ── */}
          {activeTab === "crm" && <CrmWorkspace />}

          {activeTab === "ai-recruiter" && <AiRecruiterModule />}

          {/* ── Hotlist / Bench ── */}
          {activeTab === "hotlist" && <HotlistView />}

          {/* ── Job Postings ── */}
          {activeTab === "jobs" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {isEditing ? (
                      <>
                        <Pencil className="h-4 w-4 text-[#0ea5e9]" /> Edit Job
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 text-[#0ea5e9]" /> Post New Job
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="title">Job Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          required
                          data-testid="input-job-title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company *</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: e.target.value,
                            })
                          }
                          required
                          data-testid="input-company"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          required
                          data-testid="input-location"
                        />
                      </div>
                      <div>
                        <Label htmlFor="jobType">Job Type *</Label>
                        <Select
                          value={formData.jobType}
                          onValueChange={(v) =>
                            setFormData({ ...formData, jobType: v })
                          }
                        >
                          <SelectTrigger
                            id="jobType"
                            data-testid="select-job-type"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Full-time",
                              "Part-time",
                              "Contract",
                              "Temporary",
                            ].map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry *</Label>
                        <Select
                          value={formData.industry}
                          onValueChange={(v) =>
                            setFormData({ ...formData, industry: v })
                          }
                        >
                          <SelectTrigger
                            id="industry"
                            data-testid="select-industry"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Manufacturing",
                              "Healthcare",
                              "Technology",
                              "Finance",
                              "Administrative",
                              "Logistics",
                            ].map((ind) => (
                              <SelectItem key={ind} value={ind}>
                                {ind}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="salary">Salary Range</Label>
                        <Input
                          id="salary"
                          value={formData.salary ?? ""}
                          onChange={(e) =>
                            setFormData({ ...formData, salary: e.target.value })
                          }
                          placeholder="e.g., ₹8L – ₹12L per annum"
                          data-testid="input-salary"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">Job Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          required
                          rows={5}
                          data-testid="input-description"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        type="submit"
                        className="bg-[#0ea5e9] hover:bg-[#0ea5e9] text-white border-0"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                        data-testid="button-submit-job"
                      >
                        {isEditing ? "Update Job" : "Post Job"}
                      </Button>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetForm}
                          data-testid="button-cancel"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-foreground">
                    Active Postings{" "}
                    <span className="text-muted-foreground font-normal">
                      ({jobs.length})
                    </span>
                  </h2>
                </div>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-28 bg-muted/40 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-xl">
                    <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No jobs posted yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                    {jobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        appCount={
                          applications.filter((a) => a.jobId === job.id).length
                        }
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onViewApps={viewJobApplications}
                        isDeleting={deleteMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Job Seekers ── */}
          {activeTab === "jobseekers" && (
            <div className="max-w-6xl">
              <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Registered Candidates
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Everyone who created a candidate account on the website.
                  </p>
                </div>
                <span
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#0ea5e9]/10 text-[#0ea5e9]"
                  data-testid="text-jobseeker-count"
                >
                  {jobSeekers.length}{" "}
                  {jobSeekers.length === 1 ? "candidate" : "candidates"}
                </span>
              </div>

              {jobSeekersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-muted/40 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : jobSeekers.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-xl">
                  <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No registered candidates yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      className="pl-9 bg-background"
                      placeholder="Search by name, email, or current position (e.g. React Developer)..."
                      value={seekerSearch}
                      onChange={(e) => setSeekerSearch(e.target.value)}
                      data-testid="input-seeker-search"
                    />
                  </div>

                  {selectedJobSeekers.length > 0 && (
                    <div className="bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 rounded-lg p-3 flex items-center justify-between sticky top-0 z-10">
                      <span className="text-sm font-semibold text-[#0ea5e9]">
                        {selectedJobSeekers.length} candidate
                        {selectedJobSeekers.length > 1 ? "s" : ""} selected
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedJobSeekers([])}
                        >
                          Clear
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white"
                          onClick={() => setIsBulkEmailOpen(true)}
                        >
                          <Mail className="h-4 w-4 mr-2" /> Bulk Email
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {jobSeekers
                      .filter((s) => {
                        if (!seekerSearch) return true;
                        const term = seekerSearch.toLowerCase();
                        return (
                          s.fullName.toLowerCase().includes(term) ||
                          s.email.toLowerCase().includes(term) ||
                          (s.currentPosition &&
                            s.currentPosition.toLowerCase().includes(term))
                        );
                      })
                      .map((seeker) => (
                        <Card
                          key={seeker.id || Math.random().toString()}
                          className={`border ${selectedJobSeekers.includes(seeker.id || "") ? "border-[#0ea5e9] shadow-md ring-1 ring-[#0ea5e9]/30" : "border-0 shadow-sm"} hover-elevate transition-all`}
                          data-testid={`card-jobseeker-${seeker.id || ""}`}
                        >
                          <CardContent className="p-0">
                            {/* Top info row */}
                            <div className="flex items-start gap-3 p-4 pb-3">
                              <div className="pt-1">
                                <Checkbox
                                  checked={selectedJobSeekers.includes(
                                    seeker.id || "",
                                  )}
                                  onCheckedChange={(checked) => {
                                    if (checked)
                                      setSelectedJobSeekers((prev) => [
                                        ...prev,
                                        seeker.id || "",
                                      ]);
                                    else
                                      setSelectedJobSeekers((prev) =>
                                        prev.filter((id) => id !== (seeker.id || "")),
                                      );
                                  }}
                                />
                              </div>
                              <div
                                className={`w-11 h-11 rounded-full ${getAvatarColor(seeker.fullName)} text-white flex items-center justify-center text-sm font-bold shrink-0`}
                              >
                                {getInitials(seeker.fullName)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3
                                    className="text-sm font-bold text-foreground"
                                    data-testid={`text-jobseeker-name-${seeker.id || ""}`}
                                  >
                                    {seeker.fullName}
                                  </h3>
                                  {seeker.experienceLevel && (
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                      {seeker.experienceLevel}
                                    </span>
                                  )}
                                </div>
                                {seeker.currentPosition && (
                                  <p
                                    className="text-xs text-muted-foreground mt-0.5"
                                    data-testid={`text-jobseeker-position-${seeker.id || ""}`}
                                  >
                                    {seeker.currentPosition}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-muted-foreground">
                                  <a
                                    href={`mailto:${seeker.email}`}
                                    className="flex items-center gap-1.5 hover:text-[#0ea5e9]"
                                    data-testid={`link-jobseeker-email-${seeker.id || ""}`}
                                  >
                                    <Mail className="h-3.5 w-3.5" />{" "}
                                    {seeker.email}
                                  </a>
                                  {seeker.phone && (
                                    <a
                                      href={`tel:${seeker.phone}`}
                                      className="flex items-center gap-1.5 hover:text-[#0ea5e9]"
                                      data-testid={`link-jobseeker-phone-${seeker.id || ""}`}
                                    >
                                      <Phone className="h-3.5 w-3.5" />{" "}
                                      {seeker.phone}
                                    </a>
                                  )}
                                  <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />{" "}
                                    Registered {seeker.createdAt ? formatDate(seeker.createdAt) : ""}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-slate-100 dark:border-slate-800" />

                            {/* Action bar – always fully visible */}
                            <div className="flex items-center gap-0 px-3 py-2 bg-slate-50/60 dark:bg-slate-900/30 rounded-b-lg overflow-x-auto">
                              <Button 
                                size="sm" variant="ghost" 
                                className="h-8 text-xs font-semibold hover:bg-white hover:text-slate-900 hover:shadow-sm shrink-0"
                                onClick={() => {
                                  setActiveSeeker(seeker);
                                  setShowViewer(true);
                                }}
                                data-testid={`button-view-seeker-${seeker.id || ""}`}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1 text-slate-500" /> View
                              </Button>
                              <Button 
                                size="sm" variant="ghost" 
                                className="h-8 text-xs font-semibold hover:bg-white hover:text-slate-900 hover:shadow-sm shrink-0"
                                onClick={() => {
                                  const actualUrl = seeker.resumeUrl
                                    ? (seeker.resumeUrl.startsWith("http://") || seeker.resumeUrl.startsWith("https://")
                                      ? seeker.resumeUrl
                                      : `https://pub-0035a50eaf1046efa85b6e5d1631f721.r2.dev/${seeker.resumeUrl.replace(/^\//, "")}`)
                                    : null;
                                  if (actualUrl) {
                                    window.open(actualUrl, "_blank");
                                  } else {
                                    toast({ title: "No resume file uploaded yet" });
                                  }
                                }}
                                data-testid={`button-download-seeker-${seeker.id || ""}`}
                              >
                                <Download className="h-3.5 w-3.5 mr-1 text-slate-500" /> Download
                              </Button>
                              <Button 
                                size="sm" variant="ghost" 
                                className="h-8 text-xs font-semibold text-[#0ea5e9] hover:bg-[#0ea5e9]/10 hover:text-[#0ea5e9] hover:shadow-sm shrink-0"
                                onClick={() => {
                                  setActiveSeeker(seeker);
                                  setShowAts(true);
                                }}
                                data-testid={`button-ats-seeker-${seeker.id || ""}`}
                              >
                                <Sparkles className="h-3.5 w-3.5 mr-1" /> ATS Analysis
                              </Button>
                              <Button 
                                size="sm" variant="ghost" 
                                className="h-8 text-xs font-semibold hover:bg-white hover:text-slate-900 hover:shadow-sm shrink-0"
                                onClick={() => {
                                  setNoteSeeker(seeker);
                                  setNoteText(seeker.additionalInfo || "");
                                }}
                                data-testid={`button-notes-seeker-${seeker.id || ""}`}
                              >
                                <FileText className="h-3.5 w-3.5 mr-1 text-slate-500" /> Notes
                              </Button>
                              <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" />
                              <Button 
                                size="sm" variant="ghost" 
                                className={`h-8 text-xs font-semibold shrink-0 ${
                                  seeker.isShortlisted 
                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400" 
                                    : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm"
                                }`}
                                onClick={async () => {
                                  try {
                                    const newState = !seeker.isShortlisted;
                                    const { error } = await supabase
                                      .from("resumes")
                                      .update({ is_shortlisted: newState })
                                      .eq("id", seeker.id || "");
                                    if (error) throw error;
                                    toast({ 
                                      title: newState ? "Candidate shortlisted" : "Removed from shortlist", 
                                      description: newState 
                                        ? `${seeker.fullName} has been added to the shortlist.` 
                                        : `${seeker.fullName} has been removed from the shortlist.`
                                    });
                                    queryClient.invalidateQueries({ queryKey: ["/api/admin/jobseekers"] });
                                  } catch (err) {
                                    toast({ title: "Failed to update shortlist", variant: "destructive" });
                                  }
                                }}
                                data-testid={`button-shortlist-seeker-${seeker.id || ""}`}
                              >
                                <Star className={`h-3.5 w-3.5 mr-1 ${seeker.isShortlisted ? "fill-current" : ""}`} /> 
                                {seeker.isShortlisted ? "Shortlisted" : "Shortlist"}
                              </Button>
                              <Button 
                                size="sm" variant="ghost" 
                                className="h-8 text-xs font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-600 hover:shadow-sm shrink-0"
                                onClick={async () => {
                                  if (confirm(`Are you sure you want to reject candidate ${seeker.fullName}?`)) {
                                    try {
                                      const { error } = await supabase
                                        .from("resumes")
                                        .delete()
                                        .eq("id", seeker.id || "");
                                      if (error) throw error;
                                      toast({ title: "Candidate rejected and removed", variant: "destructive" });
                                      queryClient.invalidateQueries({ queryKey: ["/api/admin/jobseekers"] });
                                    } catch (err) {
                                      toast({ title: "Failed to reject candidate", variant: "destructive" });
                                    }
                                  }
                                }}
                                data-testid={`button-reject-seeker-${seeker.id || ""}`}
                              >
                                <X className="h-3.5 w-3.5 mr-1" /> Reject
                              </Button>
                              <HotlistToggleButton
                                jobSeekerId={seeker.id || ""}
                                isHotlisted={seeker.isHotlisted ?? false}
                              />
                            </div>
                          </CardContent>
                        </Card>

                      ))}
                    {jobSeekers.filter((s) => {
                      if (!seekerSearch) return true;
                      const term = seekerSearch.toLowerCase();
                      return (
                        s.fullName.toLowerCase().includes(term) ||
                        s.email.toLowerCase().includes(term) ||
                        (s.currentPosition &&
                          s.currentPosition.toLowerCase().includes(term))
                      );
                    }).length === 0 &&
                      seekerSearch && (
                        <div className="text-center py-10 text-muted-foreground text-sm">
                          No candidates match your search.
                        </div>
                      )}
                  </div>
                </div>
              )}

              {isBulkEmailOpen && (
                <BulkEmailDialog
                  open={isBulkEmailOpen}
                  onOpenChange={setIsBulkEmailOpen}
                  selectedEmails={jobSeekers
                    .filter((s) => selectedJobSeekers.includes(s.id || ""))
                    .map((s) => s.email)}
                  onSuccess={() => setSelectedJobSeekers([])}
                />
              )}
            </div>
          )}

          {activeTab === "articles" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {isArticleEditing ? (
                      <>
                        <Pencil className="h-4 w-4 text-[#0ea5e9]" /> Edit
                        Article
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 text-[#0ea5e9]" /> New Article
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <form onSubmit={handleSubmitArticle} className="space-y-4">
                    <div>
                      <Label htmlFor="article-title">Title *</Label>
                      <Input
                        id="article-title"
                        value={articleForm.title}
                        onChange={(e) =>
                          setArticleForm({
                            ...articleForm,
                            title: e.target.value,
                          })
                        }
                        required
                        data-testid="input-article-title"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="article-category">Category *</Label>
                        <Select
                          value={articleForm.category}
                          onValueChange={(v) =>
                            setArticleForm({ ...articleForm, category: v })
                          }
                        >
                          <SelectTrigger
                            id="article-category"
                            data-testid="select-article-category"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Career Advice",
                              "Interview Tips",
                              "Hiring Insights",
                            ].map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="article-readtime">Read Time</Label>
                        <Input
                          id="article-readtime"
                          value={articleForm.readTime ?? ""}
                          onChange={(e) =>
                            setArticleForm({
                              ...articleForm,
                              readTime: e.target.value,
                            })
                          }
                          placeholder="e.g. 3 min read"
                          data-testid="input-article-readtime"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="article-author">Author</Label>
                      <Input
                        id="article-author"
                        value={articleForm.author ?? ""}
                        onChange={(e) =>
                          setArticleForm({
                            ...articleForm,
                            author: e.target.value,
                          })
                        }
                        data-testid="input-article-author"
                      />
                    </div>
                    <div>
                      <Label htmlFor="article-excerpt">
                        Excerpt *{" "}
                        <span className="text-xs text-muted-foreground">
                          (shown in cards)
                        </span>
                      </Label>
                      <Textarea
                        id="article-excerpt"
                        value={articleForm.excerpt}
                        onChange={(e) =>
                          setArticleForm({
                            ...articleForm,
                            excerpt: e.target.value,
                          })
                        }
                        required
                        rows={2}
                        data-testid="input-article-excerpt"
                      />
                    </div>
                    <div>
                      <Label htmlFor="article-content">
                        Full Content *{" "}
                        <span className="text-xs text-muted-foreground">
                          (blank line = new paragraph)
                        </span>
                      </Label>
                      <Textarea
                        id="article-content"
                        value={articleForm.content}
                        onChange={(e) =>
                          setArticleForm({
                            ...articleForm,
                            content: e.target.value,
                          })
                        }
                        required
                        rows={10}
                        data-testid="input-article-content"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setArticleForm({
                            ...articleForm,
                            published: !articleForm.published,
                          })
                        }
                        data-testid="toggle-article-published"
                        className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${articleForm.published ? "bg-[#0ea5e9]" : "bg-muted border"}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform mt-0.5 ${articleForm.published ? "translate-x-4" : "translate-x-0.5"}`}
                        />
                      </button>
                      <Label
                        className="cursor-pointer select-none"
                        onClick={() =>
                          setArticleForm({
                            ...articleForm,
                            published: !articleForm.published,
                          })
                        }
                      >
                        {articleForm.published ? "Published" : "Draft"}
                      </Label>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        type="submit"
                        className="bg-[#0ea5e9] hover:bg-[#0ea5e9] text-white border-0"
                        disabled={
                          createArticleMutation.isPending ||
                          updateArticleMutation.isPending
                        }
                        data-testid="button-submit-article"
                      >
                        {isArticleEditing
                          ? "Update Article"
                          : "Publish Article"}
                      </Button>
                      {isArticleEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetArticleForm}
                          data-testid="button-cancel-article"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h2 className="text-base font-bold text-foreground">
                  All Articles{" "}
                  <span className="text-muted-foreground font-normal">
                    ({articles.length})
                  </span>
                </h2>
                {articlesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-24 bg-muted/40 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-xl">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No articles yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                    {articles.map((article) => (
                      <Card
                        key={article.id}
                        className="hover-elevate"
                        data-testid={`card-admin-article-${article.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0ea5e9]/10 text-[#0ea5e9]">
                                  {article.category}
                                </span>
                                {article.published ? (
                                  <span className="text-xs flex items-center gap-1 text-emerald-600">
                                    <Globe className="h-3 w-3" /> Published
                                  </span>
                                ) : (
                                  <span className="text-xs flex items-center gap-1 text-muted-foreground">
                                    <EyeOff className="h-3 w-3" /> Draft
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm font-bold text-foreground leading-snug mb-1">
                                {article.title}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {article.excerpt}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1.5">
                                {article.readTime} · {article.author}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1 shrink-0">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEditArticle(article)}
                                data-testid={`button-edit-article-${article.id}`}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDeleteArticle(article.id || "")}
                                disabled={deleteArticleMutation.isPending}
                                data-testid={`button-delete-article-${article.id}`}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* ── Team Management ── */}
          {activeTab === "team" && (
            <TeamManagement
              companyName={(user as any)?.companyId ? undefined : undefined}
            />
          )}
        </main>
      </div>

      {activeSeeker && (
        <ResumeViewerModal
          seeker={activeSeeker}
          open={showViewer}
          onClose={() => {
            setShowViewer(false);
            setActiveSeeker(null);
          }}
          onAtsClick={() => {
            setShowViewer(false);
            setShowAts(true);
          }}
        />
      )}

      {activeSeeker && (
        <AtsAnalysisModal
          seeker={activeSeeker}
          open={showAts}
          onClose={() => {
            setShowAts(false);
            setActiveSeeker(null);
          }}
        />
      )}

      {noteSeeker && (
        <Dialog open onOpenChange={(o: boolean) => !o && setNoteSeeker(null)}>
          <DialogContent className="max-w-sm bg-white dark:bg-slate-900 border rounded-xl shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Notes - {noteSeeker.fullName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Candidate Notes</Label>
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Type internal recruiter notes here..."
                rows={5}
                className="text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setNoteSeeker(null)}>Cancel</Button>
              <Button 
                size="sm"
                onClick={async () => {
                  try {
                    const { error } = await supabase
                      .from("resumes")
                      .update({ additional_info: noteText })
                      .eq("id", noteSeeker.id || "");
                    if (error) throw error;
                    toast({ title: "Notes updated successfully" });
                    queryClient.invalidateQueries({ queryKey: ["/api/admin/jobseekers"] });
                    setNoteSeeker(null);
                  } catch (err) {
                    toast({ title: "Failed to save notes", variant: "destructive" });
                  }
                }}
                className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/95 text-white font-bold"
              >
                Save Notes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
