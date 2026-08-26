import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Job, Article, Application, Resume, UpdateJobSeeker } from "@shared/schema";
import { updateJobSeekerSchema } from "@shared/schema";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import {
  Search, MapPin, Briefcase, Clock, ChevronRight, Bell,
  User, FileText, BookOpen, LogOut, TrendingUp, Zap, Target, ArrowRight,
  CheckCircle, AlertCircle, Shield, Bookmark, Send, ChevronDown, Menu, X,
  Layers, Save, LayoutDashboard
} from "lucide-react";
import tilconsLogo from "@assets/Top_Logo_Tilcons_SkyBlue.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

const PIPELINE_STAGES: Record<string, { label: string; color: string; bg: string }> = {
  "new": { label: "Applied", color: "#3b82f6", bg: "#eff6ff" },
  "reviewing": { label: "In Review", color: "#f59e0b", bg: "#fffbeb" },
  "shortlisted": { label: "Shortlisted", color: "#8b5cf6", bg: "#f5f3ff" },
  "submitted": { label: "Submitted", color: "#06b6d4", bg: "#ecfeff" },
  "interview": { label: "Interview", color: "#a855f7", bg: "#faf5ff" },
  "offer": { label: "Offer", color: "#f97316", bg: "#fff7ed" },
  "joined": { label: "Joined", color: "#10b981", bg: "#ecfdf5" },
  "rejected": { label: "Not Selected", color: "#ef4444", bg: "#fef2f2" },
};

function ProfileRing({ pct }: { pct: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="block">
      <circle cx="44" cy="44" r={r} fill="none" stroke="#e5e7eb" strokeWidth="7" />
      <circle
        cx="44" cy="44" r={r} fill="none"
        stroke={SKY} strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 44 44)"
      />
      <text x="44" y="49" textAnchor="middle" fontSize="14" fontWeight="800" fill={NAVY}>{pct}%</text>
    </svg>
  );
}

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { label: "My Profile", icon: User, id: "profile" },
  { label: "My Applications", icon: Layers, id: "applications" },
  { label: "Saved Jobs", icon: Bookmark, id: "saved" },
];

