import {
  jobs,
  applications,
  contacts,
  resumes,
  users,
  vendors,
  articles,
  clients,
  deals,
  interviews,
  submissions,
  activities,
  aiEvaluations,
  aiAssessments,
  type Job,
  type InsertJob,
  type Application,
  type InsertApplication,
  type Contact,
  type InsertContact,
  type Resume,
  type InsertResume,
  type User,
  type InsertUser,
  type Vendor,
  type InsertVendor,
  type Article,
  type InsertArticle,
  type Client,
  type InsertClient,
  type Deal,
  type InsertDeal,
  type Interview,
  type InsertInterview,
  type Submission,
  type InsertSubmission,
  type Activity,
  type InsertActivity,
  type AiEvaluation,
  type AiAssessment,
  type AiAssessmentQuestion,
  type JobSeeker,
  type UpdateJobSeeker,
  onboardings,
  invoices,
  vmsConnections,
  jobBoardPostings,
  type Onboarding,
  type InsertOnboarding,
  type Invoice,
  type InsertInvoice,
  type VmsConnection,
  type InsertVmsConnection,
  type JobBoardPosting,
  type InsertJobBoardPosting,
  esignatures,
  type ESignature,
  type InsertESignature,
  backgroundChecks,
  type BackgroundCheck,
  type InsertBackgroundCheck,
  emails,
  type EmailMessage,
  type InsertEmail,
  meetings,
  type Meeting,
  type InsertMeeting,
} from "@shared/schema";
import { db } from "./db";
import { and, desc, eq, gte, ilike, or, sql, count, countDistinct, type SQL } from "drizzle-orm";
import { jobSeekers } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";

const MemoryStore = createMemoryStore(session);
const PgSession = connectPgSimple(session);

export interface PublicStats {
  activeJobs: number;
  partnerCompanies: number;
  registeredCandidates: number;
  successfulPlacements: number;
  publishedArticles: number;
  industriesCovered: number;
}

export interface IStorage {
  // Stats
  getPublicStats(): Promise<PublicStats>;

  // Jobs
  getAllJobs(): Promise<Job[]>;
  getJobById(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, job: InsertJob): Promise<Job | undefined>;
  deleteJob(id: string): Promise<boolean>;
  searchJobs(query: string, industry?: string): Promise<Job[]>;

  // Applications
  createApplication(application: InsertApplication, jobSeekerId?: number): Promise<Application>;
  getApplicationsByJobSeekerId(jobSeekerId: number): Promise<Application[]>;
  getApplicationsByJobId(jobId: string): Promise<Application[]>;
  getAllApplications(): Promise<Application[]>;
  updateApplicationStatus(id: string, status: string, notes?: string): Promise<Application | undefined>;

  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;

  // Resumes
  createResume(resume: InsertResume, jobSeekerId?: number): Promise<Resume>;
  getAllResumes(): Promise<Resume[]>;
  getResumesByEmail(email: string): Promise<Resume[]>;
  getResumesByJobSeekerId(jobSeekerId: number): Promise<Resume[]>;

  // Users
  createUser(user: InsertUser): Promise<User>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;

  // Vendors
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  getAllVendors(): Promise<Vendor[]>;

  // Articles
  getAllArticles(): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;

  // CRM — Clients (scoped to owner)
  getAllClients(ownerUserId: string): Promise<Client[]>;
  getClientById(id: string, ownerUserId: string): Promise<Client | undefined>;
  createClient(client: InsertClient, ownerUserId: string): Promise<Client>;
  updateClient(id: string, ownerUserId: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string, ownerUserId: string): Promise<boolean>;

  // CRM — Deals (scoped to owner)
  getAllDeals(ownerUserId: string): Promise<Deal[]>;
  createDeal(deal: InsertDeal, ownerUserId: string): Promise<Deal>;
  updateDeal(id: string, ownerUserId: string, deal: Partial<InsertDeal>): Promise<Deal | undefined>;
  deleteDeal(id: string, ownerUserId: string): Promise<boolean>;

  // Interviews (admin-only)
  getInterviewsByApplicationId(applicationId: string): Promise<Interview[]>;
  getAllInterviews(): Promise<Interview[]>;
  createInterview(input: InsertInterview): Promise<Interview>;
  updateInterview(id: string, updates: Partial<InsertInterview>): Promise<Interview | undefined>;
  deleteInterview(id: string): Promise<boolean>;

  // Submissions (scoped per owner)
  getSubmissionsByApplicationId(applicationId: string, ownerUserId: string): Promise<Submission[]>;
  getAllSubmissions(ownerUserId: string): Promise<Submission[]>;
  createSubmission(input: InsertSubmission, ownerUserId: string): Promise<Submission | undefined>;
  updateSubmission(id: string, ownerUserId: string, updates: Partial<InsertSubmission>): Promise<Submission | undefined>;
  deleteSubmission(id: string, ownerUserId: string): Promise<boolean>;

  // Activities (admin-only timeline)
  getActivitiesByApplicationId(applicationId: string): Promise<Activity[]>;
  createActivity(input: InsertActivity, createdByUserId?: string | null): Promise<Activity>;

  // Hotlist
  setJobSeekerHotlist(id: number, isHotlisted: boolean, hotlistNotes?: string | null): Promise<JobSeeker | undefined>;
  getHotlistedJobSeekers(): Promise<JobSeeker[]>;
  updateJobSeeker(id: number, updates: Partial<UpdateJobSeeker>): Promise<JobSeeker | undefined>;

  // AI Recruiter (scoped per owner)
  createAiEvaluation(input: Omit<AiEvaluation, "id" | "createdAt">): Promise<AiEvaluation>;
  getAiEvaluations(ownerUserId: string): Promise<AiEvaluation[]>;
  getAiEvaluationById(id: string, ownerUserId: string): Promise<AiEvaluation | undefined>;
  deleteAiEvaluation(id: string, ownerUserId: string): Promise<boolean>;

  createAiAssessment(input: { ownerUserId: string; title: string; jobTitle: string; jdText: string; seniority: string; durationMinutes: number; questions: AiAssessmentQuestion[] }): Promise<AiAssessment>;
  getAiAssessments(ownerUserId: string): Promise<AiAssessment[]>;
  getAiAssessmentById(id: string, ownerUserId: string): Promise<AiAssessment | undefined>;
  deleteAiAssessment(id: string, ownerUserId: string): Promise<boolean>;

