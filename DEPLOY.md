# Tilcons — Hostinger VPS Deployment Guide (Production)

> **Recommended for your startup.** Hostinger VPS gives you a real always-on server,
> full SSH access, NVMe SSDs, support team, and scales as your traffic grows.

---

## What You'll Need

| Item | Cost | Where |
|---|---|---|
| Hostinger VPS plan | ~₹1,649–₹3,299/month | [hostinger.in/vps-hosting](https://hostinger.in/vps-hosting) |
| Domain name | ~₹800/year | Hostinger or GoDaddy |
| PostgreSQL database | **Free** | [neon.tech](https://neon.tech) |
| GitHub account | Free | [github.com](https://github.com) |

**Recommended VPS plan for your startup:** **KVM 2** (2 vCPU, 8GB RAM, 100GB NVMe) — handles heavy traffic easily.

---

## Phase 1 — Buy Hostinger VPS

1. Go to **[hostinger.in/vps-hosting](https://www.hostinger.in/vps-hosting)**
2. Choose **KVM 1** (budget) or **KVM 2** (recommended for startup traffic)
3. During checkout:
   - **OS:** Choose **Ubuntu 22.04** (most stable for Node.js)
   - **Location:** Singapore (closest to India, lowest latency)
4. Complete payment
5. Go to **hPanel** → **VPS** → note down your **VPS IP address** and **root password**

---

## Phase 2 — Get a Free PostgreSQL Database (Neon)

> Hostinger VPS doesn't include PostgreSQL. Use Neon — it's free and production-grade.

1. Go to **[neon.tech](https://neon.tech)** → Sign up free
2. Click **Create Project** → name it `tilcons`
3. Copy the **Connection string** — looks like:
   ```
   postgresql://alex:pass@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **Keep this safe** — you'll need it several times

---

## Phase 3 — Push Your Code to GitHub

On your Windows machine, open PowerShell in the project folder:

```powershell
git init
git add .
git commit -m "Tilcons ATS+CRM - production ready"
```

Then go to **[github.com](https://github.com)** → **New repository** → name it `tilcons` → **Create** → copy the repo URL, then:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/tilcons.git
git push -u origin main
```

---

## Phase 4 — Create Database Tables (run once from your PC)

```powershell
$env:DATABASE_URL="postgresql://...your-neon-url..."; npm run db:push
```

You should see: `All migrations applied successfully`

---

## Phase 5 — Set Up the Hostinger VPS

### 5.1 — Connect via SSH

On Windows, open **PowerShell** and type:

```powershell
ssh root@YOUR_VPS_IP
```

Enter the root password from Hostinger hPanel when prompted.

> **Tip:** Hostinger hPanel also has a built-in browser terminal — go to **VPS → Manage → Terminal** if SSH doesn't work.

### 5.2 — Update the server

```bash
apt update && apt upgrade -y
```

### 5.3 — Install Node.js 20 (via nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20
node -v    # should print v20.x.x
npm -v     # should print 10.x.x
```

### 5.4 — Install PM2 and Git

```bash
npm install -g pm2
apt install git -y
```

### 5.5 — Install Nginx

```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

### 5.6 — Configure firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## Phase 6 — Deploy the App

### 6.1 — Clone your repo on the VPS

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/YOUR_USERNAME/tilcons.git
cd tilcons
```

### 6.2 — Install dependencies and build

```bash
npm install
npm run build
```

This creates `dist/index.js` (server) and `dist/public/` (frontend).

### 6.3 — Create the environment file

```bash
nano /var/www/tilcons/.env
```

Paste and fill in (replace all placeholder values):

```env
NODE_ENV=production
PORT=5000

# Database (from Neon)
DATABASE_URL=postgresql://...your-neon-connection-string...

# Session secret — make this long and random
SESSION_SECRET=tilcons-prod-secret-2026-change-this-to-something-long-random

# Your domain
APP_URL=https://yourdomain.com

# Email (use your Hostinger/cPanel email or Gmail)
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-email-password
SMTP_FROM="Tilcons <noreply@yourdomain.com>"
SMTP_SECURE=false
```

Save: press `Ctrl+X` → `Y` → `Enter`

> **Generate a strong SESSION_SECRET** — run this on the VPS:
> ```bash
> openssl rand -hex 32
> ```
> Copy the output and paste it as the `SESSION_SECRET` value.

### 6.4 — Start the app with PM2

```bash
cd /var/www/tilcons
pm2 start dist/index.js --name tilcons
pm2 save
pm2 startup
```

PM2 will print a command like `sudo env PATH=... pm2 startup systemd -u root --hp /root` — **copy and run that command** to make the app start automatically after a server reboot.

### 6.5 — Check it's running

```bash
pm2 status
pm2 logs tilcons --lines 20
```

You should see: `serving on port 5000`

---

## Phase 7 — Configure Nginx (Reverse Proxy)

Nginx listens on port 80/443 and forwards traffic to your Node.js app on port 5000.

```bash
nano /etc/nginx/sites-available/tilcons
```

Paste this (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Increase upload size limit for resume files (5MB)
    client_max_body_size 10M;

    # Gzip compression for faster page loads
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeout settings for heavy operations
        proxy_read_timeout 120s;
        proxy_connect_timeout 10s;
    }
}
```

Enable it:

```bash
ln -s /etc/nginx/sites-available/tilcons /etc/nginx/sites-enabled/
nginx -t          # Must say: "syntax is ok"
systemctl reload nginx
```

---

## Phase 8 — Point Your Domain to the VPS

In your domain registrar (Hostinger Domains / GoDaddy):

1. Go to **DNS Zone Editor**
2. Add/update these records:

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `@` | Your VPS IP address | 3600 |
| `A` | `www` | Your VPS IP address | 3600 |

DNS changes take 5–30 minutes to propagate.

---

## Phase 9 — Enable HTTPS / SSL (Free with Let's Encrypt)

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts — Certbot will:
- Get a free SSL certificate
- Automatically update your Nginx config to redirect HTTP → HTTPS
- Auto-renew every 90 days

After this, your site is live at `https://yourdomain.com` 🎉

---

## Phase 10 — Create Your Admin Account

```bash
cd /var/www/tilcons
npm run create-admin
```

Enter your chosen admin **username** and **password**.
Login at `https://yourdomain.com/signin`

---

## Phase 11 — Verify Everything Works

| Check | URL |
|---|---|
| Public home page | `https://yourdomain.com` |
| Jobs listing | `https://yourdomain.com/jobs` |
| Admin login | `https://yourdomain.com/signin` |
| ATS workspace | `https://yourdomain.com/admin/ats` |
| CRM workspace | `https://yourdomain.com/admin/crm` |
| API health | `https://yourdomain.com/api/stats` |

---

## Managing Your App Going Forward

### View logs
```bash
pm2 logs tilcons
```

### Restart the app
```bash
pm2 restart tilcons  
```

### Deploy updates (after `git push` from your PC)
```bash
cd /var/www/tilcons
git pull
npm install
npm run build
pm2 restart tilcons
```

### Monitor server resources
```bash
pm2 monit
```

---

## Troubleshooting

**Can't SSH into VPS**
→ Use Hostinger hPanel → VPS → Terminal (browser-based). Contact Hostinger support if the VPS IP is wrong.

**502 Bad Gateway in browser**
→ App isn't running. Check: `pm2 status` and `pm2 logs tilcons`

**Site shows Nginx default page**
→ Nginx config not loaded. Run: `nginx -t && systemctl reload nginx`

**Database errors in logs**
→ Check `DATABASE_URL` in `/var/www/tilcons/.env`. Must start with `postgresql://` and end with `?sslmode=require`.

**Login doesn't persist**
→ `SESSION_SECRET` not set or `.env` not loaded. Check with: `cat /var/www/tilcons/.env | grep SESSION`

**Emails not sending**
→ SMTP credentials wrong. Test with: `pm2 logs tilcons | grep email`

---

## Environment Variables Summary

```env
# Required
NODE_ENV=production
DATABASE_URL=postgresql://...neon-url...?sslmode=require
SESSION_SECRET=your-64-char-random-string

# Recommended
APP_URL=https://yourdomain.com
PORT=5000

# Email notifications (optional but recommended for startup)
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
SMTP_FROM="Tilcons <noreply@yourdomain.com>"
SMTP_SECURE=false

# AI features (add later when ready)
AI_INTEGRATIONS_OPENAI_API_KEY=sk-...
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
```

---

## Alternative Deployment Options

### Option B — Render + Neon (Free, for testing)
- No SSH needed. Just connect GitHub → Render auto-deploys.
- Free tier sleeps after 15 min idle. Good for staging, not production.
- See [render.com](https://render.com)

### Option C — Vercel (Serverless)
- Frontend on Vercel + backend as serverless functions.
- Cold starts 1–2 seconds. Not ideal for heavy real-time ATS usage.
- Config already in repo: `vercel.json` + `api/index.ts`

---

## Prerequisites (all options)

You need a **free PostgreSQL database**. We recommend **Neon** (neon.tech):

1. Go to [neon.tech](https://neon.tech) → **Sign Up** (free, no card)
2. Create a new project → name it `tilcons`
3. Copy the **Connection string** — it looks like:
   ```
   postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Keep this — you'll need it as `DATABASE_URL`

---

## Option A — Render + Neon (Free, Recommended)

**What you get:** Always-on Node.js server + free PostgreSQL database.
**Time:** ~15 minutes.

### Step 1 — Push to GitHub

If you haven't already:

```bash
# In the project folder:
git init
git add .
git commit -m "Initial commit — Tilcons ATS + CRM"

# Create a repo at github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/tilcons.git
git push -u origin main
```

> ⚠️ Make sure `.env` is NOT committed (it's in `.gitignore`).
> Only `.env.example` should be in the repo.

### Step 2 — Create database tables

Run this **once** from your local machine, pointing at your Neon database:

```powershell
# PowerShell (Windows):
$env:DATABASE_URL="postgresql://...your-neon-url..."; npm run db:push
```

You should see: `All migrations executed successfully.`

### Step 3 — Create a Render account

1. Go to [render.com](https://render.com) → **Sign Up** (free, no card needed)
2. Connect your GitHub account when prompted

### Step 4 — Create a Web Service

1. Dashboard → **New +** → **Web Service**
2. Connect your `tilcons` GitHub repository
3. Configure:

| Setting | Value |
|---|---|
| **Name** | `tilcons` |
| **Region** | Choose closest to your users (e.g., Singapore for India) |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node dist/index.js` |
| **Instance Type** | `Free` |

4. Click **Advanced** → **Add Environment Variable** and add:

| Key | Value |
|---|---|
| `DATABASE_URL` | Your Neon connection string |
| `SESSION_SECRET` | A random 64-char string (see below) |
| `NODE_ENV` | `production` |
| `APP_URL` | `https://tilcons.onrender.com` (your Render URL) |

**Generate SESSION_SECRET** (PowerShell):
```powershell
-join ((1..32) | ForEach-Object { '{0:x}' -f (Get-Random -Max 256) })
```

5. Click **Create Web Service** — Render will start building.

### Step 5 — Create your admin account

Wait for the first deploy to finish, then run locally:

```powershell
$env:DATABASE_URL="postgresql://...your-neon-url..."; npm run create-admin
```

Enter your chosen username and password when prompted.

### Step 6 — Test

1. Open your Render URL (e.g., `https://tilcons.onrender.com`)
2. Go to `/signin` → log in with the admin credentials you just created
3. Verify the ATS workspace loads at `/admin/ats`

### Optional — Add email (SMTP)

If you want email notifications, add these to Render environment variables:

| Key | Value |
|---|---|
| `SMTP_HOST` | `mail.yourdomain.com` (or `smtp.gmail.com`) |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Your email address |
| `SMTP_PASS` | Your email password / App Password |
| `SMTP_FROM` | `"Tilcons <noreply@yourdomain.com>"` |

> **Free tip:** Bluehost cPanel includes email. Use `mail.yourdomain.com` as the SMTP host and your cPanel email credentials.

### Notes on the Free Tier

- The free Render instance **spins down after 15 minutes of inactivity** → first request after idle takes 30–60 seconds to wake up.
- To avoid cold starts, upgrade to Render's $7/month "Starter" tier, or use a free uptime monitor like [UptimeRobot](https://uptimerobot.com) to ping your URL every 5 minutes.
- Neon's free tier gives you 0.5 GB storage + 1 project. More than enough for Tilcons.

---

## Option B — Bluehost VPS (SSH Required)

> **Note:** This requires a Bluehost **VPS or Dedicated** plan with SSH access.
> Bluehost **shared hosting** does NOT support Node.js.

### Step 1 — SSH into your VPS

```bash
ssh root@your-vps-ip
```

### Step 2 — Install Node.js 20 via nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
node -v   # should print v20.x.x
```

### Step 3 — Install PM2 (process manager)

```bash
npm install -g pm2
```

### Step 4 — Clone the project

```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/tilcons.git
cd tilcons
npm install
```

### Step 5 — Set environment variables

```bash
nano .env
```

Paste and fill in:
```
DATABASE_URL=postgresql://...your-neon-url...
SESSION_SECRET=your-long-random-string
NODE_ENV=production
APP_URL=https://yourdomain.com
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-cpanel-email-password
SMTP_FROM="Tilcons <noreply@yourdomain.com>"
```

Save: `Ctrl+X`, then `Y`, then `Enter`.

### Step 6 — Build the app

```bash
npm run build
```

### Step 7 — Create database tables

```bash
npm run db:push
```

### Step 8 — Create admin account

```bash
npm run create-admin
```

### Step 9 — Start with PM2

```bash
pm2 start dist/index.js --name tilcons
pm2 save
pm2 startup   # Follow the printed command to auto-start on reboot
```

### Step 10 — Configure Nginx as reverse proxy

```bash
apt install nginx -y
nano /etc/nginx/sites-available/tilcons
```

Paste:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:
```bash
ln -s /etc/nginx/sites-available/tilcons /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Step 11 — SSL with Let's Encrypt (HTTPS)

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. SSL auto-renews every 90 days.

### Step 12 — Update Bluehost DNS

In your Bluehost cPanel → **Zone Editor** → update the `A` record for your domain to point to your VPS IP address.

### Managing the app

```bash
pm2 status            # Check if running
pm2 logs tilcons      # View logs
pm2 restart tilcons   # Restart after code changes
```

To update after pushing new code:
```bash
cd /var/www/tilcons
git pull
npm install
npm run build
pm2 restart tilcons
```

---

## Option C — Vercel (Serverless)

The project already has Vercel configuration (`vercel.json`, `api/index.ts`).

### Step 1 — Push to GitHub (same as Option A Step 1)

### Step 2 — Import into Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Vercel auto-detects `vercel.json`. Keep build settings as-is:
   - **Build Command**: `vite build`
   - **Output Directory**: `dist/public`

### Step 3 — Add environment variables

In Vercel → **Settings** → **Environment Variables**:

| Key | Value |
|---|---|
| `DATABASE_URL` | Neon connection string |
| `SESSION_SECRET` | Random 64-char string |
| `NODE_ENV` | `production` |
| `APP_URL` | Your Vercel URL |

### Step 4 — Create database tables (once)

```powershell
$env:DATABASE_URL="..."; npm run db:push
```

### Step 5 — Create admin account (once)

```powershell
$env:DATABASE_URL="..."; npm run create-admin
```

### Step 6 — Deploy

Click **Deploy**. Done!

> **Vercel limitation:** Functions time out after 30 seconds and cold-start for 1–2 seconds. For heavy AI features, Option A (Render) is better.

---

## Troubleshooting

### App shows 500 error on `/api/*`
Check your hosting platform's logs. Most common causes:
- `DATABASE_URL` not set or wrong
- `SESSION_SECRET` not set
- Database tables not created (run `npm run db:push`)

### Login doesn't persist / logs out immediately
- Confirm `DATABASE_URL` is correct — the session store needs it
- Check that `SESSION_SECRET` is set (same value across restarts)

### Emails not sending
- SMTP is optional — the app works without it
- Check `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` are all set
- Gmail requires an **App Password** (not your regular password)

### AI features show error
- OpenAI API key is not set — AI features are optional
- Set `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Render cold starts (slow first load)
- Free tier idles after 15 min. Use [UptimeRobot](https://uptimerobot.com) (free) to ping your URL every 5 minutes.

### "Database endpoint has been disabled" in logs
- Your Neon database has auto-suspended (free tier). Visit your Neon dashboard and resume the project.

---

## Quick Reference — All Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
SESSION_SECRET=your-64-char-random-string
NODE_ENV=production

# Recommended
APP_URL=https://your-app.onrender.com

# Email (optional — app works without)
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
SMTP_FROM="Tilcons <noreply@yourdomain.com>"
SMTP_SECURE=false

# AI features (optional — app works without)
AI_INTEGRATIONS_OPENAI_API_KEY=sk-...
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1
```
