const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yeoavqufxojhraycowtu.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const NOTIFY_EMAILS = ["ashu@tilcons.com", "deep@tilcons.com"];

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !user || !pass) {
    console.warn("SMTP is not configured. Email notification skipped.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
};

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

  const { name, email, phone, inquiryType, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing required contact fields" });
  }

  try {
    // 1. Insert request into Supabase contacts table
    const { data, error } = await supabase
      .from("contacts")
      .insert([
        {
          name,
          email,
          phone: phone || null,
          inquiry_type: inquiryType || "Demo Request",
          message,
          status: "pending",
        },
      ])
      .select();

    if (error) throw error;

    // 2. Trigger Nodemailer email notification
    const transporter = getTransporter();
    if (transporter) {
      const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@tilcons.com";
      const subject = `New ${inquiryType || "Enquiry"} – ${name}`;
      
      const html = `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #0d2137; padding: 16px 20px; border-radius: 8px 8px 0 0;">
                <h2 style="color: #f26522; margin: 0; font-size: 20px;">${inquiryType || "New Enquiry"} – Tilcons</h2>
                <p style="color: #white; margin: 4px 0 0; font-size: 13px; color: #fff;">Submitted via Tilcons website</p>
              </div>

              <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none;">
                <h3 style="color: #0d2137; margin-top: 0;">Sender Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 6px 0; font-weight: bold; width: 180px;">Name:</td><td style="padding: 6px 0;">${name}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                  ${phone ? `<tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td style="padding: 6px 0;">${phone}</td></tr>` : ""}
                  <tr><td style="padding: 6px 0; font-weight: bold;">Inquiry Type:</td><td style="padding: 6px 0;"><strong>${inquiryType || "Demo Request"}</strong></td></tr>
                </table>

                <h3 style="color: #0d2137; margin-top: 16px;">Message / Request Details</h3>
                <p style="white-space: pre-wrap; margin: 0; background: #fff; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">${message}</p>

                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
                  <p>This is an automated notification from the Tilcons website demo request portal.</p>
                  <p><strong>Tileshwar Consulting Services Pvt. Ltd.</strong><br>710 GF Sector-1 Vasundhara, Ghaziabad, 201012<br>Phone: +91-7276105036 | Email: info@tilcons.com</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      await transporter.sendMail({
        from,
        to: NOTIFY_EMAILS.join(", "),
        subject,
        html,
      });
    }

    return res.status(200).json(data[0]);
  } catch (err) {
    console.error("Contacts API error:", err);
    return res.status(500).json({ message: err.message || "Failed to submit request" });
  }
};
