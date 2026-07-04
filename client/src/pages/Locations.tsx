import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { MapPin, Mail, Phone, ArrowRight, Globe2 } from "lucide-react";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

const locations = [
  {
    city: "Ghaziabad (Delhi NCR)",
    role: "Head Office",
    address: "Tileshwar Consulting Services Pvt. Ltd.\n710 GF, Sector-1, Vasundhara\nGhaziabad, Uttar Pradesh, 201012\nIndia",
    email: "info@tilcons.com",
    phone: "+91 72761 05036",
  },
];

export default function Locations() {
  useDocumentMeta(
    "Our Locations",
    "Visit Tilcons at our head office in Vasundhara, Ghaziabad (Delhi NCR) — call +91 72761 05036 or email info@tilcons.com."
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
            <Globe2 className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Our Reach</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Our Locations
          </h1>
          <p className="text-white/60 text-base max-w-2xl">
            Visit our head office in Delhi NCR — or get in touch from anywhere in India.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations.map((loc) => (
              <article
                key={loc.city}
                className="rounded-xl border bg-card p-6 hover-elevate transition-all"
                data-testid={`card-location-${loc.city.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: SKY }}
                  >
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black" style={{ color: NAVY }}>{loc.city}</h2>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: SKY }}>{loc.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed mb-4">
                  {loc.address}
                </p>
                <div className="space-y-2 text-sm">
                  <a href={`mailto:${loc.email}`} className="flex items-center gap-2 text-foreground/80 hover:text-sky-500 transition-colors">
                    <Mail className="h-4 w-4 shrink-0" style={{ color: SKY }} />
                    {loc.email}
                  </a>
                  <a href={`tel:${loc.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 text-foreground/80 hover:text-sky-500 transition-colors">
                    <Phone className="h-4 w-4 shrink-0" style={{ color: SKY }} />
                    {loc.phone}
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Not sure which office to reach out to?
            </p>
            <Link href="/contact">
              <button
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-xs font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                style={{ background: SKY }}
                data-testid="button-locations-contact"
              >
                Contact Us <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
