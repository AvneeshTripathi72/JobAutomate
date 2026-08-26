import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { 
  Factory, 
  Heart, 
  Cpu, 
  Calculator, 
  Briefcase, 
  Truck,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
} from "lucide-react";
import techOfficeImage from "@assets/generated_images/Tech_office_workspace_4e5b503f.png";
import manufacturingImage from "@assets/generated_images/Manufacturing_worker_professional_96dc3da4.png";
import healthcareImage from "@assets/generated_images/Healthcare_professional_portrait_dba97859.png";
import financeImage from "@assets/generated_images/Finance_office_professional_workspace_1ab47306.png";
import logisticsImage from "@assets/generated_images/Logistics_warehouse_distribution_center_f718584c.png";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

const industries = [
  {
    icon: Cpu,
    num: "01",
    title: "Technology & IT",
    description: "Connect with top software developers, IT specialists, network engineers, and tech support professionals. We understand the unique demands of the technology sector and can help you build agile, innovative teams.",
    specialties: ["Software Development", "IT Infrastructure", "Cybersecurity", "Data Science", "DevOps Engineering", "UI/UX Design"],
    image: techOfficeImage,
  },
  {
    icon: Factory,
    num: "02",
    title: "Manufacturing",
    description: "Find skilled production workers, quality control specialists, machine operators, and manufacturing supervisors experienced in lean manufacturing, safety protocols, and continuous improvement.",
    specialties: ["Production Assembly", "CNC Operation", "Quality Assurance", "Warehouse Management", "Process Engineering", "Logistics Coordination"],
    image: manufacturingImage,
  },
  {
    icon: Heart,
    num: "03",
    title: "Healthcare",
    description: "Staff your healthcare facility with qualified nurses, medical technicians, administrative personnel, and allied health professionals. All candidates meet strict licensing and certification requirements.",
    specialties: ["Registered Nurses", "Medical Assistants", "Lab Technicians", "Healthcare Administration", "Physical Therapy", "Radiology"],
    image: healthcareImage,
  },
  {
    icon: Briefcase,
    num: "04",
    title: "Administrative & Office",
    description: "Hire professional administrative staff, executive assistants, office managers, and support personnel who keep your business running smoothly and efficiently every single day.",
    specialties: ["Executive Assistants", "Office Managers", "Data Entry Specialists", "Receptionists", "Administrative Coordinators", "Project Assistants"],
    image: techOfficeImage,
  },
  {
    icon: Calculator,
    num: "05",
    title: "Finance & Accounting",
    description: "Place experienced accountants, financial analysts, bookkeepers, and finance professionals who understand compliance, reporting, and strategic financial management at every level.",
    specialties: ["Accountants (CPA)", "Financial Analysts", "Bookkeepers", "Payroll Specialists", "Tax Professionals", "Auditors"],
    image: financeImage,
  },
  {
    icon: Truck,
    num: "06",
    title: "Logistics & Supply Chain",
    description: "Deploy warehouse staff, distribution managers, supply chain analysts, and logistics coordinators to optimise your operations and consistently meet delivery commitments.",
    specialties: ["Warehouse Supervisors", "Forklift Operators", "Supply Chain Analysts", "Distribution Coordinators", "Inventory Managers", "Shipping & Receiving"],
    image: logisticsImage,
  },
];

