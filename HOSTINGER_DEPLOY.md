# Deploying to Hostinger (Serverless / Static Architecture)

This project has been upgraded to a **Supabase + Vercel Serverless Architecture**. 
However, you can easily deploy the **React frontend** to any Hostinger Shared Hosting or VPS environment.

## Step 1: Build the Static Frontend
1. Open a terminal in the root of your project folder.
2. Ensure you have your latest `.env` or `.env.local` variables set (especially `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
3. Run the following command to compile the React application:
   ```bash
   npm run build
   ```
4. This will create a `dist` folder. Inside this folder, you will find a `public` directory. This `public` directory contains your fully compiled, production-ready frontend.

## Step 2: Upload to Hostinger
1. Log in to your Hostinger **hPanel**.
2. Go to **Websites** and click **Manage** on your domain.
3. Open the **File Manager**.
4. Navigate to the `public_html` directory (or the root directory of your website).
5. Zip the contents of your local `dist/public` folder into a single file (e.g. `upload.zip`).
6. Click the **Upload** icon in Hostinger and select your `upload.zip` file.
7. Right-click the uploaded ZIP file and select **Extract**. 

## Step 3: Handle Client-Side Routing (Important)
Because this is a Single Page Application (SPA), you need to tell Hostinger to route all traffic to `index.html`.
1. In your `public_html` folder on Hostinger, create or edit the `.htaccess` file.
2. Add the following rules:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
3. Save the file.

## Admin Bypass Credentials
As requested, you can now manage bypass credentials in your `.env` file before running the build:
```env
VITE_BYPASS_ADMIN_USERNAME=admin@tilcons.com
VITE_BYPASS_ADMIN_PASSWORD=SecureAdmin2026!
VITE_BYPASS_SUPERADMIN_USERNAME=superadmin@tilcons.com
VITE_BYPASS_SUPERADMIN_PASSWORD=SecureSuper2026!
```
These will automatically appear on the Sign In page and bypass the login forms when clicked. 

> **Note:** If you are trying to run the `/api/*` (Node.js) endpoints on Hostinger, you must deploy this using the **Hostinger Node.js VPS** setup by uploading the entire project (including `server/index.ts`) and setting the startup command to compile and run the Express wrapper. However, since the app is heavily Supabase-driven now, deploying the static frontend and letting it talk directly to Supabase is the easiest path!
