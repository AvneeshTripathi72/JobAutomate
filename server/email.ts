/**
 * email.ts — Nodemailer SMTP implementation
 *
 * Required environment variables:
 *   SMTP_HOST  — mail server hostname, e.g. mail.tilcons.com or smtp.gmail.com
 *   SMTP_PORT  — 465 (SSL) or 587 (TLS/STARTTLS); defaults to 587
 *   SMTP_USER  — SMTP login (usually the full email address)
 *   SMTP_PASS  — SMTP password
 *   SMTP_FROM  — "From" address, e.g. "Tilcons <noreply@tilcons.com>"
 *   SMTP_SECURE — set to "true" for port 465 SSL; omit / "false" for STARTTLS
 *
 * Notification recipients (hard-coded, same as before):
 *   ashu@tilcons.com, deep@tilcons.com
 */

import nodemailer from 'nodemailer';

// Local attachment type — matches nodemailer's internal Attachment shape
interface Attachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

const NOTIFY_EMAILS = [
  'ashu@tilcons.com',
  'deep@tilcons.com',
];

// ─── Transporter (lazy singleton) ─────────────────────────────────────────────

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (_transporter) return _transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true';   // true = port 465 SSL

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS in your .env file.'
    );
  }

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: {
      // Accept self-signed certs — common on cPanel / Bluehost mail servers
      rejectUnauthorized: false,
    },
  });

  return _transporter;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResumeEmailData {
  fullName: string;
  email: string;
  phone: string;
  desiredPosition: string;
  yearsExperience: number;
  skills: string;
  linkedIn?: string;
  additionalInfo?: string;
  resumeFile?: {
    filename: string;
    contentType: string;
    data: string;   // base64
  };
}

interface ApplicationEmailData {
  applicantName: string;
  email: string;
  phone: string;
  jobTitle: string;
  coverLetter?: string;
  resumeFile?: {
    filename: string;
    contentType: string;
    data: string;   // base64
  };
}

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  message?: string;
  inquiryType?: string;
}

// ─── Shared send helper ───────────────────────────────────────────────────────

async function sendEmail(
  subject: string,
  htmlBody: string,
  attachments?: Attachment[],
  recipients?: string[],
): Promise<boolean> {
  const toList = recipients && recipients.length > 0 ? recipients : NOTIFY_EMAILS;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@tilcons.com';

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from,
      to: toList.join(', '),
      subject,
      html: htmlBody,
      attachments,
    });
    console.log(`Email sent to ${toList.join(', ')}: ${subject}`);
    return true;
  } catch (err: any) {
    // Surface the error — callers already handle false/throw gracefully
    throw err;
  }
}

// ─── Password Reset email (sent to candidate) ─────────────────────────────────

export async function sendPasswordResetEmail(toEmail: string, fullName: string, resetUrl: string) {
  try {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #0d2137; padding: 16px 20px; border-radius: 8px 8px 0 0;">
              <h2 style="color: #f26522; margin: 0; font-size: 20px;">Reset Your Password</h2>
              <p style="color: #fff; margin: 4px 0 0; font-size: 13px;">Tilcons Candidate Portal</p>
            </div>

            <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none;">
              <p>Hi ${fullName},</p>
              <p>We received a request to reset the password for your Tilcons candidate account. Click the button below to choose a new password. This link will expire in <strong>1 hour</strong>.</p>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${resetUrl}" style="background: #f26522; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; display: inline-block; letter-spacing: 0.5px;">Reset Password</a>
              </div>

              <p style="font-size: 13px; color: #64748b;">If the button does not work, copy and paste this URL into your browser:</p>
              <p style="font-size: 12px; word-break: break-all; background: #fff; padding: 10px; border-radius: 4px; border: 1px solid #e2e8f0;">${resetUrl}</p>

              <p style="font-size: 13px; color: #64748b; margin-top: 20px;">If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.</p>

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
                <p><strong>Tileshwar Consulting Services Pvt. Ltd.</strong><br>710 GF Sector-1 Vasundhara, Ghaziabad, 201012<br>Phone: +91-7276105036 | Email: info@tilcons.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    return await sendEmail(
      'Reset your Tilcons password',
      html,
      undefined,
      [toEmail],
    );
  } catch (error) {
    throw error;
  }
}

// ─── CV / Resume submission ───────────────────────────────────────────────────

