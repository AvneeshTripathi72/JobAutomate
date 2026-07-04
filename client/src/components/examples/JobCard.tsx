import JobCard from "../JobCard";

export default function JobCardExample() {
  return (
    <div className="max-w-2xl p-6">
      <JobCard
        id="1"
        title="Senior Software Engineer"
        company="Tech Innovations Inc."
        location="San Francisco, CA"
        jobType="Full-time"
        description="We are seeking an experienced Senior Software Engineer to join our dynamic team. You will be responsible for designing and developing scalable applications."
        postedDate="2 days ago"
        salary="$120k - $160k"
      />
    </div>
  );
}
