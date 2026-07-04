# Tilcons — ATS + CRM Platform

**Tileshwar Consulting Services Pvt. Ltd.**
All-in-one staffing platform built for Indian recruitment agencies.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)

---

## 🚀 Live Features

### Public Website
| Page | URL | Description |
|---|---|---|
| Home | `/` | Landing page with stats & services |
| Jobs | `/jobs` | Browse & search open positions |
| Submit Resume | `/submit-resume` | Candidate CV submission |
| Career Advice | `/career-advice` | Articles & hiring insights |
| Contact | `/contact` | Enquiry form |
| Get Started | `/get-started` | Demo request form |
| About | `/about` | Company info |
| Roadmap | `/roadmap` | Product roadmap (32 features) |

### Candidate Portal
| Feature | URL | Description |
|---|---|---|
| Register / Login | `/candidate-auth` | Job-seeker accounts |
| Dashboard | `/dashboard` | Applications & resume history |
| Forgot Password | `/candidate-auth` | Email-based reset |

### Admin Workspace (login required)
| Module | URL | Status |
|---|---|---|
| ATS — Jobs | `/admin/ats` | ✅ Live |
| ATS — Applications | `/admin/ats` | ✅ Live (8-stage pipeline) |
| ATS — Candidates | `/admin/ats` | ✅ Live |
| ATS — Hotlist/Bench | `/admin/ats` | ✅ Live |
| CRM — Clients | `/admin/crm` | ✅ Live |
| CRM — Deals | `/admin/crm` | ✅ Live |
| AI Recruiter | `/admin/ai-recruiter` | ✅ Live (needs OpenAI key) |
| Agastya Chatbot | Floating widget | ✅ Live (needs OpenAI key) |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, Shadcn/UI, Wouter |
| Backend | Express.js, TypeScript, Passport.js (local strategy) |
| Database | PostgreSQL + Drizzle ORM |
| Sessions | `connect-pg-simple` (Postgres-backed) |
| Email | Nodemailer (SMTP) |
| AI | OpenAI API (gpt-4o-mini) |
| Build | Vite (frontend), esbuild (backend) |

---

## 📋 Prerequisites

- **Node.js 18+** (`node -v` to check)
- **npm 9+** (`npm -v` to check)
- **PostgreSQL database** — free at [neon.tech](https://neon.tech) _(recommended)_ or [supabase.com](https://supabase.com)

---

## ⚡ Local Development

```bash
# 1. Clone the repository
git clone https://github.com/your-username/tilcons.git
cd tilcons

# 2. Install dependencies
npm install

# 3. Set up environment variables
copy .env.example .env
# Edit .env — at minimum set DATABASE_URL and SESSION_SECRET

# 4. Create the database tables (run once)
npm run db:push

# 5. Create your admin account (run once)
npm run create-admin

# 6. Start the development server
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## 🌍 Deployment

See **[DEPLOY.md](./DEPLOY.md)** for full deployment instructions covering:

- **Option A**: Render + Neon (free, recommended)
- **Option B**: Bluehost VPS (SSH required)
- **Option C**: Vercel (frontend + serverless backend)

---

## 🔑 Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `SESSION_SECRET` | ✅ | — | Min 32-char random string |
| `APP_URL` | Recommended | — | Public URL (for reset emails) |
| `NODE_ENV` | Recommended | `development` | Set to `production` on server |
| `SMTP_HOST` | Optional | — | Mail server hostname |
| `SMTP_PORT` | Optional | `587` | SMTP port |
| `SMTP_USER` | Optional | — | SMTP login |
| `SMTP_PASS` | Optional | — | SMTP password |
| `SMTP_FROM` | Optional | — | Sender address |
| `SMTP_SECURE` | Optional | `false` | `true` for port 465 SSL |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | Optional | — | For AI Recruiter + chatbot |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | Optional | `https://api.openai.com/v1` | OpenAI base URL |

> **Generate `SESSION_SECRET`** (PowerShell):
> ```powershell
> -join ((1..32) | ForEach-Object { '{0:x}' -f (Get-Random -Max 256) })
> ```
> Or on Linux/Mac: `openssl rand -hex 32`

---

## 🗄 Database Schema

The schema lives in [`shared/schema.ts`](./shared/schema.ts). Tables:

| Table | Description |
|---|---|
| `users` | Admin accounts |
| `jobs` | Job listings |
| `applications` | Job applications |
| `job_seekers` | Candidate accounts |
| `resumes` | CV/resume submissions |
| `contacts` | Contact form enquiries |
| `vendors` | Partner registrations |
| `articles` | Blog/career advice posts |
| `clients` | CRM clients (per-owner) |
| `deals` | CRM deals (per-owner) |
| `interviews` | Interview schedules |
| `submissions` | Candidate → client submissions |
| `activities` | Application activity timeline |
| `ai_evaluations` | AI resume screening results |
| `ai_assessments` | AI-generated test papers |
| `session` | Persistent session store |

Run migrations:
```bash
DATABASE_URL="your-db-url" npm run db:push
```

---

## 📁 Project Structure

```
tilcons/
├── api/                  # Vercel serverless entry point
│   └── index.ts
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components (admin, layout, shared)
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities
│   └── index.html
├── server/               # Express backend
│   ├── index.ts          # Server entry (dev)
│   ├── routes.ts         # All API routes
│   ├── storage.ts        # Database layer
│   ├── auth.ts           # Passport.js auth
│   ├── db.ts             # Drizzle + pg connection
│   └── email.ts          # Nodemailer email service
├── shared/
│   └── schema.ts         # Drizzle schema + Zod validators
├── scripts/
│   └── create-admin.ts   # Admin account creation
├── dist/                 # Production build output (git-ignored)
│   ├── index.js          # Compiled server
│   └── public/           # Compiled frontend
├── .env.example          # Environment variable template
├── Procfile              # Process definition (Render/Railway)
├── vercel.json           # Vercel deployment config
├── DEPLOY.md             # Full deployment guide
└── package.json
```

---

## 🧑‍💻 Admin Account

Public registration is disabled. Create your admin account once using:

```bash
# With DATABASE_URL set in your environment:
npm run create-admin

# Or with explicit credentials (non-interactive):
$env:DATABASE_URL="postgresql://..."; $env:USERNAME="admin"; $env:PASSWORD="your-password"; npm run create-admin
```

Login at `/signin`.

---

## ✉️ Email Setup (Optional)

Without SMTP credentials the app works normally — emails just won't be sent.

**Using Bluehost cPanel email:**
```
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-cpanel-email-password
SMTP_FROM="Tilcons <noreply@yourdomain.com>"
```

**Using Gmail (with App Password):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password   # Not your regular Gmail password
SMTP_FROM="Tilcons <your@gmail.com>"
```

> **Gmail App Password**: Google Account → Security → 2-Step Verification → App Passwords → Generate

---

## 🤖 AI Features (Optional)

The AI Recruiter and Agastya chatbot require an OpenAI API key:

```
AI_INTEGRATIONS_OPENAI_API_KEY=sk-...
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
```

Without the key, all other platform features work normally.

---

## 🔒 Security Notes

- Sessions use secure, httpOnly cookies in production
- Passwords are hashed with `scrypt` (not bcrypt — more memory-hard)
- Password reset tokens are SHA-256 hashed before storage
- CRM data is strictly scoped per owner (multi-tenant)
- Registration is disabled by default — accounts are provisioned manually

---

## 📞 Support

**Tileshwar Consulting Services Pvt. Ltd.**
- 710 GF Sector-1 Vasundhara, Ghaziabad — 201012
- Phone: +91-7276105036
- Email: info@tilcons.com
