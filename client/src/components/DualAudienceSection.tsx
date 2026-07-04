import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Users, Building2, ArrowRight } from "lucide-react";

export default function DualAudienceSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Who Are You?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your path to get started with Tilcons
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Link href="/jobs" data-testid="link-job-seeker-card">
            <Card className="p-8 hover-elevate active-elevate-2 cursor-pointer transition-all h-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-card-foreground mb-3">
                  Looking for Work
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Explore thousands of job opportunities across various industries. 
                  Find the perfect role that matches your skills and aspirations.
                </p>
                <div className="flex items-center text-primary font-medium">
                  Browse Jobs
                  <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/employers" data-testid="link-employer-card">
            <Card className="p-8 hover-elevate active-elevate-2 cursor-pointer transition-all h-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-card-foreground mb-3">
                  Looking to Hire
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Access a vast pool of pre-screened, qualified candidates. 
                  Build your team with top talent, quickly and efficiently.
                </p>
                <div className="flex items-center text-primary font-medium">
                  Explore Services
                  <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}
