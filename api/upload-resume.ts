import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yeoavqufxojhraycowtu.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "l7Mhv0iVctVmF4wcukTv1UgRouxnF39MK8dvRz_BalU"; // We extract just the signature part or use the one from env

const getSupabaseClient = () => {
  // Use service role key to ensure we can check and create buckets programmatically
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllb2F2cXVmeG9qaHJheWNvd3R1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUwNTMxOCwiZXhwIjoyMDk5MDgxMzE4fQ.l7Mhv0iVctVmF4wcukTv1UgRouxnF39MK8dvRz_BalU";
  
  return createClient(supabaseUrl, key);
};

// Vercel serverless function for resume upload to Supabase Storage
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { default: Busboy } = await import("busboy");

    return new Promise<void>((resolve) => {
      const bb = Busboy({
        headers: req.headers as Record<string, string>,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
      });

      let fileBuffer: Buffer | null = null;
      let fileName = "resume";
      let fileMimeType = "application/pdf";

      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      bb.on("file", (_fieldname: string, file: any, info: { filename: string; mimeType: string }) => {
        const chunks: Buffer[] = [];
        fileName = info.filename || "resume";
        fileMimeType = info.mimeType || "application/pdf";

        if (!allowed.includes(fileMimeType)) {
          file.resume();
          return;
        }

        file.on("data", (chunk: Buffer) => chunks.push(chunk));
        file.on("end", () => {
          fileBuffer = Buffer.concat(chunks);
        });
      });

      bb.on("finish", async () => {
        if (!fileBuffer) {
          res.status(400).json({
            message: "No valid file provided. Only PDF, DOC, DOCX allowed.",
          });
          resolve();
          return;
        }

        try {
          const supabase = getSupabaseClient();
          
          // 1. Ensure the "resumes" bucket exists and is public
          const { data: buckets, error: listError } = await supabase.storage.listBuckets();
          if (listError) throw listError;
          
          const hasBucket = buckets?.some((b) => b.name === "resumes");
          if (!hasBucket) {
            const { error: createError } = await supabase.storage.createBucket("resumes", {
              public: true,
              fileSizeLimit: 5242880 // 5 MB
            });
            if (createError) throw createError;
          }

          // 2. Upload file to Supabase Storage
          const timestamp = Date.now();
          const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
          const key = `${timestamp}_${safeName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("resumes")
            .upload(key, fileBuffer, {
              contentType: fileMimeType,
              upsert: true
            });

          if (uploadError) throw uploadError;

          // 3. Get Public URL
          const { data: urlData } = supabase.storage
            .from("resumes")
            .getPublicUrl(key);

          const publicUrl = urlData.publicUrl;
          res.status(200).json({ url: publicUrl, key: uploadData.path });
          resolve();
        } catch (uploadErr: any) {
          console.error("Supabase Storage upload error:", uploadErr);
          res.status(500).json({ message: uploadErr.message || "Supabase Storage upload failed" });
          resolve();
        }
      });

      bb.on("error", (err: Error) => {
        console.error("Busboy error:", err);
        res.status(500).json({ message: "File parsing error" });
        resolve();
      });

      req.pipe(bb);
    });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return res.status(500).json({ message: err.message || "Upload failed" });
  }
}

// Disable Vercel's default body parser so we can handle multipart manually
export const config = {
  api: {
    bodyParser: false,
  },
};
