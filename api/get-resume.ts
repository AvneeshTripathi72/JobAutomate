import type { VercelRequest, VercelResponse } from "@vercel/node";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { key } = req.query;

  if (!key || typeof key !== "string") {
    return res.status(400).json({ message: "Missing file key parameter" });
  }

  try {
    const data = await r2.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );

    // Set correct content type and disposition headers
    res.setHeader("Content-Type", data.ContentType || "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${key.split("/").pop()}"`);

    // Stream R2 body directly to client response
    const stream = data.Body as any;
    if (stream && typeof stream.pipe === "function") {
      stream.pipe(res);
    } else {
      const byteArray = await data.Body?.transformToByteArray();
      if (byteArray) {
        res.send(Buffer.from(byteArray));
      } else {
        throw new Error("Unable to read R2 stream body");
      }
    }
  } catch (err: any) {
    console.error("R2 GetObject Error:", err);
    return res.status(404).json({ message: "Resume file not found or access denied" });
  }
}
