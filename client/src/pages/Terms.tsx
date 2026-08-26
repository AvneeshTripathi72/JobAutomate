import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using the Tilcons website and related services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the site.",
  },
  {
    title: "2. Eligibility",
    body: "You must be at least 18 years old (or the age of majority in your jurisdiction) to create an account or apply to roles through Tilcons.",
  },
  {
    title: "3. Account Responsibilities",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at support@tilcons.com if you suspect any unauthorised use.",
  },
  {
    title: "4. Candidate Information",
    body: "You confirm that any CV, profile or supporting information you submit is accurate, up to date, and lawfully provided. Misrepresentation may result in suspension of your account and withdrawal from active processes.",
  },
  {
    title: "5. Employer & Vendor Use",
    body: "Employers and vendor partners may only use information accessed through Tilcons for legitimate recruitment purposes connected to roles processed via our services. Bulk extraction, resale, or use for unsolicited marketing is prohibited.",
  },
  {
    title: "6. Acceptable Use",
    body: "You agree not to misuse the site, attempt to gain unauthorised access, upload malicious content, or interfere with the operation of the platform or other users.",
  },
  {
    title: "7. Intellectual Property",
    body: "All content, branding and software on this site are owned by Tileshwar Consulting Services Pvt. Ltd. or its licensors and are protected by applicable intellectual property laws.",
  },
  {
    title: "8. Disclaimers",
    body: "The site and services are provided on an \"as is\" and \"as available\" basis. We do not guarantee placement, employment outcomes, or uninterrupted availability of the site.",
  },
  {
    title: "9. Limitation of Liability",
    body: "To the maximum extent permitted by law, Tilcons shall not be liable for any indirect, incidental or consequential damages arising from your use of the site or services.",
  },
  {
    title: "10. Governing Law",
    body: "These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts at the registered office of Tileshwar Consulting Services Pvt. Ltd.",
  },
  {
    title: "11. Changes",
    body: "We may update these Terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the revised Terms.",
  },
  {
    title: "12. Contact",
    body: "Questions about these Terms can be sent to legal@tilcons.com.",
  },
];

export default function Terms() {
  useDocumentMeta(
    "Terms of Service",
    "Terms governing the use of Tilcons recruitment website and services for candidates, employers and vendor partners."
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section
        className="relative py-16 md:py-20 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #163554 100%)` }}
      >
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: SKY }} />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 border" style={{ background: `${SKY}1A`, borderColor: `${SKY}4D`, color: SKY }}>
            <FileText className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-white/60 text-base max-w-2xl">
            The rules for using Tilcons as a candidate, employer or vendor partner.
          </p>
          <p className="text-white/40 text-xs mt-4 uppercase tracking-widest">
            Effective Date: 1 January 2024
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
          <p className="text-sm text-muted-foreground leading-relaxed">
            These Terms of Service ("Terms") govern your use of the Tilcons website and the recruitment services operated by Tileshwar Consulting Services Pvt. Ltd. Please read them carefully.
          </p>
          {sections.map((s) => (
            <div key={s.title} data-testid={`section-terms-${s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
              <h2 className="text-lg md:text-xl font-black mb-2" style={{ color: NAVY }}>
                {s.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
