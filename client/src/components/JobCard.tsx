import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  description: string;
  postedDate: string;
  salary?: string | null;
}

export default function JobCard({
  id,
  title,
  company,
  location,
  jobType,
  description,
  postedDate,
  salary
}: JobCardProps) {
  return (
    <div
      className="group border border-border rounded-xl overflow-hidden bg-background hover:border-sky-500/40 transition-all hover-elevate"
      data-testid={`job-card-${id}`}
    >
      <div className="h-1 w-full bg-sky-500" />
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-foreground leading-snug mb-1 group-hover:text-sky-500 transition-colors">
              {title}
            </h3>
            <p className="text-sm font-semibold text-muted-foreground mb-3">{company}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-sky-500/70" />
                {location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-sky-500/70" />
                {jobType}
              </span>
              {salary && (
                <span className="font-bold text-foreground">{salary}</span>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-3">
            <a
              href={`/apply/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`button-apply-${id}`}
            >
              <Button
                size="sm"
                className="bg-[#0d2137] hover:bg-[#163554] text-white font-bold uppercase tracking-wider text-xs flex items-center gap-1.5"
              >
                Apply Now <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </a>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
              <Clock className="h-3 w-3" /> {postedDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
