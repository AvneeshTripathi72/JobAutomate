import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, serial, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── Multi-tenant: Companies (one row per onboarded staffing agency) ─────────
export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  domain: text("domain"),
  plan: text("plan").notNull().default("starter"),   // starter | pro | enterprise
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  jobType: text("job_type").notNull(),
  industry: text("industry").notNull(),
  description: text("description").notNull(),
  salary: text("salary"),
  postedDate: timestamp("posted_date").notNull().default(sql`now()`),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull(),
  jobTitle: text("job_title").notNull(),
  applicantName: text("applicant_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"),
  status: text("status").notNull().default("new"),
  notes: text("notes"),
  // Verified-ownership link. Set ONLY by the server when an authenticated
  // job seeker submits the application (see server/routes.ts POST
  // /api/applications). Never trusted from the client (omitted from
  // insertApplicationSchema). Public/anonymous submissions remain NULL
  // and are NEVER surfaced on a candidate's dashboard.
  jobSeekerId: integer("job_seeker_id"),
  source: text("source"),    // LinkedIn | Naukri | Indeed | Monster | Referral | Direct | Walk-in | Other
  appliedDate: timestamp("applied_date").notNull().default(sql`now()`),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  inquiryType: text("inquiry_type").notNull(),
  message: text("message").notNull(),
  submittedDate: timestamp("submitted_date").notNull().default(sql`now()`),
});

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  desiredPosition: text("desired_position").notNull(),
  yearsExperience: integer("years_experience").notNull(),
  skills: text("skills").notNull(),
  linkedIn: text("linkedin"),
  additionalInfo: text("additional_info"),
  // Same verified-ownership link as applications.jobSeekerId. Server-only.
  jobSeekerId: integer("job_seeker_id"),
  submittedDate: timestamp("submitted_date").notNull().default(sql`now()`),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  // Multi-tenant fields
  role: text("role").notNull().default("recruiter"),   // super_admin | company_admin | recruiter
  companyId: varchar("company_id"),                    // null for super_admin
  email: text("email"),
  fullName: text("full_name"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export type UserRole = "super_admin" | "company_admin" | "recruiter";
export const USER_ROLES: UserRole[] = ["super_admin", "company_admin", "recruiter"];

export const jobSeekers = pgTable("job_seekers", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  phone: text("phone"),
  currentPosition: text("current_position"),
  experienceLevel: text("experience_level"),
  resetToken: text("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires"),
  isHotlisted: boolean("is_hotlisted").notNull().default(false),
  hotlistNotes: text("hotlist_notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const interviews = pgTable("interviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  mode: text("mode").notNull().default("video"),
  interviewerName: text("interviewer_name").notNull(),
  interviewerEmail: text("interviewer_email"),
  status: text("status").notNull().default("scheduled"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull(),
  clientId: varchar("client_id").notNull(),
  ownerUserId: varchar("owner_user_id").notNull(),
  submittedAt: timestamp("submitted_at").notNull().default(sql`now()`),
  status: text("status").notNull().default("submitted"),
  rateOfferedInr: integer("rate_offered_inr"),
  notes: text("notes"),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  createdByUserId: varchar("created_by_user_id"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const APPLICATION_STATUSES = [
  "new", "reviewing", "shortlisted", "submitted",
  "interview", "offer", "joined", "rejected", "hired",
] as const;
export type ApplicationStatus = typeof APPLICATION_STATUSES[number];

export const insertInterviewSchema = createInsertSchema(interviews).omit({
  id: true,
  createdAt: true,
}).extend({
  applicationId: z.string().uuid("Valid application required"),
  scheduledAt: z.coerce.date(),
  mode: z.enum(["phone", "video", "onsite"]).default("video"),
  interviewerName: z.string().trim().min(1).max(150),
  interviewerEmail: z.string().trim().email().max(200).optional().nullable(),
  status: z.enum(["scheduled", "completed", "cancelled", "no_show"]).default("scheduled"),
  feedback: z.string().trim().max(4000).optional().nullable(),
});
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type Interview = typeof interviews.$inferSelect;

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  submittedAt: true,
  ownerUserId: true,
}).extend({
  applicationId: z.string().uuid("Valid application required"),
  clientId: z.string().uuid("Valid client required"),
  status: z.enum(["submitted", "client_review", "interview", "rejected", "selected"]).default("submitted"),
  rateOfferedInr: z.number().int().min(0).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
  createdByUserId: true,
}).extend({
  applicationId: z.string().uuid("Valid application required"),
  type: z.enum(["note", "status_change", "interview", "submission", "hotlist"]),
  description: z.string().trim().min(1).max(2000),
});
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export const hotlistToggleSchema = z.object({
  isHotlisted: z.boolean(),
  hotlistNotes: z.string().trim().max(1000).optional().nullable(),
});
export type HotlistToggle = z.infer<typeof hotlistToggleSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  website: text("website"),
  servicesOffered: text("services_offered").notNull(),
  industriesExpertise: text("industries_expertise").notNull(),
  geographicCoverage: text("geographic_coverage").notNull(),
  yearsInBusiness: integer("years_in_business").notNull(),
  companyDescription: text("company_description").notNull(),
  partnershipReason: text("partnership_reason").notNull(),
  submittedDate: timestamp("submitted_date").notNull().default(sql`now()`),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerUserId: varchar("owner_user_id").notNull(),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  city: text("city").notNull(),
  primaryContactName: text("primary_contact_name").notNull(),
  primaryContactEmail: text("primary_contact_email").notNull(),
  primaryContactPhone: text("primary_contact_phone"),
  status: text("status").notNull().default("active"),
  accountOwner: text("account_owner").notNull().default("Unassigned"),
  arrInr: integer("arr_inr").notNull().default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const deals = pgTable("deals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerUserId: varchar("owner_user_id").notNull(),
  clientId: varchar("client_id").notNull(),
  title: text("title").notNull(),
  stage: text("stage").notNull().default("qualified"),
  valueInr: integer("value_inr").notNull().default(0),
  positions: integer("positions").notNull().default(1),
  expectedCloseDate: timestamp("expected_close_date"),
  owner: text("owner").notNull().default("Unassigned"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  ownerUserId: true,
}).extend({
  companyName: z.string().trim().min(1, "Company name is required").max(200),
  industry: z.string().trim().min(1).max(100),
  city: z.string().trim().min(1).max(100),
  primaryContactName: z.string().trim().min(1, "Contact name is required").max(150),
  primaryContactEmail: z.string().trim().email("Valid email required").max(200),
  primaryContactPhone: z.string().trim().max(40).optional().nullable(),
  status: z.enum(["active", "renewal", "pursuit", "inactive"]).default("active"),
  accountOwner: z.string().trim().min(1).max(100).default("Unassigned"),
  arrInr: z.number().int().min(0).default(0),
  notes: z.string().trim().max(2000).optional().nullable(),
});
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
  createdAt: true,
  ownerUserId: true,
}).extend({
  clientId: z.string().uuid("Valid client required"),
  title: z.string().trim().min(1, "Deal title is required").max(200),
  stage: z.enum(["qualified", "discovery", "proposal", "negotiation", "won", "lost"]).default("qualified"),
  valueInr: z.number().int().min(0).default(0),
  positions: z.number().int().min(1).default(1),
  owner: z.string().trim().min(1).max(100).default("Unassigned"),
  notes: z.string().trim().max(2000).optional().nullable(),
  expectedCloseDate: z.coerce.date().optional().nullable(),
});
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;

// ─── Onboarding ──────────────────────────────────────────────────────────────
export const onboardings = pgTable("onboardings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id"),
  candidateName: text("candidate_name").notNull(),
  jobTitle: text("job_title").notNull(),
  company: text("company").notNull(),
  status: text("status").notNull().default("Background Check"),
  progress: integer("progress").notNull().default(0),
  etaDays: integer("eta_days").notNull().default(7),
  ownerUserId: varchar("owner_user_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertOnboardingSchema = createInsertSchema(onboardings).omit({
  id: true,
  createdAt: true,
  ownerUserId: true,
}).extend({
  progress: z.number().int().min(0).max(100).default(0),
});
export type InsertOnboarding = z.infer<typeof insertOnboardingSchema>;
export type Onboarding = typeof onboardings.$inferSelect;

