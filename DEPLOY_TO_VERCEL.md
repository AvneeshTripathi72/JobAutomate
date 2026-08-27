# 🚀 Deploy Tilcons to Vercel (Testing Purpose)

> **⚠️ This guide is for testing/preview deployments only — NOT production.**

---

## 📋 Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works)
- Your project pushed to a **GitHub repository**
- Node.js ≥ 20 installed locally

---

## Step 1: Push Your Code to GitHub

If your code is not already on GitHub:

```bash
# Initialize git (skip if already done)
git init
git add .
git commit -m "Initial commit"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

> **🔴 IMPORTANT:** Make sure `.env` and `.env.local` are in your `.gitignore` — **never push secrets to GitHub!**
>
> Your `.gitignore` should include:
>
> ```
> .env
> .env.local
> node_modules
> dist
> ```

---

## Step 2: Create `vercel.json` in Your Project Root

Create a file called `vercel.json` in the root of your project with this content:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "installCommand": "npm install",
  "framework": null,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "functions": {
    "api/**/*.js": {
      "memory": 256,
      "maxDuration": 30
    }
  }
}
```

---

## Step 3: Convert Express API to Vercel Serverless Functions

Vercel doesn't run a persistent Express server. You need to convert your backend to **serverless functions**.

### 3a. Create `api/upload-resume.ts`

Create a folder called `api/` in your project root and add:

```ts
// api/upload-resume.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.R2_BUCKET_NAME || "first";
const PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Note: For file uploads on Vercel, you may need to use
    // a different approach (e.g., presigned URLs from the client)
    // since Vercel serverless functions have a 4.5 MB body limit.
    return res.status(200).json({ message: "Upload endpoint ready" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Upload failed" });
  }
}
```

> **💡 Tip:** For file uploads, consider using **presigned URLs** — generate a
> signed upload URL from the serverless function, then upload directly from the
> browser to R2. This avoids Vercel's 4.5 MB body size limit.

---

## Step 4: Deploy on Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repo
4. Vercel will auto-detect the settings. Verify:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/public`
   - **Install Command:** `npm install`
5. Click **"Deploy"**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project root
cd "path/to/your/project"
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No (first time)
# - Project name? tilcons (or whatever you want)
# - Directory with your code? ./
# - Override settings? No
```

For subsequent deploys:

```bash
vercel          # Preview deployment
vercel --prod   # Production deployment
```

---

## Step 5: Add Environment Variables

### Via Vercel Dashboard:

1. Go to your project on [vercel.com](https://vercel.com)
2. Navigate to **Settings → Environment Variables**
3. Add each variable one by one:

| Variable Name                      | Value                          | Environment |
| ---------------------------------- | ------------------------------ | ----------- |
| `CLOUDFLARE_ACCOUNT_ID`          | Your Cloudflare Account ID     | All         |
| `R2_ACCESS_KEY_ID`               | Your R2 Access Key             | All         |
| `R2_SECRET_ACCESS_KEY`           | Your R2 Secret Key             | All         |
| `R2_BUCKET_NAME`                 | `first`                      | All         |
| `NEXT_PUBLIC_R2_PUBLIC_URL`      | Your R2 public URL             | All         |
| `NEXT_PUBLIC_SUPABASE_URL`       | Your Supabase project URL      | All         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Your Supabase anon key         | All         |
| `SUPABASE_SERVICE_ROLE_KEY`      | Your Supabase service role key | All         |
| `VITE_SUPABASE_URL`              | Your Supabase project URL      | All         |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | All         |

### Via CLI:

```bash
vercel env add CLOUDFLARE_ACCOUNT_ID
vercel env add R2_ACCESS_KEY_ID
# ... repeat for each variable
```

> **After adding env vars, redeploy:**
>
> ```bash
> vercel --prod
> ```

---

## Step 6: Verify Deployment

1. Vercel will give you a URL like `https://tilcons-xxxxx.vercel.app`
2. Open it in your browser
3. Test the following:
   - ✅ Homepage loads
   - ✅ Login/Auth works (Supabase)
   - ✅ Pages navigate correctly (client-side routing)
   - ⚠️ API routes (`/api/*`) — verify serverless functions work
   - ⚠️ File uploads — may need presigned URL approach

---

## ⚠️ Important Notes & Limitations

### This is a Full-Stack App

Your project has both a **Vite/React frontend** and an **Express backend**. Vercel is
primarily designed for frontend + serverless functions, **not** persistent Express servers.

### What Works on Vercel (Free Tier):

| Feature                  | Status                     |
| ------------------------ | -------------------------- |
| React frontend (SPA)     | ✅ Works perfectly         |
| Client-side routing      | ✅ Works with rewrites     |
| Supabase auth & queries  | ✅ Works (runs in browser) |
| Static assets            | ✅ Works                   |
| Serverless API functions | ✅ Works (with conversion) |

### What Needs Extra Work:

| Feature                      | Status                                               |
| ---------------------------- | ---------------------------------------------------- |
| Express server (`server/`) | ❌ Won't run as-is — needs serverless conversion    |
| File uploads via Express     | ⚠️ Limited to 4.5 MB — use presigned URLs instead |
| WebSocket connections        | ❌ Not supported on Vercel serverless                |

### Quick Alternative: Frontend-Only Deploy

If your frontend talks directly to **Supabase** (which it does for auth & data),
you can deploy **just the frontend** without any backend changes:

1. The `vite build` output in `dist/public` is a static SPA
2. Supabase handles auth, database, and storage from the client
3. Only the `/api/upload-resume` route needs the Express backend

---

## 🔄 Auto-Deploy on Push

Once connected to GitHub, Vercel **automatically deploys** on every push:

- Push to `main` → **Production deploy**
- Push to any other branch → **Preview deploy** (with unique URL)

---

## 📁 Project Structure for Vercel

```
your-project/
├── api/                    ← Vercel serverless functions (NEW)
│   └── upload-resume.ts
├── client/                 ← React frontend source
│   └── src/
├── dist/
│   └── public/             ← Build output (Vercel serves this)
├── server/                 ← Express backend (NOT used on Vercel)
├── vercel.json             ← Vercel config (NEW)
├── package.json
├── vite.config.ts
└── .gitignore
```

---

## 🆘 Troubleshooting

| Problem                   | Solution                                                                         |
| ------------------------- | -------------------------------------------------------------------------------- |
| Build fails               | Check Node.js version — set to 20.x in Vercel project settings                  |
| Page shows 404 on refresh | Make sure`rewrites` in `vercel.json` redirect to `/index.html`             |
| Env vars not working      | Redeploy after adding env vars.`VITE_*` vars are baked at build time           |
| API routes return 404     | Ensure`api/` folder exists with proper serverless function exports             |
| Supabase auth fails       | Verify`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set |

---

## 🧹 Cleanup (When Done Testing)

To remove the Vercel deployment:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings → General**
4. Scroll down and click **"Delete Project"**

---

*This guide is for testing purposes. For production deployment, consider platforms
that support persistent Node.js servers (e.g., Railway, Render, Fly.io, or a VPS).*