export default function Industries() {
  useDocumentMeta(
    "Industries We Serve",
    "Specialist recruitment across Technology, Manufacturing, Healthcare, Finance, Logistics and Professional Services in India. Tilcons partners with sector experts."
  );
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── Hero ── */}
      <section
        className="relative py-20 md:py-28 flex items-center overflow-hidden"
        style={{ background: `linear-gradient(160deg,${NAVY} 0%,#122b47 60%,#163554 100%)` }}
      >
        <div className="absolute inset-0 ai-grid-overlay pointer-events-none" />
        <div className="absolute inset-0 ai-hero-glow pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${SKY}, #38bdf8, ${SKY})` }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${SKY}66, transparent)` }} />
        <div className="absolute top-10 right-16 ai-node hidden md:block" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-14 left-20 ai-node hidden md:block" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-20 left-1/4 ai-node hidden md:block" style={{ animationDelay: "0.8s" }} />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] mb-5 border" style={{ background: `${SKY}1A`, borderColor: `${SKY}4D`, color: SKY }}>
            <BrainCircuit className="h-3.5 w-3.5" />
            Tilcons Staffing
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-4">
            Industries <span className="ai-gradient-text">We Serve</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
            Specialised recruitment expertise across the sectors that drive the global economy.
          </p>

          {/* Quick industry pill links */}
          <div className="flex flex-wrap justify-center gap-2">
            {industries.map((ind) => {
              const Icon = ind.icon;
              return (
                <a
                  key={ind.num}
                  href={`#industry-${ind.num}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/70 border border-white/15 hover:border-white/40 hover:text-white transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: SKY }} />
                  {ind.title}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Alternating industry detail sections ── */}
      {industries.map((industry, index) => {
        const Icon = industry.icon;
        const isEven = index % 2 === 0;

        return (
          <section
            key={industry.num}
            id={`industry-${industry.num}`}
            className={`py-16 md:py-20 scroll-mt-20`}
            style={{ background: isEven ? "#ffffff" : "#f0f5fa" }}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>

                {/* Text block */}
                <div className={isEven ? "order-1" : "order-1 lg:order-2"}>
                  {/* Section number + icon row */}
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className="text-5xl font-black leading-none select-none"
                      style={{ color: `${SKY}35` }}
                    >
                      {industry.num}
                    </span>
                    <div
                      className="w-11 h-11 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: SKY }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: NAVY }}>
                      {industry.title}
                    </h2>
                  </div>

                  {/* Sky blue rule */}
                  <div className="h-[3px] w-10 rounded-full mb-5" style={{ background: SKY }} />

                  <p className="text-muted-foreground mb-7 leading-relaxed text-base">
                    {industry.description}
                  </p>

                  {/* Specialties — pill badges */}
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: `${NAVY}80` }}>
                    Key Specialties
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {industry.specialties.map((s, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                        style={{ borderColor: `${SKY}40`, color: NAVY, background: `${SKY}0D` }}
                      >
                        <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: SKY }} />
                        {s}
                      </span>
                    ))}
                  </div>

                  <Link href="/contact" data-testid={`link-contact-${industry.num}`}>
                    <button
                      className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-md text-sm uppercase tracking-wide transition-opacity hover:opacity-90 active:opacity-80"
                      style={{ background: SKY }}
                    >
                      Find {industry.title.split(" ")[0]} Talent
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>

                {/* Image block */}
                <div className={isEven ? "order-2" : "order-2 lg:order-1"}>
                  <div className="relative overflow-hidden rounded-xl shadow-lg group">
                    <img
                      src={industry.image}
                      alt={industry.title}
                      className="w-full h-72 md:h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Dark gradient overlay at bottom */}
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(to top, ${NAVY}90 0%, transparent 50%)` }}
                    />
                    {/* Sky blue bottom line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: SKY }} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── CTA footer ── */}
      <section
        className="relative py-12 md:py-20 overflow-hidden"
        style={{ background: `linear-gradient(135deg,${NAVY} 0%,#163554 100%)` }}
      >
        <div className="absolute inset-0 ai-grid-overlay pointer-events-none" />
        <div className="absolute inset-0 ai-hero-glow pointer-events-none" />
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, ${SKY}, #38bdf8, ${SKY})` }}
        />
        {/* Decorative numbers */}
        <div
          className="absolute right-8 bottom-4 text-[160px] font-black leading-none select-none pointer-events-none opacity-[0.04] text-white"
        >
          06
        </div>

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: SKY }}>
            Let's Talk
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
            Don't see your industry?
          </h2>
          <p className="text-white/55 text-base mb-10 max-w-xl mx-auto">
            We work across many more sectors. Tell us about your specific staffing requirements and we'll find the right solution.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" data-testid="link-contact-other">
              <button
                className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-md text-sm uppercase tracking-wide transition-opacity hover:opacity-90 text-white"
                style={{ background: SKY }}
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/jobs" data-testid="link-browse-jobs-services">
              <button
                className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-md text-sm uppercase tracking-wide border border-white/25 text-white hover:border-white/50 transition-colors"
              >
                Browse Jobs <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
