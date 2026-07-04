import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import JobCard from "./JobCard";
import { Loader2 } from "lucide-react";
import { formatPostedDate } from "@/lib/utils";
import type { Job } from "@shared/schema";

export default function RecentJobs() {
  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const recentJobs = jobs.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-card-foreground mb-4">
            Featured Opportunities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our latest job openings
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recentJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  {...job} 
                  postedDate={formatPostedDate(job.postedDate)} 
                />
              ))}
            </div>

            <div className="text-center">
              <Link href="/jobs" data-testid="link-view-all-jobs">
                <Button size="lg" variant="outline">
                  View All Jobs
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