// ─── Financials ───────────────────────────────────────────────────────────────
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoice_number").notNull(),
  clientId: varchar("client_id"),
  clientName: text("client_name").notNull(),
  amountInr: integer("amount_inr").notNull(),
  status: text("status").notNull().default("Sent"),
  dueDate: timestamp("due_date").notNull(),
  ownerUserId: varchar("owner_user_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  ownerUserId: true,
}).extend({
  dueDate: z.coerce.date(),
  amountInr: z.number().int().min(0),
});
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

// ─── E-Signatures ─────────────────────────────────────────────────────────────
export const esignatures = pgTable("esignatures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  recipient: text("recipient").notNull(),
  status: text("status").notNull().default("Sent"),
  ownerUserId: varchar("owner_user_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertESignatureSchema = createInsertSchema(esignatures).omit({
  id: true,
  createdAt: true,
  ownerUserId: true,
});
export type InsertESignature = z.infer<typeof insertESignatureSchema>;
export type ESignature = typeof esignatures.$inferSelect;

// ─── Background Checks ────────────────────────────────────────────────────────
export const backgroundChecks = pgTable("background_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  candidateName: text("candidate_name").notNull(),
  provider: text("provider").notNull(),
  status: text("status").notNull().default("Pending"),
  etaDays: integer("eta_days"),
  ownerUserId: varchar("owner_user_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertBackgroundCheckSchema = createInsertSchema(backgroundChecks).omit({
  id: true,
  createdAt: true,
  ownerUserId: true,
});
export type InsertBackgroundCheck = z.infer<typeof insertBackgroundCheckSchema>;
export type BackgroundCheck = typeof backgroundChecks.$inferSelect;

