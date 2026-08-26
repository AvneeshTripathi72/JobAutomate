import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

// Load .env.local for server-side env vars (R2 keys)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const rootDir = process.cwd();

function r2UploadPlugin(): Plugin {
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

  return {
    name: "r2-upload-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== "POST" || req.url !== "/api/upload-resume") {
          return next();
        }

        try {
          // Parse multipart form data manually using Busboy
          const { default: Busboy } = await import("busboy");
          const bb = Busboy({ headers: req.headers as any, limits: { fileSize: 5 * 1024 * 1024 } });

          let fileBuffer: Buffer | null = null;
          let fileName = "resume";
          let fileMimeType = "application/pdf";

          bb.on("file", (_fieldname: string, file: any, info: { filename: string; mimeType: string }) => {
            const chunks: Buffer[] = [];
            fileName = info.filename || "resume";
            fileMimeType = info.mimeType || "application/pdf";

            const allowed = [
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
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
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "No valid file provided. Only PDF, DOC, DOCX allowed." }));
              return;
            }

            try {
              const timestamp = Date.now();
              const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
              const key = `resumes/${timestamp}_${safeName}`;

              await r2.send(
                new PutObjectCommand({
                  Bucket: BUCKET,
                  Key: key,
                  Body: fileBuffer,
                  ContentType: fileMimeType,
                })
              );

              const publicUrl = `${PUBLIC_URL}/${key}`;
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ url: publicUrl, key }));
            } catch (uploadErr: any) {
              console.error("R2 upload error:", uploadErr);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: uploadErr.message || "R2 upload failed" }));
            }
          });

          bb.on("error", (err: Error) => {
            console.error("Busboy error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "File parsing error" }));
          });

          req.pipe(bb);
        } catch (err: any) {
          console.error("Upload handler error:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: err.message || "Upload failed" }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    r2UploadPlugin(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "client", "src"),
      "@shared": path.resolve(rootDir, "shared"),
      "@assets": path.resolve(rootDir, "attached_assets"),
    },
  },
  root: path.resolve(rootDir, "client"),
  build: {
    outDir: path.resolve(rootDir, "dist/public"),
    emptyOutDir: true,
    target: "esnext",
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
