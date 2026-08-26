import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

  const httpServer = createServer(app);
  return httpServer;
}