  // Onboardings (scoped per owner)
  getAllOnboardings(ownerUserId: string): Promise<Onboarding[]>;
  createOnboarding(input: InsertOnboarding, ownerUserId: string): Promise<Onboarding>;
  updateOnboarding(id: string, ownerUserId: string, updates: Partial<InsertOnboarding>): Promise<Onboarding | undefined>;
  deleteOnboarding(id: string, ownerUserId: string): Promise<boolean>;

  // Invoices (scoped per owner)
  getAllInvoices(ownerUserId: string): Promise<Invoice[]>;
  createInvoice(input: InsertInvoice, ownerUserId: string): Promise<Invoice>;
  updateInvoice(id: string, ownerUserId: string, updates: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: string, ownerUserId: string): Promise<boolean>;

  // VMS Connections (scoped per owner)
  getAllVmsConnections(ownerUserId: string): Promise<VmsConnection[]>;
  createVmsConnection(input: InsertVmsConnection, ownerUserId: string): Promise<VmsConnection>;
  updateVmsConnection(id: string, ownerUserId: string, updates: Partial<InsertVmsConnection>): Promise<VmsConnection | undefined>;
  deleteVmsConnection(id: string, ownerUserId: string): Promise<boolean>;

  // Job Board Postings (scoped per owner)
  getAllJobBoardPostings(ownerUserId: string): Promise<JobBoardPosting[]>;
  createJobBoardPosting(input: InsertJobBoardPosting, ownerUserId: string): Promise<JobBoardPosting>;
  updateJobBoardPosting(id: string, ownerUserId: string, updates: Partial<InsertJobBoardPosting>): Promise<JobBoardPosting | undefined>;
  deleteJobBoardPosting(id: string, ownerUserId: string): Promise<boolean>;

  // E-Signatures (scoped per owner)
  getAllESignatures(ownerUserId: string): Promise<ESignature[]>;
  createESignature(input: InsertESignature, ownerUserId: string): Promise<ESignature>;
  updateESignature(id: string, ownerUserId: string, updates: Partial<InsertESignature>): Promise<ESignature | undefined>;
  deleteESignature(id: string, ownerUserId: string): Promise<boolean>;

  // Background Checks (scoped per owner)
  getAllBackgroundChecks(ownerUserId: string): Promise<BackgroundCheck[]>;
  createBackgroundCheck(input: InsertBackgroundCheck, ownerUserId: string): Promise<BackgroundCheck>;
  updateBackgroundCheck(id: string, ownerUserId: string, updates: Partial<InsertBackgroundCheck>): Promise<BackgroundCheck | undefined>;
  deleteBackgroundCheck(id: string, ownerUserId: string): Promise<boolean>;

  // Emails (scoped per owner)
  getAllEmails(ownerUserId: string): Promise<EmailMessage[]>;
  createEmail(input: InsertEmail, ownerUserId: string): Promise<EmailMessage>;
  updateEmail(id: string, ownerUserId: string, updates: Partial<InsertEmail>): Promise<EmailMessage | undefined>;
  deleteEmail(id: string, ownerUserId: string): Promise<boolean>;

  // Meetings (scoped per owner)
  getAllMeetings(ownerUserId: string): Promise<Meeting[]>;
  createMeeting(input: InsertMeeting, ownerUserId: string): Promise<Meeting>;
  updateMeeting(id: string, ownerUserId: string, updates: Partial<InsertMeeting>): Promise<Meeting | undefined>;
  deleteMeeting(id: string, ownerUserId: string): Promise<boolean>;

  // Session store
  sessionStore: session.Store;
}

const SEED_JOBS: InsertJob[] = [
  { title: "Manufacturing Supervisor", company: "Advanced Manufacturing Co.", location: "Pune, India", jobType: "Full-time", industry: "Manufacturing", description: "Lead production teams and ensure quality standards are met in our state-of-the-art facility. Requires 5+ years of manufacturing experience.", salary: "₹8L - ₹12L" },
  { title: "Registered Nurse", company: "City Medical Center", location: "Bangalore, India", jobType: "Full-time", industry: "Healthcare", description: "Provide exceptional patient care in our award-winning healthcare facility. Current RN license required.", salary: "₹6L - ₹9L" },
  { title: "Full Stack Developer", company: "Digital Solutions Ltd.", location: "Noida, India", jobType: "Contract", industry: "Technology", description: "Build modern web applications using React, Node.js, and cloud technologies. 3+ years experience required.", salary: "₹10L - ₹18L" },
  { title: "Financial Analyst", company: "Global Finance Corp", location: "Bangalore, India", jobType: "Full-time", industry: "Finance", description: "Analyze financial data and provide strategic insights to senior management. CPA or CFA preferred.", salary: "₹9L - ₹15L" },
  { title: "Executive Assistant", company: "Corporate Headquarters Inc.", location: "Noida, India", jobType: "Full-time", industry: "Administrative", description: "Support C-level executives with calendar management, travel coordination, and administrative tasks.", salary: "₹4L - ₹7L" },
  { title: "Warehouse Manager", company: "Logistics Express", location: "Pune, India", jobType: "Full-time", industry: "Logistics", description: "Oversee warehouse operations, inventory management, and team coordination. Experience with WMS required.", salary: "₹6L - ₹10L" },
];

