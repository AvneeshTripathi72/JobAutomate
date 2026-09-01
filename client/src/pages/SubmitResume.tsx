import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, CheckCircle2, Paperclip, X, Briefcase, ArrowRight, MapPin, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useRoute } from "wouter";
import type { Job } from "@shared/schema";
import { useDocumentMeta } from "@/hooks/use-document-meta";

import { supabase } from "@/lib/supabase";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

export default function SubmitResume() {
  const { toast } = useToast();
  const [, params] = useRoute("/apply/:id");
  const jobId = params?.id;

  const { data: job, isLoading: jobLoading, isError: jobError } = useQuery<Job>({
    queryKey: ["/api/jobs", jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();
      if (error) throw error;
      return {
        id: data.id,
        companyId: data.company_id,
        title: data.title,
        company: data.company_id, // Fetching placeholder
        location: data.location,
        jobType: data.job_type,
        industry: data.industry,
        description: data.description,
        salary: data.salary,
        postedDate: new Date(data.posted_date)
      } as Job;
    },
    enabled: !!jobId,
  });

  useDocumentMeta(
    job ? `Apply for ${job.title} at ${job.company}` : "Submit Your Resume",
    job
      ? `Apply for the ${job.title} role at ${job.company} in ${job.location} via Tilcons. Submit your CV and connect with our recruitment team.`
      : "Submit your CV to Tilcons' recruitment talent network. Get matched with vetted opportunities across India in technology, manufacturing, healthcare, finance and more."
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    desiredPosition: "",
    yearsExperience: "",
    skills: "",
    linkedIn: "",
    additionalInfo: ""
  });

  useEffect(() => {
    if (job) {
      setFormData(prev => ({ ...prev, desiredPosition: job.title }));
    }
  }, [job]);

  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Helper: upload file to Cloudflare R2 via server API and return a public URL
  // Helper: upload file to Cloudflare R2 via AWS SDK directly from frontend
  const uploadResumeToStorage = async (file: File): Promise<string | null> => {
    try {
      const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
      
      const r2 = new S3Client({
        region: "auto",
        endpoint: `https://${import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID || "",
          secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY || "",
        },
      });

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      // Convert File to ArrayBuffer for AWS SDK
      const arrayBuffer = await file.arrayBuffer();

      await r2.send(
        new PutObjectCommand({
          Bucket: import.meta.env.VITE_R2_BUCKET_NAME || "first",
          Key: fileName,
          Body: new Uint8Array(arrayBuffer),
          ContentType: file.type || "application/pdf",
        })
      );

      const publicUrl = `${import.meta.env.VITE_NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
      return publicUrl;
    } catch (err: any) {
      console.error("Resume upload failed:", err);
      toast({
        title: "Resume upload failed",
        description: err.message || "Could not upload your resume file. Your profile will be saved without the file.",
        variant: "destructive",
      });
      return null;
    }
  };

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      // Upload the actual file first if present
      let resumePublicUrl: string | null = null;
      if (data.resumeFile) {
        resumePublicUrl = await uploadResumeToStorage(data.resumeFile);
      }

      if (jobId) {
        const { data: resData, error } = await supabase
          .from("applications")
          .insert([{
            company_id: job?.companyId || null,
            job_id: jobId,
            applicant_name: data.fullName,
            email: data.email,
            phone: data.phone,
            resume_url: resumePublicUrl,
            cover_letter: data.additionalInfo,
            status: "new",
            source: "Direct"
          }])
          .select();
        if (error) throw error;
        return resData;
      } else {
        const { data: resData, error } = await supabase
          .from("resumes")
          .insert([{
            company_id: null,
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            desired_position: data.desiredPosition,
            years_experience: data.yearsExperience,
            skills: data.skills,
            linked_in: data.linkedIn,
            additional_info: data.additionalInfo,
            resume_url: resumePublicUrl
          }])
          .select();
        if (error) throw error;
        return resData;
      }
    },
    onSuccess: async () => {
      toast({
        title: jobId ? "Application submitted!" : "Resume submitted!",
        description: "Thank you — we've received your details and our recruitment team will review your profile shortly.",
      });
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        desiredPosition: "",
        yearsExperience: "",
        skills: "",
        linkedIn: "",
        additionalInfo: ""
      });
      setResumeFile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({ title: "Invalid file type", description: "Please upload a PDF, DOC, or DOCX file.", variant: "destructive" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please upload a file smaller than 5MB.", variant: "destructive" });
        return;
      }
      setResumeFile(file);
    }
  };

  const removeFile = () => setResumeFile(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      desiredPosition: formData.desiredPosition,
      yearsExperience: parseInt(formData.yearsExperience) || 0,
      skills: formData.skills,
      linkedIn: formData.linkedIn || undefined,
      additionalInfo: formData.additionalInfo || undefined,
      resumeFile: resumeFile  // Pass the actual File object now
    });
  };

  if (jobId && jobError) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center border border-border rounded-xl p-8" data-testid="state-job-not-found">
            <AlertTriangle className="h-10 w-10 mx-auto text-amber-500 mb-4" />
            <h1 className="text-2xl font-black text-foreground mb-2">This role isn't available</h1>
            <p className="text-sm text-muted-foreground mb-6">
              The job you're trying to apply for is no longer listed or the link is invalid. Browse our latest live roles or submit your CV to our talent network.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/jobs">
                <Button data-testid="button-browse-jobs">Browse all jobs</Button>
              </Link>
              <Link href="/submit-resume">
                <Button variant="outline" data-testid="button-submit-cv">Submit your CV</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (jobId && jobLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section
        className="py-16 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #163554 100%)` }}
      >
        <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: SKY }} />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: SKY }}>
            {job ? "Apply Now" : "Join Our Network"}
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            {job ? `Apply for ${job.title}` : "Submit Your Resume"}
          </h1>
          {job && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-white/70 text-sm mb-4">
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" style={{ color: SKY }} />
                {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" style={{ color: SKY }} />
                {job.location}
              </span>
            </div>
          )}
          <p className="text-white/65 text-base max-w-xl mx-auto">
            {job
              ? "Tell us why you're a great fit for this role."
              : "Join our talent network and get matched with opportunities that fit your skills and experience."}
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="h-1 w-full" style={{ background: SKY }} />
            <div className="p-8">
              <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.25em] mb-1" style={{ color: SKY }}>
                  Your Details
                </p>
                <h2 className="text-2xl font-black tracking-tight mb-2" style={{ color: NAVY }}>Your Information</h2>
                <p className="text-sm text-muted-foreground">
                  Tell us about your experience and career goals. We'll keep your information confidential and only share it with relevant opportunities.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="John Doe" required data-testid="input-full-name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" required data-testid="input-email" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91-9876543210" required data-testid="input-phone" />
                  </div>
                  <div>
                    <Label htmlFor="yearsExperience">Years of Experience *</Label>
                    <Input id="yearsExperience" type="number" min="0" max="50" value={formData.yearsExperience} onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })} placeholder="5" required data-testid="input-years-experience" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="desiredPosition">Desired Position / Role *</Label>
                  <Input id="desiredPosition" value={formData.desiredPosition} onChange={(e) => setFormData({ ...formData, desiredPosition: e.target.value })} placeholder="e.g., Software Engineer, Project Manager" required data-testid="input-desired-position" />
                  <p className="text-xs text-muted-foreground mt-1">What type of role are you seeking?</p>
                </div>

                <div>
                  <Label htmlFor="skills">Skills &amp; Expertise *</Label>
                  <Textarea id="skills" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder="List your key skills, certifications, and areas of expertise..." rows={4} required data-testid="input-skills" className="resize-none" />
                  <p className="text-xs text-muted-foreground mt-1">Include technical skills, certifications, languages, etc.</p>
                </div>

                <div>
                  <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                  <Input id="linkedIn" type="url" value={formData.linkedIn} onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })} placeholder="https://linkedin.com/in/yourprofile" data-testid="input-linkedin" />
                  <p className="text-xs text-muted-foreground mt-1">Optional but recommended</p>
                </div>

                <div>
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea id="additionalInfo" value={formData.additionalInfo} onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })} placeholder="Tell us anything else you'd like us to know about your background, career goals, or availability..." rows={4} data-testid="input-additional-info" className="resize-none" />
                </div>

                <div>
                  <Label htmlFor="resumeFile">Resume / CV Attachment</Label>
                  <div className="mt-2">
                    {!resumeFile ? (
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor="resumeFile"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-input bg-background hover-elevate active-elevate-2 rounded-md text-sm font-medium"
                          data-testid="label-upload-resume"
                        >
                          <Paperclip className="h-4 w-4" />
                          Choose File
                        </label>
                        <Input id="resumeFile" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" data-testid="input-resume-file" />
                        <span className="text-sm text-muted-foreground">PDF, DOC, or DOCX (Max 5MB)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md border border-border">
                        <Paperclip className="h-4 w-4" style={{ color: SKY }} />
                        <span className="text-sm flex-1 truncate" data-testid="text-filename">{resumeFile.name}</span>
                        <button type="button" onClick={removeFile} className="p-1 hover-elevate rounded-md" data-testid="button-remove-file">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Optional — attach your resume for a more complete application</p>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-bold uppercase tracking-wider text-sm flex items-center gap-2 justify-center"
                    style={{ background: SKY }}
                    disabled={submitMutation.isPending}
                    data-testid="button-submit-resume"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        {job ? "Submit Application" : "Submit Resume"}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-7 p-4 rounded-xl flex gap-3" style={{ background: `${SKY}10`, border: `1px solid ${SKY}25` }}>
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: SKY }} />
                <div className="text-sm text-muted-foreground">
                  <p className="font-bold text-foreground mb-0.5">Your privacy matters</p>
                  <p>We respect your confidentiality. Your information will only be shared with employers for positions that match your profile and preferences.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
