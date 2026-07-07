# Deploying Tilcons to Hostinger

This guide is designed to make it as simple as possible to publish this application to Hostinger's Node.js environment (VPS or Advanced Shared Hosting).

## Step 1: Prepare the Project for Upload
1. Open a terminal in this project folder and run the build command to compile the React frontend and Express backend:
   ```bash
   npm run build
   ```
2. Once the build finishes, you will see a `dist` folder.
3. Select all the files and folders in this project directory (including `dist`, `app.js`, `package.json`, etc.) but **EXCLUDE** the `node_modules` folder and the `.git` folder.
4. Compress the selected files into a single ZIP file (e.g., `tilcons-app.zip`).

## Step 2: Upload to Hostinger
1. Log in to your Hostinger hPanel.
2. Go to your **Websites** and click **Manage** on your domain.
3. Navigate to **File Manager**.
4. Open the `public_html` directory (or the root directory of your app).
5. Click the **Upload** icon and upload your `tilcons-app.zip` file.
6. Once uploaded, right-click the ZIP file and select **Extract** to unpack the files directly into the folder.

## Step 3: Configure the Node.js App
1. In hPanel, go back to your domain dashboard and find the **Node.js** section (under Advanced).
2. Set the **Application Startup File** to `app.js` (this file has been provided in the root folder).
3. Set the **Node.js Version** to 18 or higher.
4. Click **Install NPM dependencies**. This will read your `package.json` and install the required modules.

## Step 4: Add Environment Variables
Before starting the app, it needs the database credentials and secrets to run.
1. In the Node.js settings or File Manager, create a file named `.env`.
2. Copy the contents of your `.env.example` file into this new `.env` file.
3. Fill in the real values for your database connection (`DATABASE_URL`), OpenAI key (`AI_INTEGRATIONS_OPENAI_API_KEY`), etc.

## Step 5: Start the App
1. In the Hostinger Node.js dashboard, click **Start App** or **Restart App**.
2. Visit your domain in the browser to confirm the platform is live!

> **Troubleshooting:** If you see an error, check the **Logs** button in the Node.js panel. Make sure that the `DATABASE_URL` is correct and that you remembered to run `npm run build` on your local machine before zipping the files.