export async function sendResumeNotificationEmail(resumeData: ResumeEmailData) {
  try {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #0d2137; padding: 16px 20px; border-radius: 8px 8px 0 0;">
              <h2 style="color: #f26522; margin: 0; font-size: 20px;">New CV / Resume Submission</h2>
              <p style="color: #fff; margin: 4px 0 0; font-size: 13px;">Tilcons Recruitment Platform</p>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none;">
              <h3 style="color: #0d2137; margin-top: 0;">Candidate Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; font-weight: bold; width: 180px;">Full Name:</td><td style="padding: 6px 0;">${resumeData.fullName}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${resumeData.email}">${resumeData.email}</a></td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td style="padding: 6px 0;">${resumeData.phone}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Desired Position:</td><td style="padding: 6px 0;">${resumeData.desiredPosition}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Years of Experience:</td><td style="padding: 6px 0;">${resumeData.yearsExperience} years</td></tr>
                ${resumeData.linkedIn ? `<tr><td style="padding: 6px 0; font-weight: bold;">LinkedIn:</td><td style="padding: 6px 0;"><a href="${resumeData.linkedIn}">${resumeData.linkedIn}</a></td></tr>` : ''}
              </table>

              <h3 style="color: #0d2137; margin-top: 16px;">Skills &amp; Expertise</h3>
              <p style="white-space: pre-wrap; margin: 0; background: #fff; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">${resumeData.skills}</p>

              ${resumeData.additionalInfo ? `
              <h3 style="color: #0d2137; margin-top: 16px;">Additional Information</h3>
              <p style="white-space: pre-wrap; margin: 0; background: #fff; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">${resumeData.additionalInfo}</p>
              ` : ''}

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
                <p>This is an automated notification from the Tilcons website CV submission form.</p>
                <p><strong>Tileshwar Consulting Services Pvt. Ltd.</strong><br>710 GF Sector-1 Vasundhara, Ghaziabad, 201012<br>Phone: +91-7276105036 | Email: info@tilcons.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const attachments: Attachment[] = resumeData.resumeFile
      ? [{
          filename: resumeData.resumeFile.filename,
          content: Buffer.from(resumeData.resumeFile.data, 'base64'),
          contentType: resumeData.resumeFile.contentType,
        }]
      : [];

    return await sendEmail(
      `New CV Submission – ${resumeData.fullName} (${resumeData.desiredPosition})`,
      html,
      attachments.length > 0 ? attachments : undefined,
    );
  } catch (error) {
    throw error;
  }
}

// ─── Job application (Apply Now) ──────────────────────────────────────────────

export async function sendApplicationNotificationEmail(data: ApplicationEmailData) {
  try {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #0d2137; padding: 16px 20px; border-radius: 8px 8px 0 0;">
              <h2 style="color: #f26522; margin: 0; font-size: 20px;">New Job Application Received</h2>
              <p style="color: #fff; margin: 4px 0 0; font-size: 13px;">Role: ${data.jobTitle}</p>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none;">
              <h3 style="color: #0d2137; margin-top: 0;">Applicant Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; font-weight: bold; width: 180px;">Full Name:</td><td style="padding: 6px 0;">${data.applicantName}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td style="padding: 6px 0;">${data.phone || 'Not provided'}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Applied For:</td><td style="padding: 6px 0;"><strong>${data.jobTitle}</strong></td></tr>
              </table>

              ${data.coverLetter ? `
              <h3 style="color: #0d2137; margin-top: 16px;">Cover Letter / Notes</h3>
              <p style="white-space: pre-wrap; margin: 0; background: #fff; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">${data.coverLetter}</p>
              ` : ''}

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
                <p>This is an automated notification from the Tilcons website job application form.</p>
                <p><strong>Tileshwar Consulting Services Pvt. Ltd.</strong><br>710 GF Sector-1 Vasundhara, Ghaziabad, 201012<br>Phone: +91-7276105036 | Email: info@tilcons.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const attachments: Attachment[] = data.resumeFile
      ? [{
          filename: data.resumeFile.filename,
          content: Buffer.from(data.resumeFile.data, 'base64'),
          contentType: data.resumeFile.contentType,
        }]
      : [];

    return await sendEmail(
      `New Application – ${data.applicantName} for ${data.jobTitle}`,
      html,
      attachments.length > 0 ? attachments : undefined,
    );
  } catch (error) {
    throw error;
  }
}

