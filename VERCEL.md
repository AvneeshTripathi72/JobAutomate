# Tilcons — Deploy on Vercel

This project is configured to run on **Vercel**:

- The **frontend** (Vite/React) is built to `dist/public` and served as static files.
- The **backend** (Express API) runs as a serverless function at `api/index.ts`.
- All `/api/*` requests are routed to that function (see `vercel.json`).

---

## ⚠ Before you start

Vercel functions are **serverless** (no always-on server). Two things matter:

1. **Database** — You need a PostgreSQL database. Use **Neon** (neon.tech, free), Supabase, or Railway. Vercel does not include Postgres by default.
2. **Sessions** — On serverless, in-memory sessions break (each request can hit a fresh instance). This app **automatically switches to a Postgres-backed session store when running on Vercel** (it detects the `VERCEL` environment variable). A `session` table is created automatically on first run. No action needed from you beyond setting `DATABASE_URL`.

---

## Step 1 — Push the code to GitHub

Vercel deploys from a Git repo. Push this project to a GitHub/GitLab/Bitbucket repository.

## Step 2 — Import into Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Import your repository.
3. Vercel will auto-detect `vercel.json`. Leave the build settings as-is:
   - **Build Command:** `vite build` (from vercel.json)
   - **Output Directory:** `dist/public` (from vercel.json)

## Step 3 — Add environment variables

In the Vercel project → **Settings** → **Environment Variables**, add:

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | ✅ | Postgres connection string (Neon/Supabase). Include `?sslmode=require`. |
| `SESSION_SECRET` | ✅ | Random 64-char string. Generate: `openssl rand -hex 32` |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | ✅ | For AI Recruiter + Agastya chat |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | ✅ | `https://api.openai.com/v1` |
| `APP_URL` | recommended | Your Vercel URL, e.g. `https://tilcons.vercel.app` (used in reset emails) |
| `MS_GRAPH_TENANT_ID` | optional | Outlook email notifications |
| `MS_GRAPH_CLIENT_ID` | optional | |
| `MS_GRAPH_CLIENT_SECRET` | optional | |
| `MS_GRAPH_SENDER_EMAIL` | optional | |

> `VERCEL` is set automatically by Vercel — you do **not** add it yourself. It's what triggers the Postgres session store.

## Step 4 — Create the database tables (one-time)

Run this **locally** once, pointing at your production database, to create all tables:

```bash
DATABASE_URL="your-production-postgres-url" npm run db:push
```

(Vercel's build environment is read-only for the DB schema — run `db:push` from your machine.)

## Step 5 — Deploy

Click **Deploy** in Vercel. Once it finishes, your site is live at `https://<project>.vercel.app`.

**First admin login:**
- Use the admin username and password set up for the platform (provided to you separately — not stored in this repo).
- Change the password immediately after your first login.

---

## How it works (technical)

- `vercel.json` rewrites `/api/(.*)` → `/api`, so every API call hits the single serverless function in `api/index.ts`.
- `api/index.ts` builds the Express app once per warm instance and reuses it. It calls the same `registerRoutes()` used in development — so all routes, auth, and validation behave identically.
- The Vite dev setup (`server/index.ts`, `server/vite.ts`) is **not** used on Vercel; only the API routes and the prebuilt static frontend are.

---

## Troubleshooting

**Login doesn't persist** → Confirm `DATABASE_URL` is set in Vercel env vars. The Postgres session store needs it. Check function logs for `session` table errors.

**500 on /api/\*** → Open Vercel → Deployments → your deployment → **Functions** logs. Most common cause: missing `DATABASE_URL` or `SESSION_SECRET`.

**Cold starts feel slow** → First request after idle spins up the function (~1-2s). Subsequent requests are fast. Vercel Pro reduces this.

**AI features don't respond** → Verify `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` are set.

---

## Alternative: separate backend

If serverless cold starts or function limits become a problem (heavy AI usage, large uploads), host the Express backend on **Railway** or **Render** (always-on) and use Vercel only for the frontend. Point the frontend's API calls at the backend URL via an env var.
