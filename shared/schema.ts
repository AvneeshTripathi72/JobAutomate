import { z } from 'zod';

export const USER_ROLES = ['super_admin', 'company_admin', 'recruiter'] as const;
export type UserRole = typeof USER_ROLES[number];

export const APPLICATION_STATUSES = ['new', 'reviewing', 'shortlisted', 'submitted', 'interview', 'offer', 'joined', 'rejected', 'hired'] as const;
export type ApplicationStatus = typeof APPLICATION_STATUSES[number];

export const updateJobSeekerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').optional(),
  phone: z.string().optional().nullable(),
  currentPosition: z.string().optional().nullable(),
  experienceLevel: z.string().optional().nullable(),
  currentSalary: z.string().optional().nullable(),
  expectedSalary: z.string().optional().nullable(),
  noticePeriod: z.string().optional().nullable(),
  skills: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
  portfolioLinks: z.any().optional().nullable(),
});
export type UpdateJobSeeker = z.infer<typeof updateJobSeekerSchema>;

export const jobSeekersSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  currentPosition: z.string().optional(),
  experienceLevel: z.string().optional(),
  currentSalary: z.string().optional(),
  expectedSalary: z.string().optional(),
  noticePeriod: z.string().optional(),
  skills: z.string().optional(),
  education: z.string().optional(),
  createdAt: z.date().optional(),
  isHotlisted: z.boolean().optional(),
  hotlistNotes: z.string().optional().nullable(),
  isShortlisted: z.boolean().optional(),
  status: z.string().optional().nullable(),
  resumeUrl: z.string().optional().nullable(),
  additionalInfo: z.string().optional().nullable(),
});
export const insertJobSeekerSchema = jobSeekersSchema.omit({ id: true });
export const jobSeekerLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type JobSeeker = z.infer<typeof jobSeekersSchema>;
export type InsertJobSeeker = z.infer<typeof insertJobSeekerSchema>;
export type JobSeekerLoginCredentials = z.infer<typeof jobSeekerLoginSchema>;

export const vendorsSchema = z.object({
  id: z.string().optional(),
  companyName: z.string().min(1, 'Company name is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  website: z.string().optional(),
  servicesOffered: z.string(),
  industriesExpertise: z.string(),
  geographicCoverage: z.string(),
  yearsInBusiness: z.number().optional(),
  companyDescription: z.string(),
  partnershipReason: z.string(),
});
export const insertVendorSchema = vendorsSchema.omit({ id: true });
export type Vendor = z.infer<typeof vendorsSchema>;
export type InsertVendor = z.infer<typeof insertVendorSchema>;

export const jobsSchema = z.object({
  id: z.string().optional(),
  companyId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  jobType: z.string(),
  industry: z.string(),
  description: z.string(),
  salary: z.string().optional(),
  postedDate: z.date().optional(),
});
export const insertJobSchema = jobsSchema.omit({ id: true, postedDate: true });
export type Job = z.infer<typeof jobsSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;

export const applicationsSchema = z.object({
  id: z.string().optional(),
  companyId: z.string().optional(),
  jobId: z.string().optional(),
  jobTitle: z.string().optional(),
  applicantName: z.string().min(1, 'Applicant name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  resumeUrl: z.string().optional(),
  coverLetter: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  appliedDate: z.date().optional(),
  source: z.string().optional(),
  jobSeekerId: z.string().optional(),
});
export const insertApplicationSchema = applicationsSchema.omit({ id: true });
export type Application = z.infer<typeof applicationsSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export const contactsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  inquiryType: z.string(),
  message: z.string().min(1, 'Message is required'),
  status: z.string().optional().default('pending'),
});
export const insertContactSchema = contactsSchema.omit({ id: true, status: true });
export type Contact = z.infer<typeof contactsSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginCredentials = z.infer<typeof loginSchema>;

export const articlesSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().optional(),
  readTime: z.string().optional(),
  published: z.boolean().optional(),
  publishedDate: z.date().optional(),
});
export const insertArticleSchema = articlesSchema.omit({ id: true, publishedDate: true });
export type Article = z.infer<typeof articlesSchema>;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export const clientsSchema = z.object({
  id: z.string().optional(),
  companyId: z.string().optional(),
  companyName: z.string().min(1, 'Company name is required'),
  industry: z.string(),
  city: z.string(),
  primaryContactName: z.string(),
  primaryContactEmail: z.string().email(),
  primaryContactPhone: z.string().optional().nullable(),
  status: z.string().optional(),
  accountOwner: z.string().optional().nullable(),
  arrInr: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
});
export type Client = z.infer<typeof clientsSchema>;

export const dealsSchema = z.object({
  id: z.string().optional(),
  clientId: z.string(),
  title: z.string().min(1, 'Title is required'),
  stage: z.string(),
  valueInr: z.number().optional().nullable(),
  positions: z.number().optional().nullable(),
  owner: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});
export type Deal = z.infer<typeof dealsSchema>;

export const companiesSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  domain: z.string().optional().nullable(),
  plan: z.string().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
});
export type Company = z.infer<typeof companiesSchema>;

