# Tilcons Staffing Platform

## Overview
Tilcons (Tileshwar Consulting Services Pvt. Ltd.) is positioned as **the all-in-one ATS + CRM built for Indian staffing agencies**. Dual-audience platform: public site for candidates/employers, plus an internal admin workspace with a real ATS (jobs, applications, hiring pipeline) and now a real CRM (clients + deals, fully DB-backed). Brand colours: navy `#0d2137`, sky `#0ea5e9`. Roadmap is published transparently at `/roadmap` — what's live, what's coming Q3/Q4 2026, what's H1 2027.

## Recent changes
- **AI Recruiter module is REAL (not just marketing).** Two OpenAI-powered tools live in the admin workspace under `/admin/ai-recruiter`:
  1. **AI Resume Screening** — paste JD + resume + candidate name, get a 0-100 scorecard (overall, skills, experience, culture, integrity), verdict (strong_fit/fit/weak_fit/not_fit), 2-3 sentence summary, strengths, red flags, matched + missing skills. All sanitised server-side (clampScore, allow-list verdict, string-array length caps).
  2. **JD-to-Test Generator** — paste JD + seniority + question count + duration, get a role-ready MCQ assessment with correct-answer index, per-question explanation and skill tag. Validates each generated question (≥2 options, valid correct index, non-empty stem) and rejects empty AI responses with a 502.
  - DB tables `ai_evaluations` + `ai_assessments`, both `ownerUserId`-scoped (multi-tenant — recruiters can never see each other's scorecards/tests). Full CRUD via `/api/ai-recruiter/score`, `/api/ai-recruiter/evaluations`, `/api/ai-recruiter/generate-test`, `/api/ai-recruiter/assessments` (all `requireAuth`).
  - Uses `gpt-4o-mini` via Replit AI Integrations (`AI_INTEGRATIONS_OPENAI_API_KEY` + base URL), `response_format: json_object`, temperature 0.2 (scoring) / 0.4 (test gen).
  - UI: navy gradient header with live stats (Scored, Fits, Avg), 2 tabs (Screen Candidate / Generate Test), expandable scorecards with per-dimension score bars, full strengths/red-flags/matched/missing skill chips, expandable test preview with correct-answer highlight and explanations.
- **`/ai-recruiter` landing page rebuilt** with 21 capability cards mirroring Xquizit feature set (AI Resume Screening, JD-to-Test, Proctored Assessments, AI Voice Interviews, Evidence Scorecards, Skill-Based Coding, Auto-Scheduling, Multilingual Outreach, Culture-Fit, Smart Matching, Bias-Reduced Screening, Predictive Insights, 10x Faster Shortlisting, Patented Boolean+NL Search, AI-Suggested Matches, VMS Sync, Two-Way Job Board Sync, AI Lead Scoring, Auto-Activity Logging, Submission Tracking) with mixed status badges (Live (beta) / Q3 2026 / Q4 2026 / H1 2027). 6 platform stats (48h, 10x, 3×, 60%, 95%, 100+). Roadmap reflects the same: AI Resume Screening + JD-to-Test + Evidence Scorecards now marked LIVE (beta).
- **New `/get-started` demo page** (Ceipal-inspired layout, fully on-brand): two-column hero on the navy background with sky-blue accents. Left column = positioning ("See How You Can Fill Roles 3x Faster"), 20-minute demo agenda, AI / GST / Naukri trust signals. Right column = white sticky form card with First/Last Name, Work Email, Phone (+91), Company, Job Title, Industry (8 Indian-staffing-specific options), optional Team Size. Submits to `POST /api/contacts` with `inquiryType: "Demo Request"` (rich form fields flattened into the `message` body). Success state in-card. Routes `/demo` and `/request-demo` redirect to `/get-started`. About page "Request Demo" and "Reach our team for a demo" links now point here instead of `/contact`.
- **About page CTA is now auth-aware:** the "Explore Product → /ats" button has been replaced with a Login-aware control. Logged-in users see "Open ATS Workspace" → `/admin/ats`; logged-out visitors see "Login to ATS" → `/signin`, with a "Don't have an account yet? Reach our team for a demo →" link to `/contact` underneath.
- **Hotlist response sanitized:** `storage.getHotlistedJobSeekers` and `storage.setJobSeekerHotlist` now project only safe candidate columns (id, fullName, email, phone, currentPosition, experienceLevel, isHotlisted, hotlistNotes, createdAt). `password` and `resetToken` are never returned to admin clients.
- **Phase-1 Ceipal-parity ATS upgrades (live, DB-backed):**
  - Pipeline expanded to 8 stages: Applied → In Review → Shortlisted → Submitted → Interview → Offer → Joined → Not Selected (legacy `hired` still supported).
  - `interviews` table + `/api/interviews` CRUD; "Schedule Interview" dialog inside the candidate panel (mode: phone/video/onsite, interviewer, date/time, status, feedback).
  - `submissions` table + `/api/submissions` CRUD links a candidate's application to a CRM client with status, rate, notes. Storage layer verifies the chosen client is owned by the recruiter.
  - `activities` table + `/api/activities` (GET by applicationId, POST). Status changes, interview scheduling, and client submissions auto-log. Recruiters can add free-text notes from the Activity tab.
  - `jobSeekers.isHotlisted` + `hotlistNotes` columns. PATCH `/api/jobseekers/:id/hotlist` toggle. New **Hotlist / Bench** tab in the ATS sidebar; per-candidate "Hotlist" button in the candidate panel and the Registered Candidates list.
  - `CandidateDetailPanel` rebuilt with tabs: Pipeline · Activity · Interviews · Submit. All four are populated from real Postgres data.
- **CRM module is real** (not mock): `clients` + `deals` tables in Postgres, full CRUD via `/api/crm/clients` and `/api/crm/deals` (all `requireAuth`), Zod-validated (email format, enum stages, min/max bounds, UUID FK check). UI in `client/src/components/admin/CrmWorkspace.tsx` with stat cards, client list, deal pipeline, dialogs.
- **Roadmap Preview banner** on the 8 still-mocked admin modules (onboarding, financials, vms-sync, job-boards, email-calendar, background-checks, esignature, reports) — dashed amber border, "Coming Q3 2026" pill, link to `/roadmap`.
- **Public `/roadmap` page** lists 32 capabilities across 5 sections with status badges (Live / Q3 2026 / Q4 2026 / H1 2027). Linked from footer.
- **Unified login** at `/signin` (also `/login`, `/crm/login`, `/ats/login`) — single "Sign In (ATS + CRM)" button in header, lands on `/admin`.

## Multi-tenant CRM (live)
- `clients` and `deals` both have an `ownerUserId` column populated from the authenticated session.
- All storage methods (`getAllClients`, `getClientById`, `createClient`, `updateClient`, `deleteClient`, `getAllDeals`, `createDeal`, `updateDeal`, `deleteDeal`) require an `ownerUserId` arg and filter via `and(eq(...), eq(ownerUserId, ...))`.
- Routes derive `ownerId` from `req.user.id` — no client-supplied owner trust.
- Cross-account read/write/delete is blocked at the storage layer.

## India positioning
- Home page section "Built for Indian Staffing" highlights Naukri-first distribution, GST/PF/ESI/TDS readiness, and INR pricing — links to `/roadmap` and `/ats`.

## Known gaps (honest)
- 8 admin modules are still design previews (onboarding, financials, vms-sync, job-boards, email-calendar, background-checks, esignature, reports). Real implementations on the public roadmap.
- No public registration. Admin accounts are provisioned manually (single user today, but the platform now supports multiple isolated CRM workspaces).

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18+ and TypeScript, utilizing Vite for development and bundling. Wouter is used for client-side routing, and TanStack Query manages server state and data fetching. UI components are developed using Shadcn/ui (New York style) based on Radix UI primitives, styled with Tailwind CSS and custom design tokens. The design follows a responsive, mobile-first approach, separating job seeker and employer experiences. Form handling is managed by React Hook Form with Zod validation.

### Backend Architecture
The backend is an Express.js application written in TypeScript, providing RESTful API endpoints. Key API resources include `/api/jobs` for job listings, `/api/applications` for submissions, `/api/contacts` for contact form submissions, `/api/resumes` for resume submissions, and `/api/vendors` for partnership registrations. Authentication is handled via Passport.js with a Local Strategy, using scrypt for password hashing and `express-session` for session management. Sessions are secure, httpOnly, and persist for 7 days. Data storage for development currently uses an in-memory implementation, with a clear interface for future PostgreSQL integration via Drizzle ORM.

### Key Features and Design Decisions
- **Dual-Audience Design**: Distinct user flows and interfaces for job seekers and employers.
- **AI-Driven Visual Identity**: Full AI-themed visual overhaul across all pages — animated grid overlays (`ai-grid-overlay`), pulsing node decorations (`ai-node`), gradient text effects (`ai-gradient-text`), hero glow radials (`ai-hero-glow`), scan-line animations (`ai-scan-line`), and orange gradient top bars. Every hero section features a `BrainCircuit` AI badge, consistent glow accents, and floating node decorations. CSS animations and utilities defined in `client/src/index.css`.
- **Secure Authentication**: Separate systems for job seekers and administrators, with database-backed authentication for persistence. Admin access is hidden and URL-restricted. Candidates can recover access via a "Forgot Password" flow (`POST /api/jobseekers/forgot-password` and `POST /api/jobseekers/reset-password`). Reset tokens are random 32-byte values; only their SHA-256 hash is persisted, expire after 1 hour, and the reset email is delivered via the Outlook integration. Frontend pages: `JobSeekerAuth.tsx` (forgot-email form) and `ResetPassword.tsx` (`/reset-password?token=...`). Optional `APP_URL` env var overrides the host used to build reset links.
- **Vendor Partnership Program**: Dedicated registration page and API for vendor partners.
- **Dynamic Content**: Service-specific images, enhanced hero sections with animations, and interactive elements like image carousels.
- **Streamlined Navigation**: Simplified header navigation focusing on core audience pathways, with vendor partner CTA moved to the footer.
- **Robust Validation**: Zod schema validation applied to all incoming API requests and forms for data integrity.
- **Agastya AI Chatbot**: Floating chat widget (bottom-right corner) powered by OpenAI via Replit AI Integrations. Agastya can answer questions about Tilcons, browse open job positions in real-time, and guide employers toward submitting job descriptions. Backend endpoint: `POST /api/chat`. Component: `client/src/components/AgastyaChat.tsx`.

## External Dependencies

- **Database**: PostgreSQL (planned integration via Drizzle ORM), using `@neondatabase/serverless` driver and `connect-pg-simple` for session storage.
- **UI Libraries**: Radix UI (primitives), Shadcn/ui (component library), Embla Carousel, Lucide React (icons), Class Variance Authority (CVA).
- **Form Handling**: React Hook Form, Zod, `@hookform/resolvers`.
- **Email Integration**: Microsoft 365 Outlook via Microsoft Graph API for automated resume submission notifications to `ashu@tilcons.com` and `deep@tilcons.com`.
- **Development Tools**: Vite, ESBuild, Drizzle Kit.