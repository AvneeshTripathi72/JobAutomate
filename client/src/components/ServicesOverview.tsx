import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Clock, UserCheck, RefreshCw, Star, BrainCircuit } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import tempStaffingImg from "@assets/generated_images/Diverse_temporary_staffing_workers_4885a934.png";
import directHireImg from "@assets/generated_images/Direct_hire_interview_success_1aa3f4bf.png";
import contractToHireImg from "@assets/generated_images/Contract-to-hire_professional_working_6dd47ae4.png";
import executiveSearchImg from "@assets/generated_images/Executive_leadership_team_boardroom_6b7c5af6.png";
import aiRecruitmentImg from "@assets/generated_images/Tech_office_workspace_4e5b503f.png";
import proactivePipelineVideo from "@assets/proactive_pipeline_video.mp4";

const services = [
  {
    icon: Clock,
    title: "Temporary Staffing",
    description: "Flexible staffing solutions for short-term projects, seasonal demands, and temporary coverage needs.",
    image: tempStaffingImg
  },
  {
    icon: UserCheck,
    title: "Direct Hire",
    description: "Permanent placement services to help you find the perfect long-term addition to your team.",
    image: directHireImg
  },
  {
    icon: RefreshCw,
    title: "Contract-to-Hire",
    description: "Evaluate candidates on the job before making a permanent hiring commitment.",
    image: contractToHireImg
  },
  {
    icon: Star,
    title: "Executive Search",
    description: "Specialized recruitment for leadership positions and high-level executive roles.",
    image: executiveSearchImg
  },
  {
    icon: BrainCircuit,
    title: "AI-Driven Recruitment",
    description: "Harness AI-powered screening and matching to find top talent faster with greater precision, reducing time-to-hire by up to 60%.",
    image: aiRecruitmentImg
  }
];

export default function ServicesOverview() {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % services.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sky-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">What We Do</p>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
            Staffing Solutions for <span className="text-sky-500">Every Need</span>
          </h2>
          <div className="h-1 w-12 bg-sky-500 mx-auto rounded-full mb-6" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide specialized recruitment strategies across various industries and role levels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="aspect-[4/3] relative overflow-hidden rounded-2xl shadow-2xl">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                    index === currentServiceIndex 
                      ? 'opacity-100 scale-100 translate-x-0' 
                      : 'opacity-0 scale-110 translate-x-8'
                  }`}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-white/80 line-clamp-2">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-3 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-border/50">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentServiceIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentServiceIndex 
                      ? 'bg-sky-500 w-10' 
                      : 'bg-muted-foreground/30 w-2.5 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to service ${index + 1}`}
                  data-testid={`service-indicator-${index}`}
                />
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-white">
            <video autoPlay muted loop playsInline preload="metadata" className="block w-full">
              <source src={proactivePipelineVideo} type="video/mp4" />
            </video>
          </div>

          <div className="space-y-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isActive = index === currentServiceIndex;
              return (
                <button
                  key={index}
                  onClick={() => setCurrentServiceIndex(index)}
                  className={`w-full text-left p-6 rounded-xl border transition-all duration-300 flex items-start gap-4 hover-elevate ${
                    isActive 
                      ? 'bg-sky-500/5 border-sky-500 shadow-sm' 
                      : 'bg-card border-transparent opacity-70 hover:opacity-100'
                  }`}
                  data-testid={`service-card-${index}`}
                >
                  <div className={`p-3 rounded-lg ${isActive ? 'bg-sky-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold mb-1 ${isActive ? 'text-sky-500' : 'text-card-foreground'}`}>
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link href="/employers" data-testid="link-learn-more-services">
            <Button size="lg" className="rounded-full px-8 hover-elevate shadow-lg hover:shadow-primary/20">
              Explore All Solutions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