export const resumesSchema = z.object({
  id: z.string().optional(),
  companyId: z.string().optional().nullable(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  desiredPosition: z.string(),
  yearsExperience: z.number(),
  skills: z.string(),
  linkedIn: z.string().optional().nullable(),
  additionalInfo: z.string().optional().nullable(),
  resumeUrl: z.string().optional().nullable(),
  jobSeekerId: z.string().optional().nullable(),
  submittedDate: z.date().optional(),
});
export type Resume = z.infer<typeof resumesSchema>;

export const interviewSchema = z.object({
  id: z.string(),
  title: z.string(),
  mode: z.string(),
  interviewerName: z.string(),
  interviewerEmail: z.string(),
  scheduledAt: z.date(),
  status: z.string(),
  feedback: z.string(),
});
export type Interview = z.infer<typeof interviewSchema>;

export const submissionSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  status: z.string(),
  submittedAt: z.date(),
  rateOfferedInr: z.number(),
  notes: z.string(),
});
export type Submission = z.infer<typeof submissionSchema>;

export const activitySchema = z.object({
  id: z.string(),
  type: z.string(),
  description: z.string(),
  createdAt: z.date(),
});
export type Activity = z.infer<typeof activitySchema>;

export const backgroundCheckSchema = z.object({
  id: z.string(),
  candidateName: z.string(),
  provider: z.string(),
  status: z.string(),
  etaDays: z.number(),
  createdAt: z.date(),
});
export type BackgroundCheck = z.infer<typeof backgroundCheckSchema>;

export const emailMessageSchema = z.object({
  id: z.string(),
  sender: z.string(),
  subject: z.string(),
  body: z.string(),
  unread: z.boolean(),
  createdAt: z.date(),
});
export type EmailMessage = z.infer<typeof emailMessageSchema>;

export const meetingSchema = z.object({
  id: z.string(),
  title: z.string(),
  startTime: z.date(),
  durationMinutes: z.number(),
});
export type Meeting = z.infer<typeof meetingSchema>;

export const eSignatureSchema = z.object({
  id: z.string(),
  title: z.string(),
  recipient: z.string(),
  status: z.string(),
  createdAt: z.date(),
});
export type ESignature = z.infer<typeof eSignatureSchema>;

export const invoiceSchema = z.object({
  id: z.string(),
  client: z.string(),
  invoiceNumber: z.string(),
  clientName: z.string(),
  amountInr: z.number(),
  status: z.string(),
  dueDate: z.date(),
});
export type Invoice = z.infer<typeof invoiceSchema>;

export const onboardingSchema = z.object({
  id: z.string(),
  candidateName: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  status: z.string(),
  progress: z.number(),
  etaDays: z.number(),
});
export type Onboarding = z.infer<typeof onboardingSchema>;

export const aiAssessmentQuestionSchema = z.object({
  q: z.string(),
  skill: z.string(),
  options: z.array(z.string()),
  correct: z.number(),
  explanation: z.string(),
});
export type AiAssessmentQuestion = z.infer<typeof aiAssessmentQuestionSchema>;

export const aiEvaluationSchema = z.object({
  id: z.string(),
  candidateName: z.string(),
  jobTitle: z.string(),
  verdict: z.enum(["strong_fit", "fit", "weak_fit", "not_fit"]),
  overallScore: z.number(),
  skillsScore: z.number(),
  experienceScore: z.number(),
  cultureScore: z.number(),
  integrityScore: z.number(),
  summary: z.string(),
  strengths: z.array(z.string()),
  matchedSkills: z.array(z.string()),
  redFlags: z.array(z.string()),
  missingSkills: z.array(z.string()),
  createdAt: z.date(),
});
export type AiEvaluation = z.infer<typeof aiEvaluationSchema>;

export const aiAssessmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  seniority: z.enum(["junior", "mid", "senior", "lead"]),
  durationMinutes: z.number(),
  createdAt: z.date(),
  questions: z.array(aiAssessmentQuestionSchema),
});
export type AiAssessment = z.infer<typeof aiAssessmentSchema>;

export const jobBoardPostingsSchema = z.object({
  id: z.string().optional(),
  jobTitle: z.string().min(1, 'Job title is required'),
  board: z.string().min(1, 'Board is required'),
  status: z.string().default('Pending'),
  applicantsCount: z.number().int().min(0).default(0),
  externalUrl: z.string().optional().nullable(),
  postedAt: z.date().optional().nullable(),
  ownerUserId: z.string().optional().nullable(),
  createdAt: z.date().optional(),
});
export const insertJobBoardPostingSchema = jobBoardPostingsSchema.omit({ id: true, createdAt: true, ownerUserId: true });
export type JobBoardPosting = z.infer<typeof jobBoardPostingsSchema>;
export type InsertJobBoardPosting = z.infer<typeof insertJobBoardPostingSchema>;

export const vmsConnectionsSchema = z.object({
  id: z.string().optional(),
  systemName: z.string().min(1, 'System name is required'),
  clientName: z.string().min(1, 'Client name is required'),
  status: z.string().default('Pending'),
  syncedRecords: z.number().int().min(0).default(0),
  lastSyncAt: z.date().optional().nullable(),
  notes: z.string().optional().nullable(),
  ownerUserId: z.string().optional().nullable(),
  createdAt: z.date().optional(),
});
export const insertVmsConnectionSchema = vmsConnectionsSchema.omit({ id: true, createdAt: true, ownerUserId: true });
export type VmsConnection = z.infer<typeof vmsConnectionsSchema>;
export type InsertVmsConnection = z.infer<typeof insertVmsConnectionSchema>;