// ─── Emails & Meetings (Inbox & Calendar) ─────────────────────────────────────
export const emails = pgTable("emails", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sender: text("sender").notNull(),
  subject: text("subject").notNull(),
  body: text("body"),
  unread: boolean("unread").notNull().default(true),
  ownerUserId: varchar("owner_user_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertEmailSchema = createInsertSchema(emails).omit({
  id: true,
  createdAt: true,
  ownerUserId: true,
});
export type InsertEmail = z.infer<typeof insertEmailSchema>;
export type EmailMessage = typeof emails.$inferSelect;

export const meetings = pgTable("meetings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(30),
  startTime: timestamp("start_time").notNull(),
  ownerUserId: varchar("owner_user_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertMeetingSchema = createInsertSchema(meetings).omit({
  id: true,
  createdAt: true,
  ownerUserId: true,
});
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Meeting = typeof meetings.$inferSelect;


// ─── AI Recruiter ────────────────────────────────────────────────────────
export const aiEvaluations = pgTable("ai_evaluations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerUserId: varchar("owner_user_id").notNull(),
  candidateName: text("candidate_name").notNull(),
  jobTitle: text("job_title").notNull(),
  jdText: text("jd_text").notNull(),
  resumeText: text("resume_text").notNull(),
  overallScore: integer("overall_score").notNull(),
  skillsScore: integer("skills_score").notNull(),
  experienceScore: integer("experience_score").notNull(),
  cultureScore: integer("culture_score").notNull(),
  integrityScore: integer("integrity_score").notNull(),
  verdict: text("verdict").notNull(),
  summary: text("summary").notNull(),
  strengths: text("strengths").array().notNull().default(sql`'{}'::text[]`),
  redFlags: text("red_flags").array().notNull().default(sql`'{}'::text[]`),
  matchedSkills: text("matched_skills").array().notNull().default(sql`'{}'::text[]`),
  missingSkills: text("missing_skills").array().notNull().default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const aiAssessments = pgTable("ai_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerUserId: varchar("owner_user_id").notNull(),
  title: text("title").notNull(),
  jobTitle: text("job_title").notNull(),
  jdText: text("jd_text").notNull(),
  seniority: text("seniority").notNull().default("mid"),
  durationMinutes: integer("duration_minutes").notNull().default(30),
  questions: jsonb("questions").notNull().default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertAiEvaluationSchema = createInsertSchema(aiEvaluations).omit({
  id: true,
  createdAt: true,
  ownerUserId: true,
}).extend({
  candidateName: z.string().trim().min(1).max(200),
  jobTitle: z.string().trim().min(1).max(200),
  jdText: z.string().trim().min(20).max(20000),
  resumeText: z.string().trim().min(20).max(40000),
});
export type InsertAiEvaluation = z.infer<typeof insertAiEvaluationSchema>;
export type AiEvaluation = typeof aiEvaluations.$inferSelect;

export const aiAssessmentQuestionSchema = z.object({
  q: z.string(),
  options: z.array(z.string()).min(2).max(6),
  correct: z.number().int().min(0),
  explanation: z.string().optional(),
  skill: z.string().optional(),
});
export type AiAssessmentQuestion = z.infer<typeof aiAssessmentQuestionSchema>;

export const generateAssessmentInputSchema = z.object({
  jobTitle: z.string().trim().min(1, "Job title required").max(200),
  jdText: z.string().trim().min(20, "JD too short").max(20000),
  seniority: z.enum(["junior", "mid", "senior", "lead"]).default("mid"),
  numQuestions: z.number().int().min(3).max(20).default(8),
  durationMinutes: z.number().int().min(5).max(180).default(30),
});
export type GenerateAssessmentInput = z.infer<typeof generateAssessmentInputSchema>;

export const scoreCandidateInputSchema = z.object({
  candidateName: z.string().trim().min(1).max(200),
  jobTitle: z.string().trim().min(1).max(200),
  jdText: z.string().trim().min(20).max(20000),
  resumeText: z.string().trim().min(20).max(40000),
});
export type ScoreCandidateInput = z.infer<typeof scoreCandidateInputSchema>;

export type AiAssessment = typeof aiAssessments.$inferSelect;

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull().default("Tilcons Team"),
  readTime: text("read_time").notNull().default("3 min read"),
  published: boolean("published").notNull().default(true),
  publishedDate: timestamp("published_date").notNull().default(sql`now()`),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  publishedDate: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  postedDate: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedDate: true,
  // jobSeekerId is set server-side from the session, never trusted from client.
  jobSeekerId: true,
}).extend({
  source: z.enum(["LinkedIn", "Naukri", "Indeed", "Monster", "Referral", "Direct", "Walk-in", "Other"]).optional().nullable(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  submittedDate: true,
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  submittedDate: true,
  // jobSeekerId is set server-side from the session, never trusted from client.
  jobSeekerId: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Company schemas
export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().trim().min(1, "Company name is required").max(200),
  domain: z.string().trim().max(200).optional().nullable(),
  plan: z.enum(["starter", "pro", "enterprise"]).default("starter"),
});
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

// Schema for onboarding a new company (creates company + company admin user in one step)
export const onboardCompanySchema = z.object({
  companyName: z.string().trim().min(1, "Company name required").max(200),
  domain: z.string().trim().max(200).optional().nullable(),
  plan: z.enum(["starter", "pro", "enterprise"]).default("starter"),
  adminUsername: z.string().trim().min(3, "Min 3 chars").max(50),
  adminPassword: z.string().min(8, "Min 8 characters"),
  adminEmail: z.string().email("Valid email required").max(200),
  adminFullName: z.string().trim().min(1).max(150),
});
export type OnboardCompanyInput = z.infer<typeof onboardCompanySchema>;

// Schema for creating a recruiter inside a company
export const createCompanyUserSchema = z.object({
  username: z.string().trim().min(3).max(50),
  password: z.string().min(8, "Min 8 characters"),
  email: z.string().email().max(200).optional().nullable(),
  fullName: z.string().trim().min(1).max(150),
  role: z.enum(["company_admin", "recruiter"]).default("recruiter"),
});
export type CreateCompanyUserInput = z.infer<typeof createCompanyUserSchema>;

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  submittedDate: true,
});

