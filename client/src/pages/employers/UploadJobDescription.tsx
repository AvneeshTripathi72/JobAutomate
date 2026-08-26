import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Mail, FileText, Users, Zap, ArrowRight } from "lucide-react";

const uploadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  company: z.string().min(2, "Company name is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  message: z.string().optional(),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export default function UploadJobDescription() {
  const { toast } = useToast();
  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: UploadFormValues) => {
      return apiRequest("POST", "/api/contacts", {
        ...values,
        inquiryType: "Job Description Upload",
      });
    },
    onSuccess: () => {
      toast({
        title: "Submitted successfully",
        description: "A Tilcons consultant will be in touch within 24 hours.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: UploadFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Compact dark navy hero — content starts right away */}
      <section className="bg-[#0d2137] pt-10 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-[#0ea5e9] text-xs font-bold uppercase tracking-widest mb-2">
              For Employers
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight mb-3">
              Upload Job<br />
              <span className="text-[#0ea5e9]">Description</span>
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-0">
              Partner with Tilcons to find the perfect talent. Share your JD and a specialist consultant will be in touch within 24 hours.
            </p>
          </div>
        </div>

        {/* Diagonal cut connecting hero to content */}
        <div className="h-10 mt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0d2137]" />
          <div
            className="absolute bottom-0 left-0 right-0 h-10 bg-background"
            style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
          />
        </div>
      </section>

      {/* Main content: checkmarks + form side by side */}
      <section className="bg-background pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 items-start">

            {/* Left — benefits panel */}
            <div className="pt-4">
              <h2 className="text-xl font-bold text-[#0d2137] mb-6 uppercase tracking-tight">
                Why work with us?
              </h2>

              <div className="space-y-4 mb-10">
                {[
                  "Specialist recruitment experts in your sector",
                  "Access to a global network of top-tier talent",
                  "Tailored staffing solutions for your needs",
                  "Fast and efficient placement process",
                  "Candidates presented within 48–72 hours",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-[#0ea5e9] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-[#0d2137] font-medium text-sm leading-snug">{text}</span>
                  </div>
                ))}
              </div>

              {/* 3 mini stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Zap, stat: "48–72h", label: "Candidate shortlist" },
                  { icon: Users, stat: "250+", label: "Placements made" },
                  { icon: FileText, stat: "6+", label: "Industries covered" },
                ].map(({ icon: Icon, stat, label }) => (
                  <div
                    key={label}
                    className="bg-[#0d2137] rounded-md p-4 flex flex-col items-center text-center"
                  >
                    <Icon className="h-5 w-5 text-[#0ea5e9] mb-2" />
                    <span className="text-2xl font-black text-white">{stat}</span>
                    <span className="text-xs text-white/60 mt-0.5">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — the form card */}
            <Card className="shadow-xl border-0 -mt-6">
              <CardContent className="p-8">
                {/* Sky blue top accent bar */}
                <div className="h-1 w-16 bg-[#0ea5e9] rounded-full mb-6" />

                <h3 className="text-lg font-bold text-[#0d2137] mb-6 uppercase tracking-tight">
                  Your Hiring Brief
                </h3>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#0d2137] font-semibold text-xs uppercase tracking-wide">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" className="border-border focus:border-[#0ea5e9]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#0d2137] font-semibold text-xs uppercase tracking-wide">Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@company.com" className="border-border focus:border-[#0ea5e9]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#0d2137] font-semibold text-xs uppercase tracking-wide">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 00000 00000" className="border-border focus:border-[#0ea5e9]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#0d2137] font-semibold text-xs uppercase tracking-wide">Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Inc." className="border-border focus:border-[#0ea5e9]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#0d2137] font-semibold text-xs uppercase tracking-wide">Job Title to Hire</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Senior Project Manager" className="border-border focus:border-[#0ea5e9]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#0d2137] font-semibold text-xs uppercase tracking-wide">Additional Requirements / Job Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about the role or paste the job description here..."
                              className="min-h-[110px] border-border focus:border-[#0ea5e9] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* JD file note — file upload is not yet wired up; route candidates to email */}
                    <div className="rounded-md border border-[#0d2137]/15 bg-[#0d2137]/[0.03] p-4 flex items-start gap-3">
                      <Mail className="h-5 w-5 text-[#0ea5e9] shrink-0 mt-0.5" />
                      <div className="text-xs text-[#0d2137]/80 leading-relaxed">
                        Have a JD file? Paste the description above, or email the PDF / DOC to{" "}
                        <a
                          href="mailto:deep@tilcons.com"
                          className="font-semibold text-[#0d2137] underline underline-offset-2 hover:text-[#0ea5e9]"
                          data-testid="link-jd-email"
                        >
                          deep@tilcons.com
                        </a>{" "}
                        after submitting this form.
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-sm font-bold uppercase tracking-wide bg-[#0ea5e9] hover:bg-[#0ea5e9] text-white border-0"
                      disabled={mutation.isPending}
                      data-testid="button-submit-jd"
                    >
                      {mutation.isPending ? "Submitting..." : (
                        <>Submit Job Description <ArrowRight className="h-4 w-4 ml-2" /></>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits section — dark navy with sky blue icons */}
      <section className="bg-[#0d2137] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
            Why Partner with <span className="text-[#0ea5e9]">Tilcons</span>?
          </h2>
          <p className="text-white/50 text-sm mb-12 max-w-xl mx-auto">
            Our recruitment process is built for speed, precision, and long-term fit.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Fast Results",
                desc: "Our established network allows us to present qualified candidates within 48–72 hours of receiving your JD.",
              },
              {
                icon: Users,
                title: "Expert Vetting",
                desc: "Every candidate is thoroughly screened for technical skills and cultural fit before being introduced to you.",
              },
              {
                icon: FileText,
                title: "Specialist Insights",
                desc: "Our consultants are subject matter experts, providing market trends and salary benchmarking data.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-md bg-[#0ea5e9]/15 flex items-center justify-center mb-5">
                  <Icon className="h-7 w-7 text-[#0ea5e9]" />
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wide mb-3">{title}</h3>
                <p className="text-white/55 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