export default function JobSeekerDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useDocumentMeta(
    "Candidate Dashboard",
    "Your Tilcons candidate dashboard — track applications, browse matched roles, manage your profile and get expert career advice."
  );

  type Me = {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    currentPosition: string | null;
    experienceLevel: string | null;
  };

  const { data: me, isLoading: meLoading } = useQuery<Me | null>({
    queryKey: ["/api/jobseekers/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
  });

  useEffect(() => {
    if (!meLoading && !me) {
      setLocation("/jobseeker-auth");
    }
  }, [meLoading, me, setLocation]);

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const { data: articles = [] } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: myApplications = [] } = useQuery<Application[]>({
    queryKey: ["/api/jobseekers/applications"],
    enabled: !!me,
    retry: false,
  });
  const { data: myResumes = [] } = useQuery<Resume[]>({
    queryKey: ["/api/jobseekers/resumes"],
    enabled: !!me,
    retry: false,
  });

  const savedJobsKey = me?.email ? `tilcons:saved-jobs:${me.email.toLowerCase()}` : null;
  const [savedJobIdList, setSavedJobIdList] = useState<string[]>([]);

  useEffect(() => {
    if (!savedJobsKey || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(savedJobsKey);
      setSavedJobIdList(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      setSavedJobIdList([]);
    }
  }, [savedJobsKey]);

  const savedJobIds = new Set(savedJobIdList);

  const toggleSaveJob = (jobId: string, save: boolean) => {
    const next = save
      ? Array.from(new Set([jobId, ...savedJobIdList]))
      : savedJobIdList.filter((id) => id !== jobId);
    setSavedJobIdList(next);
    if (savedJobsKey && typeof window !== "undefined") {
      try {
        window.localStorage.setItem(savedJobsKey, JSON.stringify(next));
      } catch {
        // ignore
      }
    }
  };

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/jobseekers/logout"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/jobseekers/me"] });
      toast({ title: "Signed out", description: "You have been logged out." });
      setLocation("/jobseeker-auth");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateJobSeeker) => {
      const res = await apiRequest("PATCH", "/api/jobseekers/me", data);
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/jobseekers/me"] });
      toast({ title: "Profile updated", description: "Your profile has been saved successfully." });
    },
    onError: () => {
      toast({ title: "Update failed", description: "Could not update your profile.", variant: "destructive" });
    }
  });

  const profileForm = useForm<UpdateJobSeeker>({
    resolver: zodResolver(updateJobSeekerSchema),
    defaultValues: {
      fullName: me?.fullName || "",
      phone: me?.phone || "",
      currentPosition: me?.currentPosition || "",
      experienceLevel: me?.experienceLevel || "",
    },
  });

  useEffect(() => {
    if (me) {
      profileForm.reset({
        fullName: me.fullName || "",
        phone: me.phone || "",
        currentPosition: me.currentPosition || "",
        experienceLevel: me.experienceLevel || "",
      });
    }
  }, [me, profileForm]);

  const filtered = search
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.company.toLowerCase().includes(search.toLowerCase()) ||
          j.industry.toLowerCase().includes(search.toLowerCase())
      )
    : jobs;

  const displayName = me?.fullName ?? "Candidate";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const hasUploadedCV = myResumes.length > 0;
  const profileItems = [
    { label: "Full Name", done: !!me?.fullName },
    { label: "Email", done: !!me?.email },
    { label: "Phone Number", done: !!me?.phone },
    { label: "Current Role", done: !!me?.currentPosition },
    { label: "Experience Level", done: !!me?.experienceLevel },
    { label: "CV Uploaded", done: hasUploadedCV },
  ];
  const completedItems = profileItems.filter((p) => p.done).length;
  const profilePct = Math.round((completedItems / profileItems.length) * 100);

  const appliedCount = myApplications.length;
  const cvCount = myResumes.length;

  if (meLoading || !me) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f3f4f6" }}>
        <div className="text-sm font-bold uppercase tracking-widest" style={{ color: NAVY }}>
          Loading…
        </div>
      </div>
    );
  }

  const renderDashboardTab = () => (
    <>
      <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-wrap gap-3 items-center mb-4">
        <span className="text-xs font-black uppercase tracking-widest" style={{ color: NAVY }}>
          {search ? `${filtered.length} results for "${search}"` : `${jobs.length} Recommended Jobs`}
        </span>
        <div className="flex gap-2 ml-auto flex-wrap">
          {["Full-time", "Remote", "Senior", "Latest"].map((f) => (
            <button
              key={f}
              className="text-xs px-3 py-1.5 rounded-full border font-medium transition-colors hover:border-sky-400 hover:text-sky-500"
              style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {jobsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <Briefcase className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-400 text-sm">No jobs match your search.</p>
          </div>
        ) : (
          filtered.slice(0, 5).map((job) => (
            <JobCard
              key={job.id || Math.random().toString()}
              job={job}
              saved={savedJobIds.has(job.id || "")}
              onToggleSave={(save) => toggleSaveJob(job.id || "", save)}
            />
          ))
        )}

        {!search && filtered.length > 0 && (
          <Link href="/jobs">
            <button className="w-full py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90" style={{ background: NAVY }}>
              View All Jobs <ArrowRight className="inline h-4 w-4 ml-1" />
            </button>
          </Link>
        )}
      </div>
    </>
  );

  const renderProfileTab = () => (
    <Card className="border-0 shadow-sm overflow-hidden">
      <div className="h-24 w-full" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${SKY} 100%)` }}></div>
      <CardContent className="px-6 pb-8 pt-0 -mt-10">
        <div className="flex justify-between items-end mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center text-white text-2xl font-black bg-sky-500 shadow-sm">
            {initials}
          </div>
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Profile {profilePct}% Complete</Badge>
        </div>
        
        <form onSubmit={profileForm.handleSubmit((data) => updateProfileMutation.mutate(data))} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...profileForm.register("fullName")} />
              {profileForm.formState.errors.fullName && <p className="text-xs text-red-500">{profileForm.formState.errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={me.email} disabled className="bg-gray-50 text-gray-500" />
              <p className="text-[10px] text-gray-400">Email cannot be changed.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...profileForm.register("phone")} placeholder="+1 (555) 000-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPosition">Current Position</Label>
              <Input id="currentPosition" {...profileForm.register("currentPosition")} placeholder="e.g. Senior Software Engineer" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <select 
                {...profileForm.register("experienceLevel")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select level...</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior (5-10 years)</option>
                <option value="lead">Lead/Director (10+ years)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderApplicationsTab = () => (
    <Card className="border-0 shadow-sm">
      <CardHeader className="border-b border-gray-50 bg-gray-50/50 rounded-t-xl pb-4">
        <CardTitle className="text-lg font-black text-[#0d2137]">My Applications</CardTitle>
        <p className="text-xs text-gray-500 mt-1">Track the status of roles you have applied for.</p>
      </CardHeader>
      <CardContent className="p-0">
        {myApplications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">No applications yet</h3>
            <p className="text-xs text-gray-500 mb-4">You haven't applied to any jobs using this account.</p>
            <Button onClick={() => setActiveTab("dashboard")} className="bg-sky-500 hover:bg-sky-600 text-white">Browse Jobs</Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {myApplications.map(app => {
              const stage = PIPELINE_STAGES[app.status || "new"] || PIPELINE_STAGES.new;
              return (
                <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-[#0d2137]">{app.jobTitle}</h4>
                    <p className="text-xs text-gray-500 mt-1">Applied on {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : ""}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                      style={{ color: stage.color, backgroundColor: stage.bg }}
                    >
                      {stage.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderSavedJobsTab = () => {
    const savedJobsList = jobs.filter(j => savedJobIds.has(j.id || ""));
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-black text-[#0d2137] mb-2">Saved Jobs</h2>
        {savedJobsList.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <Bookmark className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-400 text-sm">You haven't saved any jobs yet.</p>
          </div>
        ) : (
          savedJobsList.map((job) => (
            <JobCard
              key={job.id || Math.random().toString()}
              job={job}
              saved={true}
              onToggleSave={(save) => toggleSaveJob(job.id || "", save)}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>
      <header className="sticky top-0 z-50 shadow-sm" style={{ background: NAVY }}>
        <div className="flex items-center gap-4 px-4 md:px-6 h-16">
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/" className="shrink-0 flex items-center">
            <div className="bg-white rounded px-2.5 py-1.5 shadow-sm">
              <img src={tilconsLogo} alt="Tilcons" className="h-8 w-auto object-contain" />
            </div>
          </Link>

          <div className="flex flex-1 max-w-2xl mx-auto hidden md:flex">
            <div className="flex flex-1 bg-white/10 rounded-l-md overflow-hidden border border-white/20 backdrop-blur-sm focus-within:bg-white focus-within:border-white transition-all">
              <div className="flex items-center pl-3 shrink-0">
                <Search className="h-4 w-4 text-white/60 group-focus-within:text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 py-2 px-3 text-sm text-white outline-none bg-transparent placeholder:text-white/60 focus:text-gray-900 focus:placeholder:text-gray-400"
              />
            </div>
            <button className="px-5 py-2 text-xs font-black uppercase tracking-widest text-white rounded-r-md shrink-0 transition-opacity hover:opacity-90 shadow-sm" style={{ background: SKY }}>
              Search
            </button>
          </div>

          <div className="flex items-center gap-4 shrink-0 ml-auto">
            <button className="text-white/80 hover:text-white relative transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-sm" style={{ background: SKY }}>3</span>
            </button>

            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0 shadow-sm border border-white/20" style={{ background: SKY }}>
                {initials}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-white text-sm font-bold leading-none truncate max-w-[120px]">{displayName}</span>
                <span className="text-white/60 text-[10px] uppercase tracking-wider leading-none mt-1">Candidate</span>
              </div>
              <ChevronDown className="h-4 w-4 text-white/60 hidden md:block group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 px-6 border-t border-white/10 overflow-x-auto bg-[#0a1929]">
          {NAV_ITEMS.map(({ label, id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-all hover:bg-white/5"
              style={{
                color: activeTab === id ? SKY : "rgba(255,255,255,0.6)",
                borderColor: activeTab === id ? SKY : "transparent",
              }}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </header>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-[#0d2137]/90 backdrop-blur-sm md:hidden flex flex-col pt-20 px-6" onClick={() => setSidebarOpen(false)}>
          {NAV_ITEMS.map(({ label, id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className="flex items-center gap-4 py-4 text-sm font-bold text-white border-b border-white/10 last:border-0"
              style={{ color: activeTab === id ? SKY : "white" }}
            >
              <Icon className="h-5 w-5" /> {label}
            </button>
          ))}
          <button
            onClick={() => logoutMutation.mutate()}
            className="flex items-center gap-4 py-4 text-sm font-bold text-red-400 mt-auto mb-8"
          >
            <LogOut className="h-5 w-5" /> Sign Out
          </button>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8">
        <div className="rounded-2xl p-8 mb-8 flex flex-wrap gap-6 items-center justify-between shadow-lg relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1e40af 100%)` }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="relative z-10">
            <p className="text-sm font-black uppercase tracking-widest mb-2" style={{ color: SKY }}>Candidate Portal</p>
            <h1 className="text-3xl font-black text-white leading-tight">Welcome back, {displayName.split(" ")[0]}!</h1>
            <p className="text-blue-100/80 text-sm mt-2 max-w-xl">You have {jobs.length} jobs matching your profile. Make sure your CV is up to date to increase your chances of getting hired.</p>
          </div>
          <div className="flex gap-3 relative z-10">
            <Link href="/submit-cv">
              <button className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-black uppercase tracking-widest text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg" style={{ background: SKY }}>
                <Send className="h-4 w-4" /> Update CV
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-8">
          <aside className="hidden lg:flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: NAVY }}>Your Activity</p>
              {[
                { icon: Layers, label: "Applications", value: String(appliedCount) },
                { icon: Bookmark, label: "Saved Jobs", value: String(savedJobIdList.length) },
                { icon: FileText, label: "CVs Submitted", value: String(cvCount) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                    <Icon className="h-4 w-4 text-gray-400" /> {label}
                  </div>
                  <span className="text-sm font-black" style={{ color: NAVY }}>{value}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-xs font-black uppercase tracking-widest mb-4 text-gray-400">Settings</p>
              <button
                onClick={() => logoutMutation.mutate()}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="h-4 w-4 shrink-0" /> Sign Out
              </button>
            </div>
          </aside>

          <main className="flex flex-col gap-6 min-w-0">
            {activeTab === "dashboard" && renderDashboardTab()}
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "applications" && renderApplicationsTab()}
            {activeTab === "saved" && renderSavedJobsTab()}
          </main>

          <aside className="flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-xs font-black uppercase tracking-widest mb-5" style={{ color: NAVY }}>Profile Strength</p>
              <div className="flex flex-col items-center mb-6">
                <ProfileRing pct={profilePct} />
                <p className="text-sm font-bold mt-4" style={{ color: NAVY }}>
                  {profilePct < 50 ? "Beginner" : profilePct < 80 ? "Intermediate" : "Strong"}
                </p>
                <p className="text-xs text-gray-400 mt-1 text-center">Complete your profile to stand out to top employers.</p>
              </div>
              <div className="space-y-3">
                {profileItems.map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-3">
                    {done
                      ? <CheckCircle className="h-4 w-4 shrink-0" style={{ color: SKY }} />
                      : <AlertCircle className="h-4 w-4 shrink-0 text-gray-200" />
                    }
                    <span className={`text-xs font-medium ${done ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
                    {!done && (
                      <button onClick={() => setActiveTab("profile")} className="ml-auto text-[10px] font-bold hover:underline" style={{ color: SKY }}>Add</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl shadow-sm border border-sky-100 p-6 bg-gradient-to-br from-sky-50 to-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-sky-500">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black" style={{ color: NAVY }}>Job Alerts</p>
                  <p className="text-xs text-gray-500 mt-0.5">Never miss a match</p>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-white shadow-sm transition-all hover:shadow-md hover:opacity-90" style={{ background: SKY }}>
                Create Alert
              </button>
            </div>
            
            <div className="rounded-xl p-6 shadow-sm relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1e40af 100%)` }}>
              <Shield className="absolute -bottom-4 -right-4 h-32 w-32 text-white opacity-5" />
              <p className="text-xs font-black uppercase tracking-widest mb-5 text-white/80">Why Tilcons?</p>
              {[
                { icon: Shield, text: "100% Confidential" },
                { icon: Zap, text: "24h Recruiter Response" },
                { icon: Target, text: "Precision Job Matching" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 mb-4 last:mb-0 relative z-10">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${SKY}33` }}>
                    <Icon className="h-4 w-4" style={{ color: SKY }} />
                  </div>
                  <span className="text-white/90 text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function JobCard({
  job,
  saved,
  onToggleSave,
}: {
  job: Job;
  saved: boolean;
  onToggleSave: (save: boolean) => void;
}) {
  const daysAgo = Math.floor(
    (Date.now() - new Date(job.postedDate || new Date()).getTime()) / (1000 * 60 * 60 * 24)
  );
  const label = daysAgo === 0 ? "Today" : daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`;
  const initials = job.company.slice(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:border-sky-200 transition-all hover:shadow-md group">
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0 shadow-inner" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1e40af 100%)` }}>
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="text-base font-black leading-tight group-hover:text-sky-600 transition-colors" style={{ color: NAVY }}>{job.title}</h3>
              <p className="text-sm text-gray-500 mt-1 font-medium">{job.company}</p>
            </div>
            <button
              type="button"
              onClick={() => onToggleSave(!saved)}
              className="transition-colors shrink-0 hover:text-sky-500 p-2 -mr-2 rounded-full hover:bg-sky-50"
              style={{ color: saved ? SKY : "#d1d5db" }}
            >
              <Bookmark className="h-5 w-5" fill={saved ? SKY : "none"} />
            </button>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <MapPin className="h-3.5 w-3.5 text-gray-400" /> {job.location}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Briefcase className="h-3.5 w-3.5 text-gray-400" /> {job.jobType}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <TrendingUp className="h-3.5 w-3.5 text-gray-400" /> {job.salary}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md" style={{ background: `${SKY}15`, color: SKY }}>
                {job.industry}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <Clock className="h-3.5 w-3.5" /> {label}
              </span>
            </div>
            <a href={`/apply/${job.id}`} target="_blank" rel="noopener noreferrer">
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5" style={{ background: SKY }}>
                Apply <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
