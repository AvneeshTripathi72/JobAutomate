import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Cpu, 
  Heart, 
  Truck, 
  Calculator, 
  Briefcase, 
  Factory 
} from "lucide-react";

const industries = [
  {
    icon: Factory,
    title: "Manufacturing",
    description: "Skilled workers for production, assembly, and quality control roles.",
    link: "/industries/manufacturing"
  },
  {
    icon: Heart,
    title: "Healthcare",
    description: "Medical professionals, nurses, and healthcare administrators.",
    link: "/industries/healthcare"
  },
  {
    icon: Cpu,
    title: "Technology",
    description: "Software developers, IT specialists, and tech support professionals.",
    link: "/industries/technology"
  },
  {
    icon: Briefcase,
    title: "Administrative",
    description: "Office managers, executive assistants, and support staff.",
    link: "/industries/administrative"
  },
  {
    icon: Calculator,
    title: "Finance",
    description: "Accountants, financial analysts, and banking professionals.",
    link: "/industries/finance"
  },
  {
    icon: Truck,
    title: "Logistics",
    description: "Supply chain experts, warehouse staff, and distribution managers.",
    link: "/industries/logistics"
  }
];

export default function IndustrySpecializations() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-card-foreground mb-4">
            Industries We Serve
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized staffing solutions across diverse sectors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <Link key={index} href={industry.link} data-testid={`link-industry-${industry.title.toLowerCase()}`}>
                <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer h-full">
                  <div className="flex flex-col">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">
                      {industry.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {industry.description}
                    </p>
                    <span className="text-primary text-sm font-medium mt-auto">
                      Learn More →
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
