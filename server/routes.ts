import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

// ── R2 (S3-compatible) client ─────────────────────────────────────────────────
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

// ── Multer: in-memory storage (max 5 MB) ──────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // ── Resume file upload → Cloudflare R2 ────────────────────────────────────
  app.post("/api/upload-resume", upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file provided" });
      }

      const timestamp = Date.now();
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = `resumes/${timestamp}_${safeName}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      const publicUrl = `${PUBLIC_URL}/${key}`;

      return res.json({ url: publicUrl, key });
    } catch (err: any) {
      console.error("R2 upload error:", err);
      return res.status(500).json({ message: err.message || "Upload failed" });
    }
  });

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yeoavqufxojhraycowtu.supabase.co";
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const fallbackArticles = [
    {
      id: "fb-1",
      title: "How to Ace Your Technical Interview: Tips from Recruiter Panel",
      category: "Interview Tips",
      excerpt: "Technical interviews can be daunting. Learn the exact strategies, coding practice routines, and behavioral answers that top recruiters look for.",
      content: "A technical interview is more than just coding. It's about problem-solving, communication, and showing your engineering practices. First, always clarify the question. Don't start coding immediately. Second, walk through your brute-force approach first, then optimize. Third, write clean, modular code with descriptive variable names. Finally, test your edge cases and walk through dry runs.",
      author: "Tilcons Team",
      readTime: "5 min read",
      published: true,
      publishedDate: "2026-08-27T10:00:00Z"
    },
    {
      id: "fb-2",
      title: "5 Common Resume Mistakes You Need to Avoid",
      category: "Career Advice",
      excerpt: "Your resume is your first impression. Make sure it stands out for the right reasons by avoiding these classic layout and content mistakes.",
      content: "Many qualified candidates get rejected because of poor resume structure. 1. Unclear bullet points: Use the X-Y-Z formula (Accomplished [X] as measured by [Y], by doing [Z]). 2. Typos and formatting issues: Ensure margins and fonts are consistent. 3. Too generic: Tailor your resume keywords to the job description. 4. Wall of text: Use bullet points instead of paragraphs. 5. Irrelevant information: Focus on recent experience.",
      author: "Senior Recruiter",
      readTime: "4 min read",
      published: true,
      publishedDate: "2026-08-27T10:00:00Z"
    },
    {
      id: "fb-3",
      title: "Mastering the Art of Remote Collaboration",
      category: "Workplace Success",
      excerpt: "With remote work here to stay, building strong virtual communication and boundary management habits is critical for your career growth.",
      content: "Remote collaboration requires intentionality. Over-communication is key—keep your team updated on your progress via Slack or Teams. Manage your time effectively by setting clear boundaries between work and personal life. Use video calls for complex topics to build stronger relationships with colleagues. Document your processes so team members can work asynchronously without blockers.",
      author: "Tilcons Recruiter",
      readTime: "3 min read",
      published: true,
      publishedDate: "2026-08-27T10:00:00Z"
    },
    {
      id: "fb-4",
      title: "How to Negotiate Your Salary: A Recruiter's Perspective",
      category: "Career Advice",
      excerpt: "Salary negotiations don't have to be stressful. Learn how to research market rates and articulate your value during the offer stage.",
      content: "Negotiating your salary is a normal part of the hiring process. Start by researching market rates for your role and location using tools like Glassdoor or LinkedIn Salary. Never give a number first if possible—ask for the budget range instead. When presenting your counter-offer, focus on the value you bring to the company, citing specific achievements from your previous roles.",
      author: "Lead Recruiter",
      readTime: "6 min read",
      published: true,
      publishedDate: "2026-08-27T10:00:00Z"
    },
    {
      id: "fb-5",
      title: "Transitioning to a Tech Manager Role: What to Expect",
      category: "Leadership",
      excerpt: "Moving from individual contributor to engineering manager is a major career pivot. Here is how to navigate the transition successfully.",
      content: "Transitioning to a management role means shifting your focus from writing code to helping others write code. Your success is now measured by your team's output, not just your own. Focus on building trust through regular 1-on-1s. Learn to delegate task assignments instead of taking on all critical tasks yourself. Develop your soft skills, as communication and conflict resolution will become daily tasks.",
      author: "Hiring Manager",
      readTime: "5 min read",
      published: true,
      publishedDate: "2026-08-27T10:00:00Z"
    }
  ];

  app.get("/api/articles", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("published_date", { ascending: false });

      if (error || !data || data.length === 0) {
        return res.json(fallbackArticles);
      }

      const mapped = data.map(row => ({
        id: row.id,
        title: row.title,
        category: row.category,
        excerpt: row.excerpt,
        content: row.content,
        author: row.author,
        readTime: row.read_time,
        published: row.published,
        publishedDate: row.published_date
      }));

      return res.json(mapped);
    } catch (err) {
      console.error("Local articles error, using fallback:", err);
      return res.json(fallbackArticles);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
