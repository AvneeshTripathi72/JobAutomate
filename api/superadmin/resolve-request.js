const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yeoavqufxojhraycowtu.supabase.co";
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !user || !pass) {
    console.warn("SMTP is not configured. Resolution email skipped.");
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

  const { requestId, action, plan } = req.body;

  if (!requestId || !action) {
    return res.status(400).json({ message: "Missing requestId or action" });
  }

  try {
    // 1. Fetch the request from contacts table
    const { data: requestData, error: fetchError } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError || !requestData) {
      return res.status(404).json({ message: "Onboarding request not found" });
    }

    const { name, email, message } = requestData;
    const transporter = getTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@tilcons.com";

    // ─── CASE A: ACCEPT REQUEST (ONBOARD) ─────────────────────────────────────
    if (action === "accept") {
      // Parse company name from structured message
      let companyName = name + "'s Team";
      if (message) {
        const companyMatch = message.match(/Company:\s*(.*)/i);
        if (companyMatch && companyMatch[1]) {
          companyName = companyMatch[1].trim();
        }
      }

      // a. Insert company into DB
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert([{
          name: companyName,
          plan: plan || "starter",
          isActive: true
        }])
        .select();

      if (companyError) throw companyError;
      const company = companyData[0];

      // b. Generate a random temporary password
      const tempPassword = "Tilcons@" + Math.random().toString(36).substring(2, 8) + "!";

      // c. Create the user in Supabase Auth using Admin Auth API
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          fullName: name,
          role: "company_admin",
          companyId: company.id
        }
      });

      if (userError) {
        // Rollback company insertion on failure
        await supabase.from("companies").delete().eq("id", company.id);
        throw userError;
      }

      // d. Update contact status to 'accepted'
      await supabase
        .from("contacts")
        .update({ status: "accepted" })
        .eq("id", requestId);

      // e. Send Acceptance Email
      if (transporter) {
        const html = `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #0d2137; padding: 16px 20px; border-radius: 8px 8px 0 0;">
                  <h2 style="color: #f26522; margin: 0; font-size: 20px;">Welcome to Tilcons ATS + CRM! 🎉</h2>
                  <p style="color: #fff; margin: 4px 0 0; font-size: 13px;">Your recruitment portal is now active</p>
                </div>

                <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none;">
                  <p>Hi ${name},</p>
                  <p>We are thrilled to let you know that your demo and onboarding request for <strong>${companyName}</strong> has been approved! Your Tilcons workspace is now active.</p>

                  <p>Here are your temporary admin login credentials:</p>
                  <table style="width: 100%; border-collapse: collapse; margin: 18px 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px;">
                    <tr><td style="padding: 10px; font-weight: bold; width: 120px; border-bottom: 1px solid #e2e8f0;">Username/Email:</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td></tr>
                    <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Password:</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace;"><code>${tempPassword}</code></td></tr>
                    <tr><td style="padding: 10px; font-weight: bold;">Workspace Plan:</td><td style="padding: 10px; text-transform: uppercase; color: #f26522; font-weight: bold;">${plan || "starter"}</td></tr>
                  </table>

                  <div style="text-align: center; margin: 28px 0;">
                    <a href="https://job-automate-c62r.vercel.app/signin" style="background: #0ea5e9; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; display: inline-block; letter-spacing: 0.5px;">Sign In to Workspace</a>
                  </div>

                  <p style="font-size: 12px; color: #64748b; font-style: italic;">Note: For security reasons, please change your password immediately upon your first sign-in.</p>

                  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
                    <p><strong>Tileshwar Consulting Services Pvt. Ltd.</strong><br>710 GF Sector-1 Vasundhara, Ghaziabad, 201012<br>Phone: +91-7276105036 | Email: info@tilcons.com</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `;

        await transporter.sendMail({
          from,
          to: email,
          subject: "Your Tilcons ATS + CRM Workspace is Ready!",
          html,
        });
      }

      return res.status(200).json({ success: true, company, tempPassword });
    }

    // ─── CASE B: REJECT REQUEST ──────────────────────────────────────────────
    if (action === "reject") {
      // a. Update contact status to 'rejected'
      await supabase
        .from("contacts")
        .update({ status: "rejected" })
        .eq("id", requestId);

      // b. Send Rejection Email
      if (transporter) {
        const html = `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #0d2137; padding: 16px 20px; border-radius: 8px 8px 0 0;">
                  <h2 style="color: #64748b; margin: 0; font-size: 20px;">Demo Request Update</h2>
                  <p style="color: #fff; margin: 4px 0 0; font-size: 13px;">Tilcons ATS + CRM</p>
                </div>

                <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none;">
                  <p>Hi ${name},</p>
                  <p>Thank you for your interest in Tilcons ATS + CRM. We received your request for a platform demo and workspace onboarding.</p>
                  <p>After reviewing your company profile, we regret to inform you that we cannot approve your workspace request at this time. Our platform is currently optimized specifically for active staffing agencies with dedicated recruiting teams in India.</p>
                  <p>If you feel this was in error, please reach out to our team at <a href="mailto:info@tilcons.com">info@tilcons.com</a> to provide additional business details.</p>

                  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
                    <p>Best regards,<br>The Tilcons Team</p>
                    <p><strong>Tileshwar Consulting Services Pvt. Ltd.</strong><br>710 GF Sector-1 Vasundhara, Ghaziabad, 201012<br>Phone: +91-7276105036 | Email: info@tilcons.com</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `;

        await transporter.sendMail({
          from,
          to: email,
          subject: "Update on your Tilcons Onboarding Request",
          html,
        });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ message: "Invalid action type" });

  } catch (err) {
    console.error("Resolve request route error:", err);
    return res.status(500).json({ message: err.message || "Failed to resolve request" });
  }
};
