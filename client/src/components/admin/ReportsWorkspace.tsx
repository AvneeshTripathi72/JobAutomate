import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  IndianRupee,
  Target,
  Layers,
  Globe,
  BarChart2,
  Star,
} from "lucide-react";
import type { Application, Job, Invoice } from "@shared/schema";

const PIPELINE = [
  { status: "new", label: "Applied", accent: "#3b82f6" },
  { status: "reviewing", label: "In Review", accent: "#f59e0b" },
  { status: "shortlisted", label: "Shortlisted", accent: "#8b5cf6" },
  { status: "submitted", label: "Submitted", accent: "#06b6d4" },
  { status: "interview", label: "Interview", accent: "#a855f7" },
  { status: "offer", label: "Offer", accent: "#f97316" },
  { status: "joined", label: "Joined", accent: "#10b981" },
  { status: "rejected", label: "Not Selected", accent: "#ef4444" },
];

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
    <Card className="border-0 shadow-sm hover-elevate">
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
            style={{ width: "100%", backgroundColor: accent }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReportsWorkspace() {
  const { data: applications = [], isLoading: appsLoading } = useQuery<
    Application[]
  >({ queryKey: ["/api/applications"] });
  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });
  const { data: invoices = [], isLoading: invoicesLoading } = useQuery<
    Invoice[]
  >({ queryKey: ["/api/invoices"] });

  const totalApps = applications.length;
  const hiredCount = applications.filter((a) => a.status === "hired").length;
  const newCount = applications.filter((a) => a.status === "new").length;
  const shortlistedCount = applications.filter(
    (a) => a.status === "shortlisted",
  ).length;
  const submittedCount = applications.filter(
    (a) => a.status === "submitted",
  ).length;

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

  const totalInvoicedRevenue = invoices
    .filter((i) => i.status === "Paid")
    .reduce((acc, i) => acc + i.amountInr, 0);
  const totalQuarterRevenue = totalInvoicedRevenue;

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

  const pipelineData = PIPELINE.map((stage) => ({
    name: stage.label,
    count: applications.filter((a) => a.status === stage.status).length,
    accent: stage.accent,
  }));

  const isLoading = appsLoading || jobsLoading || invoicesLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
          <BarChart2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-foreground leading-tight">
            Reports & Analytics
          </h2>
          <p className="text-xs text-muted-foreground">
            Aggregated live data insights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Applications"
          value={totalApps}
          icon={Users}
          accent="#3b82f6"
          sub="All time"
        />
        <StatCard
          label="Avg. Time-to-Fill"
          value={timeToFillDays > 0 ? `${Math.round(timeToFillDays)}d` : "—"}
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
          label="Quarter Revenue"
          value={`₹${totalQuarterRevenue.toLocaleString("en-IN")}`}
          icon={IndianRupee}
          accent="#f59e0b"
          sub="Total generated fees"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pipeline breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4" /> Hiring Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalApps === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No applications yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={pipelineData}
                  margin={{ top: 10, right: 16, left: -16, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(0,0,0,0.05)"
                  />
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
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {pipelineData.map((stage) => (
                      <Cell key={stage.name} fill={stage.accent} />
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
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={sourceData}
                  layout="vertical"
                  margin={{ top: 10, right: 16, left: 10, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="rgba(0,0,0,0.05)"
                  />
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
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
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

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <Star className="h-4 w-4" /> Top Performing Jobs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {jobs.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No active jobs to analyze.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {jobs.map((job) => {
                const jobApps = applications.filter((a) => a.jobId === job.id);
                const hires = jobApps.filter(
                  (a) => a.status === "hired",
                ).length;
                const active = jobApps.filter(
                  (a) => a.status !== "hired" && a.status !== "rejected",
                ).length;
                return (
                  <div
                    key={job.id}
                    className="px-5 py-3 flex items-center justify-between hover-elevate"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {job.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {job.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-right shrink-0">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Total Apps
                        </p>
                        <p className="text-sm font-bold">{jobApps.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Active</p>
                        <p className="text-sm font-bold text-amber-500">
                          {active}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Hires</p>
                        <p className="text-sm font-bold text-emerald-500">
                          {hires}
                        </p>
                      </div>
                    </div>
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