export const insertJobSeekerSchema = createInsertSchema(jobSeekers).omit({
  id: true,
  createdAt: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
});

export const updateJobSeekerSchema = z.object({
  fullName: z.string().min(1, "Full name is required").optional(),
  phone: z.string().optional().nullable(),
  currentPosition: z.string().optional().nullable(),
  experienceLevel: z.string().optional().nullable(),
});
export type UpdateJobSeeker = z.infer<typeof updateJobSeekerSchema>;

export const jobSeekerLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── VMS Sync ──────────────────────────────────────────────────────────────
export const vmsConnections = pgTable("vms_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  systemName: text("system_name").notNull(),
  clientName: text("client_name").notNull(),
  status: text("status").notNull().default("Pending"),
  syncedRecords: integer("synced_records").notNull().default(0),
  lastSyncAt: timestamp("last_sync_at"),
  notes: text("notes"),
  ownerUserId: varchar("owner_user_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertVmsConnectionSchema = createInsertSchema(vmsConnections).omit({
  id: true,
  createdAt: true,
  ownerUserId: true,
}).extend({
  syncedRecords: z.number().int().min(0).default(0),
  lastSyncAt: z.coerce.date().optional().nullable(),
});
export type InsertVmsConnection = z.infer<typeof insertVmsConnectionSchema>;
export type VmsConnection = typeof vmsConnections.$inferSelect;

// ─── Job Boards ────────────────────────────────────────────────────────────
export const jobBoardPostings = pgTable("job_board_postings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobTitle: text("job_title").notNull(),
  board: text("board").notNull(),
  status: text("status").notNull().default("Pending"),
  applicantsCount: integer("applicants_count").notNull().default(0),
  externalUrl: text("external_url"),
  postedAt: timestamp("posted_at"),
  ownerUserId: varchar("owner_user_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertJobBoardPostingSchema = createInsertSchema(jobBoardPostings).omit({
  id: true,
  createdAt: true,
  ownerUserId: true,
}).extend({
  applicantsCount: z.number().int().min(0).default(0),
  postedAt: z.coerce.date().optional().nullable(),
});
export type InsertJobBoardPosting = z.infer<typeof insertJobBoardPostingSchema>;
export type JobBoardPosting = typeof jobBoardPostings.$inferSelect;

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertJobSeeker = z.infer<typeof insertJobSeekerSchema>;
export type JobSeeker = typeof jobSeekers.$inferSelect;
export type JobSeekerLoginCredentials = z.infer<typeof jobSeekerLoginSchema>;
