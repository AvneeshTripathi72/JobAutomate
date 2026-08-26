import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck } from "lucide-react";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly when you create a candidate account, submit a CV, apply to a job, contact us, or register as a vendor — including name, email, phone number, work history, and any documents you upload. We also collect basic technical information (such as IP address and browser type) automatically when you use the site.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used to match you with relevant opportunities, communicate with you about applications and services, operate and improve the site, comply with legal obligations, and — with your consent — share your profile with prospective employers as part of the recruitment process.",
  },
  {
    title: "3. Sharing Your Information",
    body: "We share candidate information with hiring employers only in connection with roles you have applied to or roles where your profile is a clear match, and with service providers who help us operate the platform under appropriate confidentiality obligations. We do not sell your personal data.",
  },
  {
    title: "4. Data Retention",
    body: "We retain candidate and employer information for as long as your account is active or as needed to provide our services and meet legal, accounting or reporting requirements. You can request deletion of your account at any time.",
  },
  {
    title: "5. Your Rights",
    body: "You may request access to, correction of, or deletion of your personal data, and you may withdraw consent for marketing communications at any time. To exercise any of these rights, contact us at privacy@tilcons.com.",
  },
  {
    title: "6. Security",
    body: "We use reasonable technical and organisational measures to protect your information, including encryption in transit and access controls. No method of transmission over the internet is fully secure, so we cannot guarantee absolute security.",
  },
  {
    title: "7. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. The latest version will always be available on this page along with its effective date.",
  },
  {
    title: "8. Contact",
    body: "Questions about this Privacy Policy can be sent to privacy@tilcons.com.",
  },
];

export default function Privacy() {
  useDocumentMeta(
    "Privacy Policy",
    "How Tilcons (Tileshwar Consulting Services) collects, uses, shares and protects personal information of candidates, employers and partners."
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
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-white/60 text-base max-w-2xl">
            How we collect, use and protect personal information across Tilcons services.
          </p>
          <p className="text-white/40 text-xs mt-4 uppercase tracking-widest">
            Effective Date: 1 January 2024
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tileshwar Consulting Services Pvt. Ltd. ("Tilcons", "we", "our", "us") respects your privacy and is committed to protecting your personal information. This policy explains what we collect when you use our website and services, how we use it, and the choices you have.
          </p>
          {sections.map((s) => (
            <div key={s.title} data-testid={`section-privacy-${s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
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