// ─── Job Description / Contact form submission ────────────────────────────────

export async function sendContactNotificationEmail(data: ContactEmailData) {
  try {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #0d2137; padding: 16px 20px; border-radius: 8px 8px 0 0;">
              <h2 style="color: #f26522; margin: 0; font-size: 20px;">${data.inquiryType || 'New Enquiry'} – Tilcons</h2>
              <p style="color: #fff; margin: 4px 0 0; font-size: 13px;">Submitted via Tilcons website</p>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none;">
              <h3 style="color: #0d2137; margin-top: 0;">Sender Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; font-weight: bold; width: 180px;">Name:</td><td style="padding: 6px 0;">${data.name}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
                ${data.phone ? `<tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td style="padding: 6px 0;">${data.phone}</td></tr>` : ''}
                ${data.company ? `<tr><td style="padding: 6px 0; font-weight: bold;">Company:</td><td style="padding: 6px 0;">${data.company}</td></tr>` : ''}
                ${data.jobTitle ? `<tr><td style="padding: 6px 0; font-weight: bold;">Job Title / Role:</td><td style="padding: 6px 0;"><strong>${data.jobTitle}</strong></td></tr>` : ''}
              </table>

              ${data.message ? `
              <h3 style="color: #0d2137; margin-top: 16px;">Message / Job Details</h3>
              <p style="white-space: pre-wrap; margin: 0; background: #fff; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">${data.message}</p>
              ` : ''}

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
                <p>This is an automated notification from the Tilcons website.</p>
                <p><strong>Tileshwar Consulting Services Pvt. Ltd.</strong><br>710 GF Sector-1 Vasundhara, Ghaziabad, 201012<br>Phone: +91-7276105036 | Email: info@tilcons.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    return await sendEmail(
      `${data.inquiryType || 'New Enquiry'} – ${data.name}${data.company ? ` (${data.company})` : ''}`,
      html,
    );
  } catch (error) {
    throw error;
  }
}

// ─── Interview Reminder (Candidate + Interviewer) ─────────────────────────────

interface InterviewReminderData {
  candidateName: string;
  candidateEmail: string;
  interviewerName: string;
  interviewerEmail?: string;
  jobTitle: string;
  scheduledAt: Date;
  mode: string;
}

export async function sendInterviewReminderEmail(data: InterviewReminderData) {
  try {
    const formattedDate = new Date(data.scheduledAt).toLocaleString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #0d2137; padding: 16px 20px; border-radius: 8px 8px 0 0;">
              <h2 style="color: #0ea5e9; margin: 0; font-size: 20px;">Interview Scheduled: ${data.jobTitle}</h2>
              <p style="color: #fff; margin: 4px 0 0; font-size: 13px;">Tilcons Applicant Tracking</p>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none;">
              <p>Hello,</p>
              <p>An interview has been scheduled for the <strong>${data.jobTitle}</strong> position.</p>

              <table style="width: 100%; border-collapse: collapse; margin-top: 16px; background: #fff; border: 1px solid #e2e8f0; border-radius: 4px;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 140px;">Candidate:</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${data.candidateName}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Interviewer:</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${data.interviewerName}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Date & Time:</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #f26522; font-weight: bold;">${formattedDate}</td></tr>
                <tr><td style="padding: 10px; font-weight: bold;">Mode:</td><td style="padding: 10px; text-transform: capitalize;">${data.mode}</td></tr>
              </table>

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
                <p>This is an automated calendar reminder from Tilcons.</p>
                <p><strong>Tileshwar Consulting Services Pvt. Ltd.</strong></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const recipients = [data.candidateEmail];
    if (data.interviewerEmail) recipients.push(data.interviewerEmail);

    return await sendEmail(
      `Interview Invitation: ${data.jobTitle} – ${data.candidateName}`,
      html,
      undefined,
      recipients
    );
  } catch (error) {
    throw error;
  }
}

export async function sendBulkEmail(emails: string[], subject: string, body: string) {
  try {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              ${body.replace(/\n/g, "<br/>")}
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
                <p><strong>Tileshwar Consulting Services Pvt. Ltd.</strong></p>
                <p>You are receiving this email because you are registered with Tilcons.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send emails in a batch
    const promises = emails.map(email => sendEmail(subject, html, undefined, [email]));
    await Promise.allSettled(promises);
  } catch (error) {
    console.error("Error in bulk email:", error);
    throw error;
  }
}