const SEED_ARTICLES: InsertArticle[] = [
  {
    title: "How to Write a CV That Stands Out in 2025",
    category: "Career Advice",
    excerpt: "Your CV is your first impression. Follow these expert tips to make recruiters take notice from line one.",
    content: `A strong CV is your ticket to landing an interview. In today's competitive job market, recruiters spend an average of just 7 seconds scanning each application — so yours needs to make an immediate impact.\n\nKeep it concise. Aim for 1–2 pages maximum, focusing only on experience and achievements relevant to the role you're applying for.\n\nUse strong action verbs. Begin each bullet point with words like "led," "delivered," "achieved," or "improved" to demonstrate impact rather than just listing responsibilities.\n\nQuantify your achievements. Numbers stand out. Instead of "managed a team," write "managed a team of 12 engineers, reducing delivery time by 30%."\n\nTailor every application. A generic CV rarely gets through. Read the job description carefully and mirror the language and priorities the employer uses.\n\nInclude relevant keywords. Many companies use applicant tracking systems (ATS) that filter CVs before a human ever reads them. Include keywords from the job posting naturally throughout your CV.\n\nProofread ruthlessly. Spelling mistakes and grammatical errors signal carelessness. Always have a second person review your CV before you submit.`,
    author: "Tilcons Team",
    readTime: "4 min read",
    published: true,
  },
  {
    title: "The 5 Skills Employers Are Looking for Right Now",
    category: "Hiring Insights",
    excerpt: "From technical expertise to emotional intelligence, discover what today's top companies prioritise in candidates.",
    content: `The job market is evolving rapidly, and what employers want has shifted significantly over the past few years. While technical skills remain important, hiring managers are placing greater emphasis on a broader set of competencies.\n\n1. Adaptability. The ability to pivot quickly, learn new tools, and embrace change is now one of the most sought-after traits across every industry. Companies need people who thrive in uncertainty.\n\n2. Digital Literacy. Even in non-technical roles, comfort with digital tools, data analysis, and collaboration platforms is now expected. Familiarity with AI tools is a growing differentiator.\n\n3. Communication. Clear, concise communication — both written and verbal — remains a top priority. In hybrid and remote environments, the ability to articulate ideas clearly is more critical than ever.\n\n4. Problem-Solving. Employers want candidates who can identify issues, think critically, and propose practical solutions without needing constant guidance.\n\n5. Emotional Intelligence. The ability to understand and manage your own emotions, and empathise with colleagues and clients, is increasingly valued at all levels — especially in leadership roles.\n\nFocus your CV and interview preparation on demonstrating these competencies with concrete examples from your experience.`,
    author: "Tilcons Team",
    readTime: "3 min read",
    published: true,
  },
  {
    title: "15 Things You Should Never Do in an Interview",
    category: "Interview Tips",
    excerpt: "You've landed the interview — now make sure you don't self-sabotage. Avoid these common mistakes.",
    content: `You've worked hard to get to the interview stage. Don't let a preventable mistake cost you the opportunity. Here are 15 things you should never do:\n\n1. Arrive late. Plan to arrive 10–15 minutes early. Account for traffic, parking, and reception delays.\n\n2. Fail to research the company. Not knowing the company's business, recent news, or culture signals a lack of genuine interest.\n\n3. Dress inappropriately. When in doubt, overdress. First impressions are visual.\n\n4. Speak negatively about past employers. It always reflects worse on you than on them.\n\n5. Check your phone. Put it on silent and keep it out of sight.\n\n6. Give vague, unprepared answers. Use the STAR method (Situation, Task, Action, Result) for behavioural questions.\n\n7. Lie or exaggerate on your CV. Employers verify credentials, and dishonesty ends careers.\n\n8. Fail to prepare questions. "No questions" signals disinterest. Prepare 3–5 thoughtful questions.\n\n9. Forget to make eye contact. It builds trust and signals confidence.\n\n10. Ramble. Structure your answers, be concise, and know when to stop talking.\n\n11. Discuss salary too early. Wait until the employer raises compensation or you have an offer.\n\n12. Show desperation. Confidence and enthusiasm are attractive; desperation is not.\n\n13. Forget to bring copies of your CV. Always bring 2–3 printed copies.\n\n14. Overlook body language. Sit up straight, smile, and avoid crossing your arms.\n\n15. Forget to follow up. Send a brief, professional thank-you email within 24 hours.`,
    author: "Tilcons Team",
    readTime: "5 min read",
    published: true,
  },
  {
    title: "Understanding Contract-to-Hire: Is It Right for You?",
    category: "Career Advice",
    excerpt: "Contract-to-hire roles offer flexibility and a trial period for both candidates and employers. Here's what you need to know.",
    content: `Contract-to-hire arrangements are becoming increasingly popular, especially in technology, finance, and specialised sectors. But what exactly are they, and should you consider one?\n\nWhat is contract-to-hire? A contract-to-hire role is a position where you initially work as a contractor for a defined period — typically 3 to 12 months — after which the employer has the option to convert you to a permanent employee.\n\nBenefits for candidates:\n- Try before you buy: You get to evaluate the company culture, team, and role before committing long-term.\n- Higher day rates: Contract roles often pay more per hour/day than equivalent permanent roles.\n- Faster start dates: Contract positions frequently have shorter hiring processes.\n- Skill building: Exposure to different environments accelerates your professional development.\n\nThings to consider:\n- Benefits uncertainty: You may not receive the same benefits (pension, healthcare) as permanent employees during the contract period.\n- Job security: If the role isn't converted, you'll need to find your next position.\n- Tax implications: Contracting has different tax obligations depending on your jurisdiction.\n\nOur advice: Contract-to-hire is an excellent option if you're open to evaluating a role before committing, or if you want to expand your experience across different organisations. Speak to a Tilcons consultant to find contract-to-hire roles that match your profile.`,
    author: "Tilcons Team",
    readTime: "4 min read",
    published: true,
  },
  {
    title: "How to Negotiate Your Salary with Confidence",
    category: "Career Advice",
    excerpt: "Many candidates leave money on the table by not negotiating. Here's how to approach the conversation professionally.",
    content: `Salary negotiation is one of the most uncomfortable conversations for many candidates — but it's one of the most important. Studies consistently show that candidates who negotiate earn significantly more over their careers.\n\nDo your research first. Use salary benchmarking tools and industry reports to understand the market rate for your role, experience level, and location. Knowledge is your strongest asset in a negotiation.\n\nWait for the right moment. Let the employer make the first offer whenever possible. Once an offer is made, you have a baseline to work from.\n\nAnchor high, but be realistic. Counter with a number slightly above your target, giving yourself room to land where you want. Avoid lowballing yourself.\n\nFocus on total compensation. Salary is just one component. Consider bonus potential, equity, healthcare, pension, remote work flexibility, and professional development budget.\n\nBe professional and positive. Approach the conversation as a collaborative discussion, not a confrontation. Express gratitude for the offer and enthusiasm for the role before negotiating.\n\nPractice out loud. Rehearse the conversation so you feel confident when it matters. Role-play with a friend or career coach.\n\nKnow your walk-away number. Decide in advance the minimum you'll accept. If an offer falls below that, be prepared to decline respectfully.`,
    author: "Tilcons Team",
    readTime: "5 min read",
    published: true,
  },
  {
    title: "Top Hiring Trends Shaping the Workforce in 2025",
    category: "Hiring Insights",
    excerpt: "From AI-assisted recruitment to skills-based hiring, here are the trends every employer and job seeker should know.",
    content: `The recruitment landscape is transforming faster than ever. Whether you're a hiring manager or a job seeker, understanding these trends will give you a competitive edge.\n\n1. Skills-based hiring is replacing degree requirements. More companies are removing degree requirements in favour of demonstrated skills and portfolios. This opens doors for candidates from non-traditional backgrounds.\n\n2. AI in recruitment is accelerating. Applicant tracking systems powered by AI are now screening CVs, scheduling interviews, and even conducting initial assessments. Candidates should optimise their CVs for ATS compatibility.\n\n3. Remote and hybrid work remains standard. Most professional roles now offer some form of flexible working. Candidates increasingly factor this into their decision-making.\n\n4. Speed is a competitive advantage. The best candidates are often off the market within 10 days. Companies with slow hiring processes lose top talent to faster-moving competitors.\n\n5. Employer brand matters more than ever. Candidates research companies thoroughly before applying. A strong online presence, positive reviews, and a clear value proposition are essential.\n\n6. Diversity, Equity, and Inclusion (DEI) is a differentiator. Candidates — especially younger ones — prioritise employers who demonstrate genuine commitment to inclusive practices.\n\nFor employers, partnering with an experienced recruitment firm like Tilcons ensures you stay ahead of these trends and access top talent efficiently.`,
    author: "Tilcons Team",
    readTime: "4 min read",
    published: true,
  },
];

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;
  private dbAvailable = true;

  constructor() {
    // Use a Postgres-backed session store whenever a DATABASE_URL is available.
    // This ensures sessions persist across Node.js restarts on any hosting
    // provider (Bluehost VPS, Vercel, etc.). Fall back to in-memory only when
    // no database is configured (e.g. purely local development without DB).
    if (process.env.DATABASE_URL) {
      this.sessionStore = new PgSession({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
        tableName: "session",
      });
    } else {
      this.sessionStore = new MemoryStore({ checkPeriod: 86400000 });
    }
  }

  private isEndpointDisabledError(err: unknown): boolean {
    if (err instanceof Error) {
      if (err.message?.includes("endpoint has been disabled")) return true;
      const cause = (err as NodeJS.ErrnoException & { cause?: unknown }).cause;
      if (cause instanceof Error && cause.message?.includes("endpoint has been disabled")) return true;
    }
    return false;
  }

  /** Read-only paths — returns fallback only when DB endpoint is disabled. All other errors re-throw. */
  private async withDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    if (!this.dbAvailable) return fallback;
    try {
      return await fn();
    } catch (err: unknown) {
      if (this.isEndpointDisabledError(err)) {
        this.dbAvailable = false;
        console.warn("[storage] Database endpoint disabled — switching to offline mode.");
        return fallback;
      }
      throw err;
    }
  }

  /** Write paths — throws a 503-appropriate error when DB is offline. */
  private async withDbWrite<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.dbAvailable) {
      throw Object.assign(new Error("Database is currently unavailable. Please try again later."), { status: 503 });
    }
    try {
      return await fn();
    } catch (err: unknown) {
      if (this.isEndpointDisabledError(err)) {
        this.dbAvailable = false;
        console.warn("[storage] Database endpoint disabled — switching to offline mode.");
        throw Object.assign(new Error("Database is currently unavailable. Please try again later."), { status: 503 });
      }
      throw err;
    }
  }

  // ─── Stats ──────────────────────────────────────────────────────────────
  async getPublicStats(): Promise<PublicStats> {
    return this.withDb(async () => {
      const [jobsCountRow] = await db.select({ value: count() }).from(jobs);
      const [companiesRow] = await db.select({ value: countDistinct(jobs.company) }).from(jobs);
      const [industriesRow] = await db.select({ value: countDistinct(jobs.industry) }).from(jobs);
      const [candidatesRow] = await db.select({ value: count() }).from(jobSeekers);
      const [resumesRow] = await db.select({ value: count() }).from(resumes);
      const [hiredRow] = await db
        .select({ value: count() })
        .from(applications)
        .where(eq(applications.status, "hired"));
      const [articlesRow] = await db
        .select({ value: count() })
        .from(articles)
        .where(eq(articles.published, true));

      const registered = (candidatesRow?.value ?? 0) + (resumesRow?.value ?? 0);

      return {
        activeJobs: jobsCountRow?.value ?? 0,
        partnerCompanies: companiesRow?.value ?? 0,
        registeredCandidates: registered,
        successfulPlacements: hiredRow?.value ?? 0,
        publishedArticles: articlesRow?.value ?? 0,
        industriesCovered: industriesRow?.value ?? 0,
      };
    }, { activeJobs: 0, partnerCompanies: 0, registeredCandidates: 0, successfulPlacements: 0, publishedArticles: 0, industriesCovered: 0 });
  }

  // Awaited from server bootstrap before listen — guarantees seed data is in
  // place before serving requests, and avoids any seed race on first boot.
  async init() {
    try {
      const existingJobs = await db.select({ id: jobs.id }).from(jobs).limit(1);
      if (existingJobs.length === 0) {
        await db.insert(jobs).values(SEED_JOBS);
        console.log(`Seeded ${SEED_JOBS.length} jobs.`);
      }
      const existingArticles = await db.select({ id: articles.id }).from(articles).limit(1);
      if (existingArticles.length === 0) {
        await db.insert(articles).values(SEED_ARTICLES);
        console.log(`Seeded ${SEED_ARTICLES.length} articles.`);
      }
    } catch (err: any) {
      console.error("Seeding error:", err);
      if (err?.message?.includes("endpoint has been disabled") || err?.cause?.message?.includes("endpoint has been disabled")) {
        this.dbAvailable = false;
        console.warn("[storage] Database endpoint disabled — running in offline mode. Data will not persist.");
      }
    }
  }

  // ─── Jobs ───────────────────────────────────────────────────────────────
  async getAllJobs(): Promise<Job[]> {
    return this.withDb(() => db.select().from(jobs).orderBy(desc(jobs.postedDate)), []);
  }

  async getJobById(id: string): Promise<Job | undefined> {
    return this.withDb(async () => {
      const [row] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
      return row;
    }, undefined);
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(jobs).values({ ...insertJob, salary: insertJob.salary || null }).returning();
      return row;
    });
  }

  async updateJob(id: string, insertJob: InsertJob): Promise<Job | undefined> {
    return this.withDbWrite(async () => {
      const [row] = await db.update(jobs).set({ ...insertJob, salary: insertJob.salary || null }).where(eq(jobs.id, id)).returning();
      return row;
    });
  }

  async deleteJob(id: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      // Cascade: remove all applications attached to this job first so we
      // don't leave orphaned rows pointing at a non-existent jobId.
      await db.delete(applications).where(eq(applications.jobId, id));
      const result = await db.delete(jobs).where(eq(jobs.id, id)).returning({ id: jobs.id });
      return result.length > 0;
    });
  }

  async searchJobs(query: string, industry?: string): Promise<Job[]> {
    return this.withDb(async () => {
      const conditions: SQL[] = [];
      if (query) {
        const like = `%${query}%`;
        const textMatch = or(ilike(jobs.title, like), ilike(jobs.company, like), ilike(jobs.description, like));
        if (textMatch) conditions.push(textMatch);
      }
      if (industry) conditions.push(eq(jobs.industry, industry));
      if (conditions.length === 0) return await this.getAllJobs();
      return await db.select().from(jobs).where(and(...conditions)).orderBy(desc(jobs.postedDate));
    }, []);
  }

  // ─── Applications ───────────────────────────────────────────────────────
  async createApplication(
    insertApplication: InsertApplication,
    jobSeekerId?: number,
  ): Promise<Application> {
    return this.withDbWrite(async () => {
      const [row] = await db
        .insert(applications)
        .values({
          jobId: insertApplication.jobId,
          jobTitle: insertApplication.jobTitle,
          applicantName: insertApplication.applicantName,
          email: insertApplication.email,
          phone: insertApplication.phone || null,
          resumeUrl: insertApplication.resumeUrl || null,
          coverLetter: insertApplication.coverLetter || null,
          status: insertApplication.status || "new",
          notes: insertApplication.notes || null,
          jobSeekerId: jobSeekerId ?? null,
        })
        .returning();
      return row;
    });
  }

  // Returns ONLY applications whose verified-ownership FK matches the
  // authenticated jobseeker. Email-keyed lookups are never used because
  // registration does not verify email ownership.
  async getApplicationsByJobSeekerId(jobSeekerId: number): Promise<Application[]> {
    return this.withDb(() => db.select().from(applications).where(eq(applications.jobSeekerId, jobSeekerId)).orderBy(desc(applications.appliedDate)), []);
  }

  async getApplicationsByJobId(jobId: string): Promise<Application[]> {
    return this.withDb(() => db.select().from(applications).where(eq(applications.jobId, jobId)).orderBy(desc(applications.appliedDate)), []);
  }

  async getAllApplications(): Promise<Application[]> {
    return this.withDb(() => db.select().from(applications).orderBy(desc(applications.appliedDate)), []);
  }

  async updateApplicationStatus(id: string, status: string, notes?: string): Promise<Application | undefined> {
    return this.withDbWrite(async () => {
      const updateValues: { status: string; notes?: string } = { status };
      if (notes !== undefined) updateValues.notes = notes;
      const [row] = await db.update(applications).set(updateValues).where(eq(applications.id, id)).returning();
      return row;
    });
  }

  // ─── Contacts ───────────────────────────────────────────────────────────
  async createContact(insertContact: InsertContact): Promise<Contact> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(contacts).values({ ...insertContact, phone: insertContact.phone || null }).returning();
      return row;
    });
  }

  // ─── Resumes ────────────────────────────────────────────────────────────
  async createResume(insertResume: InsertResume, jobSeekerId?: number): Promise<Resume> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(resumes).values({
        ...insertResume,
        linkedIn: insertResume.linkedIn || null,
        additionalInfo: insertResume.additionalInfo || null,
        jobSeekerId: jobSeekerId ?? null,
      }).returning();
      return row;
    });
  }

  async getResumesByJobSeekerId(jobSeekerId: number): Promise<Resume[]> {
    return this.withDb(() => db.select().from(resumes).where(eq(resumes.jobSeekerId, jobSeekerId)).orderBy(desc(resumes.submittedDate)), []);
  }

  async getAllResumes(): Promise<Resume[]> {
    return this.withDb(() => db.select().from(resumes).orderBy(desc(resumes.submittedDate)), []);
  }

  async getResumesByEmail(email: string): Promise<Resume[]> {
    return this.withDb(async () => {
      const all = await db.select().from(resumes).orderBy(desc(resumes.submittedDate));
      return all.filter((r) => r.email.toLowerCase() === email.toLowerCase());
    }, []);
  }

  // ─── Users ──────────────────────────────────────────────────────────────
  async createUser(insertUser: InsertUser): Promise<User> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(users).values(insertUser).returning();
      return row;
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.withDb(async () => {
      const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return row;
    }, undefined);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.withDb(async () => {
      const [row] = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return row;
    }, undefined);
  }

  // ─── Vendors ────────────────────────────────────────────────────────────
  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(vendors).values({ ...insertVendor, website: insertVendor.website || null }).returning();
      return row;
    });
  }

  async getAllVendors(): Promise<Vendor[]> {
    return this.withDb(() => db.select().from(vendors).orderBy(desc(vendors.submittedDate)), []);
  }

  // ─── Articles ───────────────────────────────────────────────────────────
  async getAllArticles(): Promise<Article[]> {
    return this.withDb(() => db.select().from(articles).orderBy(desc(articles.publishedDate)), []);
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    return this.withDb(async () => {
      const [row] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
      return row;
    }, undefined);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(articles).values({
        ...insertArticle,
        author: insertArticle.author ?? "Tilcons Team",
        readTime: insertArticle.readTime ?? "3 min read",
        published: insertArticle.published ?? true,
      }).returning();
      return row;
    });
  }

  async updateArticle(id: string, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    return this.withDbWrite(async () => {
      const [row] = await db.update(articles).set(updates).where(eq(articles.id, id)).returning();
      return row;
    });
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      const result = await db.delete(articles).where(eq(articles.id, id)).returning({ id: articles.id });
      return result.length > 0;
    });
  }

  // ─── CRM · Clients (scoped per owner) ───────────────────────────────────
  async getAllClients(ownerUserId: string): Promise<Client[]> {
    return this.withDb(() => db.select().from(clients).where(eq(clients.ownerUserId, ownerUserId)).orderBy(desc(clients.createdAt)), []);
  }
  async getClientById(id: string, ownerUserId: string): Promise<Client | undefined> {
    return this.withDb(async () => {
      const [row] = await db.select().from(clients).where(and(eq(clients.id, id), eq(clients.ownerUserId, ownerUserId))).limit(1);
      return row;
    }, undefined);
  }
  async createClient(insertClient: InsertClient, ownerUserId: string): Promise<Client> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(clients).values({
        ...insertClient,
        ownerUserId,
        primaryContactPhone: insertClient.primaryContactPhone || null,
        notes: insertClient.notes || null,
      }).returning();
      return row;
    });
  }
  async updateClient(id: string, ownerUserId: string, updates: Partial<InsertClient>): Promise<Client | undefined> {
    return this.withDbWrite(async () => {
      const [row] = await db.update(clients).set(updates).where(and(eq(clients.id, id), eq(clients.ownerUserId, ownerUserId))).returning();
      return row;
    });
  }
  async deleteClient(id: string, ownerUserId: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      await db.delete(deals).where(and(eq(deals.clientId, id), eq(deals.ownerUserId, ownerUserId)));
      const result = await db.delete(clients).where(and(eq(clients.id, id), eq(clients.ownerUserId, ownerUserId))).returning({ id: clients.id });
      return result.length > 0;
    });
  }

  // ─── CRM · Deals (scoped per owner) ─────────────────────────────────────
  async getAllDeals(ownerUserId: string): Promise<Deal[]> {
    return this.withDb(() => db.select().from(deals).where(eq(deals.ownerUserId, ownerUserId)).orderBy(desc(deals.createdAt)), []);
  }
  async createDeal(insertDeal: InsertDeal, ownerUserId: string): Promise<Deal> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(deals).values({
        ...insertDeal,
        ownerUserId,
        expectedCloseDate: insertDeal.expectedCloseDate ?? null,
        notes: insertDeal.notes || null,
      }).returning();
      return row;
    });
  }
  async updateDeal(id: string, ownerUserId: string, updates: Partial<InsertDeal>): Promise<Deal | undefined> {
    return this.withDbWrite(async () => {
      // If the caller is changing clientId, verify the new client belongs to
      // this owner so a deal can never be reparented onto someone else's client.
      if (updates.clientId) {
        const [owned] = await db.select({ id: clients.id }).from(clients)
          .where(and(eq(clients.id, updates.clientId), eq(clients.ownerUserId, ownerUserId)))
          .limit(1);
        if (!owned) return undefined;
      }
      const [row] = await db.update(deals).set(updates).where(and(eq(deals.id, id), eq(deals.ownerUserId, ownerUserId))).returning();
      return row;
    });
  }
  async deleteDeal(id: string, ownerUserId: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      const result = await db.delete(deals).where(and(eq(deals.id, id), eq(deals.ownerUserId, ownerUserId))).returning({ id: deals.id });
      return result.length > 0;
    });
  }

  // ─── Interviews ─────────────────────────────────────────────────────────
  async getInterviewsByApplicationId(applicationId: string): Promise<Interview[]> {
    return this.withDb(() => db.select().from(interviews).where(eq(interviews.applicationId, applicationId)).orderBy(desc(interviews.scheduledAt)), []);
  }
  async getAllInterviews(): Promise<Interview[]> {
    return this.withDb(() => db.select().from(interviews).orderBy(desc(interviews.scheduledAt)), []);
  }
  async createInterview(input: InsertInterview): Promise<Interview> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(interviews).values({
        applicationId: input.applicationId,
        scheduledAt: input.scheduledAt,
        mode: input.mode,
        interviewerName: input.interviewerName,
        interviewerEmail: input.interviewerEmail || null,
        status: input.status,
        feedback: input.feedback || null,
      }).returning();
      return row;
    });
  }
  async updateInterview(id: string, updates: Partial<InsertInterview>): Promise<Interview | undefined> {
    return this.withDbWrite(async () => {
      const [row] = await db.update(interviews).set(updates).where(eq(interviews.id, id)).returning();
      return row;
    });
  }
  async deleteInterview(id: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      const result = await db.delete(interviews).where(eq(interviews.id, id)).returning({ id: interviews.id });
      return result.length > 0;
    });
  }

  // ─── Submissions (per-owner) ────────────────────────────────────────────
  async getSubmissionsByApplicationId(applicationId: string, ownerUserId: string): Promise<Submission[]> {
    return this.withDb(() => db.select().from(submissions).where(and(eq(submissions.applicationId, applicationId), eq(submissions.ownerUserId, ownerUserId))).orderBy(desc(submissions.submittedAt)), []);
  }
  async getAllSubmissions(ownerUserId: string): Promise<Submission[]> {
    return this.withDb(() => db.select().from(submissions).where(eq(submissions.ownerUserId, ownerUserId)).orderBy(desc(submissions.submittedAt)), []);
  }
  async createSubmission(input: InsertSubmission, ownerUserId: string): Promise<Submission | undefined> {
    return this.withDbWrite(async () => {
      // Verify the client belongs to this owner before creating the submission.
      const [owned] = await db.select({ id: clients.id }).from(clients)
        .where(and(eq(clients.id, input.clientId), eq(clients.ownerUserId, ownerUserId)))
        .limit(1);
      if (!owned) return undefined;
      const [row] = await db.insert(submissions).values({
        applicationId: input.applicationId,
        clientId: input.clientId,
        ownerUserId,
        status: input.status,
        rateOfferedInr: input.rateOfferedInr ?? null,
        notes: input.notes || null,
      }).returning();
      return row;
    });
  }
  async updateSubmission(id: string, ownerUserId: string, updates: Partial<InsertSubmission>): Promise<Submission | undefined> {
    return this.withDbWrite(async () => {
      if (updates.clientId) {
        const [owned] = await db.select({ id: clients.id }).from(clients)
          .where(and(eq(clients.id, updates.clientId), eq(clients.ownerUserId, ownerUserId)))
          .limit(1);
        if (!owned) return undefined;
      }
      const [row] = await db.update(submissions).set(updates).where(and(eq(submissions.id, id), eq(submissions.ownerUserId, ownerUserId))).returning();
      return row;
    });
  }
  async deleteSubmission(id: string, ownerUserId: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      const result = await db.delete(submissions).where(and(eq(submissions.id, id), eq(submissions.ownerUserId, ownerUserId))).returning({ id: submissions.id });
      return result.length > 0;
    });
  }

  // ─── Activities ─────────────────────────────────────────────────────────
  async getActivitiesByApplicationId(applicationId: string): Promise<Activity[]> {
    return this.withDb(() => db.select().from(activities).where(eq(activities.applicationId, applicationId)).orderBy(desc(activities.createdAt)), []);
  }
  async createActivity(input: InsertActivity, createdByUserId?: string | null): Promise<Activity> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(activities).values({
        applicationId: input.applicationId,
        type: input.type,
        description: input.description,
        createdByUserId: createdByUserId ?? null,
      }).returning();
      return row;
    });
  }

  // ─── Hotlist ────────────────────────────────────────────────────────────
  async setJobSeekerHotlist(id: number, isHotlisted: boolean, hotlistNotes?: string | null): Promise<JobSeeker | undefined> {
    return this.withDbWrite(async () => {
      const updates: { isHotlisted: boolean; hotlistNotes?: string | null } = { isHotlisted };
      if (hotlistNotes !== undefined) updates.hotlistNotes = hotlistNotes;
      const [row] = await db.update(jobSeekers).set(updates).where(eq(jobSeekers.id, id)).returning(HOTLIST_PROJECTION);
      return row as JobSeeker | undefined;
    });
  }
  // ─── AI Recruiter ───────────────────────────────────────────────────────
  async createAiEvaluation(input: Omit<AiEvaluation, "id" | "createdAt">): Promise<AiEvaluation> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(aiEvaluations).values(input).returning();
      return row;
    });
  }
  async getAiEvaluations(ownerUserId: string): Promise<AiEvaluation[]> {
    return this.withDb(() => db.select().from(aiEvaluations).where(eq(aiEvaluations.ownerUserId, ownerUserId)).orderBy(desc(aiEvaluations.createdAt)), []);
  }
  async getAiEvaluationById(id: string, ownerUserId: string): Promise<AiEvaluation | undefined> {
    return this.withDb(async () => {
      const [row] = await db.select().from(aiEvaluations).where(and(eq(aiEvaluations.id, id), eq(aiEvaluations.ownerUserId, ownerUserId))).limit(1);
      return row;
    }, undefined);
  }
  async deleteAiEvaluation(id: string, ownerUserId: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      const result = await db.delete(aiEvaluations).where(and(eq(aiEvaluations.id, id), eq(aiEvaluations.ownerUserId, ownerUserId))).returning({ id: aiEvaluations.id });
      return result.length > 0;
    });
  }
  async createAiAssessment(input: { ownerUserId: string; title: string; jobTitle: string; jdText: string; seniority: string; durationMinutes: number; questions: AiAssessmentQuestion[] }): Promise<AiAssessment> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(aiAssessments).values({
        ownerUserId: input.ownerUserId,
        title: input.title,
        jobTitle: input.jobTitle,
        jdText: input.jdText,
        seniority: input.seniority,
        durationMinutes: input.durationMinutes,
        questions: input.questions as unknown,
      }).returning();
      return row;
    });
  }
  async getAiAssessments(ownerUserId: string): Promise<AiAssessment[]> {
    return this.withDb(() => db.select().from(aiAssessments).where(eq(aiAssessments.ownerUserId, ownerUserId)).orderBy(desc(aiAssessments.createdAt)), []);
  }
  async getAiAssessmentById(id: string, ownerUserId: string): Promise<AiAssessment | undefined> {
    return this.withDb(async () => {
      const [row] = await db.select().from(aiAssessments).where(and(eq(aiAssessments.id, id), eq(aiAssessments.ownerUserId, ownerUserId))).limit(1);
      return row;
    }, undefined);
  }
  async deleteAiAssessment(id: string, ownerUserId: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      const result = await db.delete(aiAssessments).where(and(eq(aiAssessments.id, id), eq(aiAssessments.ownerUserId, ownerUserId))).returning({ id: aiAssessments.id });
      return result.length > 0;
    });
  }

  // ─── Onboardings ────────────────────────────────────────────────────────
  async getAllOnboardings(ownerUserId: string): Promise<Onboarding[]> {
    return this.withDb(() => db.select().from(onboardings).where(eq(onboardings.ownerUserId, ownerUserId)).orderBy(desc(onboardings.createdAt)), []);
  }
  async createOnboarding(input: InsertOnboarding, ownerUserId: string): Promise<Onboarding> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(onboardings).values({ ...input, ownerUserId }).returning();
      return row;
    });
  }
  async updateOnboarding(id: string, ownerUserId: string, updates: Partial<InsertOnboarding>): Promise<Onboarding | undefined> {
    return this.withDbWrite(async () => {
      const [row] = await db.update(onboardings).set(updates).where(and(eq(onboardings.id, id), eq(onboardings.ownerUserId, ownerUserId))).returning();
      return row;
    });
  }
  async deleteOnboarding(id: string, ownerUserId: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      const result = await db.delete(onboardings).where(and(eq(onboardings.id, id), eq(onboardings.ownerUserId, ownerUserId))).returning({ id: onboardings.id });
      return result.length > 0;
    });
  }

  // ─── VMS Connections ────────────────────────────────────────────────────
  async getAllVmsConnections(ownerUserId: string): Promise<VmsConnection[]> {
    return this.withDb(() => db.select().from(vmsConnections).where(eq(vmsConnections.ownerUserId, ownerUserId)).orderBy(desc(vmsConnections.createdAt)), []);
  }
  async createVmsConnection(input: InsertVmsConnection, ownerUserId: string): Promise<VmsConnection> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(vmsConnections).values({ ...input, ownerUserId }).returning();
      return row;
    });
  }
  async updateVmsConnection(id: string, ownerUserId: string, updates: Partial<InsertVmsConnection>): Promise<VmsConnection | undefined> {
    return this.withDbWrite(async () => {
      const [row] = await db.update(vmsConnections).set(updates).where(and(eq(vmsConnections.id, id), eq(vmsConnections.ownerUserId, ownerUserId))).returning();
      return row;
    });
  }
  async deleteVmsConnection(id: string, ownerUserId: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      const result = await db.delete(vmsConnections).where(and(eq(vmsConnections.id, id), eq(vmsConnections.ownerUserId, ownerUserId))).returning({ id: vmsConnections.id });
      return result.length > 0;
    });
  }

  // ─── Job Board Postings ─────────────────────────────────────────────────
  async getAllJobBoardPostings(ownerUserId: string): Promise<JobBoardPosting[]> {
    return this.withDb(() => db.select().from(jobBoardPostings).where(eq(jobBoardPostings.ownerUserId, ownerUserId)).orderBy(desc(jobBoardPostings.createdAt)), []);
  }
  async createJobBoardPosting(input: InsertJobBoardPosting, ownerUserId: string): Promise<JobBoardPosting> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(jobBoardPostings).values({ ...input, ownerUserId }).returning();
      return row;
    });
  }
  async updateJobBoardPosting(id: string, ownerUserId: string, updates: Partial<InsertJobBoardPosting>): Promise<JobBoardPosting | undefined> {
    return this.withDbWrite(async () => {
      const [row] = await db.update(jobBoardPostings).set(updates).where(and(eq(jobBoardPostings.id, id), eq(jobBoardPostings.ownerUserId, ownerUserId))).returning();
      return row;
    });
  }
  async deleteJobBoardPosting(id: string, ownerUserId: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      const result = await db.delete(jobBoardPostings).where(and(eq(jobBoardPostings.id, id), eq(jobBoardPostings.ownerUserId, ownerUserId))).returning({ id: jobBoardPostings.id });
      return result.length > 0;
    });
  }

  // ─── Invoices ───────────────────────────────────────────────────────────
  async getAllInvoices(ownerUserId: string): Promise<Invoice[]> {
    return this.withDb(() => db.select().from(invoices).where(eq(invoices.ownerUserId, ownerUserId)).orderBy(desc(invoices.createdAt)), []);
  }
  async createInvoice(input: InsertInvoice, ownerUserId: string): Promise<Invoice> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(invoices).values({ ...input, ownerUserId }).returning();
      return row;
    });
  }
  async updateInvoice(id: string, ownerUserId: string, updates: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    return this.withDbWrite(async () => {
      const [row] = await db.update(invoices).set(updates).where(and(eq(invoices.id, id), eq(invoices.ownerUserId, ownerUserId))).returning();
      return row;
    });
  }
  async deleteInvoice(id: string, ownerUserId: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      const result = await db.delete(invoices).where(and(eq(invoices.id, id), eq(invoices.ownerUserId, ownerUserId))).returning({ id: invoices.id });
      return result.length > 0;
    });
  }

  // ─── E-Signatures ───────────────────────────────────────────────────────
  async getAllESignatures(ownerUserId: string): Promise<ESignature[]> {
    return this.withDb(() => db.select().from(esignatures).where(eq(esignatures.ownerUserId, ownerUserId)).orderBy(desc(esignatures.createdAt)), []);
  }
  async createESignature(input: InsertESignature, ownerUserId: string): Promise<ESignature> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(esignatures).values({ ...input, ownerUserId }).returning();
      return row;
    });
  }
  async updateESignature(id: string, ownerUserId: string, updates: Partial<InsertESignature>): Promise<ESignature | undefined> {
    return this.withDbWrite(async () => {
      const [row] = await db.update(esignatures).set(updates).where(and(eq(esignatures.id, id), eq(esignatures.ownerUserId, ownerUserId))).returning();
      return row;
    });
  }
  async deleteESignature(id: string, ownerUserId: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      const result = await db.delete(esignatures).where(and(eq(esignatures.id, id), eq(esignatures.ownerUserId, ownerUserId))).returning({ id: esignatures.id });
      return result.length > 0;
    });
  }

  // ─── Background Checks ──────────────────────────────────────────────────
  async getAllBackgroundChecks(ownerUserId: string): Promise<BackgroundCheck[]> {
    return this.withDb(() => db.select().from(backgroundChecks).where(eq(backgroundChecks.ownerUserId, ownerUserId)).orderBy(desc(backgroundChecks.createdAt)), []);
  }
  async createBackgroundCheck(input: InsertBackgroundCheck, ownerUserId: string): Promise<BackgroundCheck> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(backgroundChecks).values({ ...input, ownerUserId }).returning();
      return row;
    });
  }
  async updateBackgroundCheck(id: string, ownerUserId: string, updates: Partial<InsertBackgroundCheck>): Promise<BackgroundCheck | undefined> {
    return this.withDbWrite(async () => {
      const [row] = await db.update(backgroundChecks).set(updates).where(and(eq(backgroundChecks.id, id), eq(backgroundChecks.ownerUserId, ownerUserId))).returning();
      return row;
    });
  }
  async deleteBackgroundCheck(id: string, ownerUserId: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      const result = await db.delete(backgroundChecks).where(and(eq(backgroundChecks.id, id), eq(backgroundChecks.ownerUserId, ownerUserId))).returning({ id: backgroundChecks.id });
      return result.length > 0;
    });
  }

  // ─── Emails ─────────────────────────────────────────────────────────────
  async getAllEmails(ownerUserId: string): Promise<EmailMessage[]> {
    return this.withDb(() => db.select().from(emails).where(eq(emails.ownerUserId, ownerUserId)).orderBy(desc(emails.createdAt)), []);
  }
  async createEmail(input: InsertEmail, ownerUserId: string): Promise<EmailMessage> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(emails).values({ ...input, ownerUserId }).returning();
      return row;
    });
  }
  async updateEmail(id: string, ownerUserId: string, updates: Partial<InsertEmail>): Promise<EmailMessage | undefined> {
    return this.withDbWrite(async () => {
      const [row] = await db.update(emails).set(updates).where(and(eq(emails.id, id), eq(emails.ownerUserId, ownerUserId))).returning();
      return row;
    });
  }
  async deleteEmail(id: string, ownerUserId: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      const result = await db.delete(emails).where(and(eq(emails.id, id), eq(emails.ownerUserId, ownerUserId))).returning({ id: emails.id });
      return result.length > 0;
    });
  }

  // ─── Meetings ───────────────────────────────────────────────────────────
  async getAllMeetings(ownerUserId: string): Promise<Meeting[]> {
    return this.withDb(() => db.select().from(meetings).where(eq(meetings.ownerUserId, ownerUserId)).orderBy(desc(meetings.createdAt)), []);
  }
  async createMeeting(input: InsertMeeting, ownerUserId: string): Promise<Meeting> {
    return this.withDbWrite(async () => {
      const [row] = await db.insert(meetings).values({ ...input, ownerUserId }).returning();
      return row;
    });
  }
  async updateMeeting(id: string, ownerUserId: string, updates: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    return this.withDbWrite(async () => {
      const [row] = await db.update(meetings).set(updates).where(and(eq(meetings.id, id), eq(meetings.ownerUserId, ownerUserId))).returning();
      return row;
    });
  }
  async deleteMeeting(id: string, ownerUserId: string): Promise<boolean> {
    return this.withDbWrite(async () => {
      const result = await db.delete(meetings).where(and(eq(meetings.id, id), eq(meetings.ownerUserId, ownerUserId))).returning({ id: meetings.id });
      return result.length > 0;
    });
  }

  async getHotlistedJobSeekers(): Promise<JobSeeker[]> {
    return this.withDb(
      () => db.select(HOTLIST_PROJECTION).from(jobSeekers).where(eq(jobSeekers.isHotlisted, true)).orderBy(desc(jobSeekers.createdAt)) as unknown as Promise<JobSeeker[]>,
      [],
    );
  }

  async updateJobSeeker(id: number, updates: Partial<UpdateJobSeeker>): Promise<JobSeeker | undefined> {
    return this.withDbWrite(async () => {
      const [row] = await db.update(jobSeekers).set(updates).where(eq(jobSeekers.id, id)).returning();
      return row;
    });
  }
}

// Sanitized projection — never return password / resetToken to admin clients.
const HOTLIST_PROJECTION = {
  id: jobSeekers.id,
  fullName: jobSeekers.fullName,
  email: jobSeekers.email,
  phone: jobSeekers.phone,
  currentPosition: jobSeekers.currentPosition,
  experienceLevel: jobSeekers.experienceLevel,
  isHotlisted: jobSeekers.isHotlisted,
  hotlistNotes: jobSeekers.hotlistNotes,
  createdAt: jobSeekers.createdAt,
} as const;

export const storage = new DatabaseStorage();
