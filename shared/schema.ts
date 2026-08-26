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
});
export const insertContactSchema = contactsSchema.omit({ id: true });
export type Contact = z.infer<typeof contactsSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginCredentials = z.infer<typeof loginSchema>;

