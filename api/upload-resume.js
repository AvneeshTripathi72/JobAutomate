const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const Busboy = require("busboy");

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "c6482e7f02a98ecdc8a0f7d2a9d14f6e";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "f8936454ca4abdd1d726f93a611e83b6";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "32f9ac9e5b6a1132e7bdd9cce43c8af68d0ff9410d43d94903b6305fb2d1da26";
const BUCKET = process.env.R2_BUCKET_NAME || "first";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

module.exports = async function handler(req, res) {
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
    return new Promise((resolve) => {
      let isFinished = false;

      const bb = Busboy({
        headers: req.headers,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
      });

      let fileBuffer = null;
      let fileName = "resume";
      let fileMimeType = "application/pdf";

      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      bb.on("file", (_fieldname, file, info) => {
        try {
          const chunks = [];
          fileName = info.filename || "resume";
          fileMimeType = info.mimeType || "application/pdf";

          if (!allowed.includes(fileMimeType)) {
            file.resume();
            return;
          }

          file.on("data", (chunk) => chunks.push(chunk));
          file.on("end", () => {
            fileBuffer = Buffer.concat(chunks);
          });
        } catch (err) {
          console.error("Error in busboy file event:", err);
          if (!isFinished) {
            isFinished = true;
            res.status(500).json({ message: `File event error: ${err.message}` });
            resolve();
          }
        }
      });

      bb.on("finish", async () => {
        if (isFinished) return;
        isFinished = true;

        if (!fileBuffer) {
          res.status(400).json({
            message: "No valid file provided. Only PDF, DOC, DOCX allowed.",
          });
          resolve();
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

          // Return proxy URL to keep the file private on R2
          const publicUrl = `/api/get-resume?key=${key}`;
          res.status(200).json({ url: publicUrl, key });
          resolve();
        } catch (uploadErr) {
          console.error("R2 upload error:", uploadErr);
          res.status(500).json({ message: `R2 upload failed: ${uploadErr.message}` });
          resolve();
        }
      });

      bb.on("error", (err) => {
        console.error("Busboy error:", err);
        if (!isFinished) {
          isFinished = true;
          res.status(500).json({ message: `Busboy error: ${err.message}` });
          resolve();
        }
      });

      req.pipe(bb);
    });
  } catch (err) {
    console.error("Upload handler error:", err);
    return res.status(500).json({ message: `Upload failed: ${err.message}`, stack: err.stack });
  }
};

// Disable Vercel's default body parser so we can handle multipart manually
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
