import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { insertVendorSchema, type InsertVendor } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Building2, CheckCircle2 } from "lucide-react";

export default function VendorRegistration() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InsertVendor>({
    resolver: zodResolver(insertVendorSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      website: "",
      servicesOffered: "",
      industriesExpertise: "",
      geographicCoverage: "",
      yearsInBusiness: 0,
      companyDescription: "",
      partnershipReason: ""
    }
  });

  const vendorMutation = useMutation({
    mutationFn: async (data: InsertVendor) => {
      return await apiRequest("POST", "/api/vendors", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Registration Successful!",
        description: "Thank you for your interest in partnering with Tilcons. We'll review your application and get back to you soon."
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertVendor) => {
    vendorMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Registration Submitted!</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for your interest in becoming a Tilcons partner. Our team will review your application and contact you within 2-3 business days.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setIsSubmitted(false)} variant="outline" data-testid="button-submit-another">
                  Submit Another Registration
                </Button>
                <Button onClick={() => window.location.href = "/"} data-testid="button-back-home">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-4">Vendor Partner Registration</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join Tilcons Partnership Program and get access to our client's open positions. We work with top vendors across India to deliver exceptional staffing solutions.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Partner Application Form</CardTitle>
            <CardDescription>
              Please provide detailed information about your company and services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    {...form.register("companyName")}
                    placeholder="Your company name"
                    data-testid="input-company-name"
                  />
                  {form.formState.errors.companyName && (
                    <p className="text-sm text-destructive">{form.formState.errors.companyName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    {...form.register("contactPerson")}
                    placeholder="Full name"
                    data-testid="input-contact-person"
                  />
                  {form.formState.errors.contactPerson && (
                    <p className="text-sm text-destructive">{form.formState.errors.contactPerson.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="contact@company.com"
                    data-testid="input-email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    placeholder="+91-XXXXXXXXXX"
                    data-testid="input-phone"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">Company Website</Label>
                  <Input
                    id="website"
                    {...form.register("website")}
                    placeholder="https://www.yourcompany.com"
                    data-testid="input-website"
                  />
                  {form.formState.errors.website && (
                    <p className="text-sm text-destructive">{form.formState.errors.website.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="servicesOffered">Services Offered *</Label>
                <Textarea
                  id="servicesOffered"
                  {...form.register("servicesOffered")}
                  placeholder="e.g., Temporary Staffing, Direct Hire, Contract-to-Hire, Executive Search, etc."
                  className="min-h-24"
                  data-testid="textarea-services"
                />
                {form.formState.errors.servicesOffered && (
                  <p className="text-sm text-destructive">{form.formState.errors.servicesOffered.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industriesExpertise">Industries of Expertise *</Label>
                <Textarea
                  id="industriesExpertise"
                  {...form.register("industriesExpertise")}
                  placeholder="e.g., Manufacturing, Healthcare, Technology, Finance, Administrative, Logistics, etc."
                  className="min-h-24"
                  data-testid="textarea-industries"
                />
                {form.formState.errors.industriesExpertise && (
                  <p className="text-sm text-destructive">{form.formState.errors.industriesExpertise.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="geographicCoverage">Geographic Coverage *</Label>
                  <Input
                    id="geographicCoverage"
                    {...form.register("geographicCoverage")}
                    placeholder="e.g., Pan India, Delhi NCR, Mumbai, etc."
                    data-testid="input-geographic-coverage"
                  />
                  {form.formState.errors.geographicCoverage && (
                    <p className="text-sm text-destructive">{form.formState.errors.geographicCoverage.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                  <Input
                    id="yearsInBusiness"
                    type="number"
                    {...form.register("yearsInBusiness", { valueAsNumber: true })}
                    placeholder="5"
                    data-testid="input-years-in-business"
                  />
                  {form.formState.errors.yearsInBusiness && (
                    <p className="text-sm text-destructive">{form.formState.errors.yearsInBusiness.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyDescription">Company Description *</Label>
                <Textarea
                  id="companyDescription"
                  {...form.register("companyDescription")}
                  placeholder="Tell us about your company, team size, key strengths, and unique value proposition"
                  className="min-h-32"
                  data-testid="textarea-company-description"
                />
                {form.formState.errors.companyDescription && (
                  <p className="text-sm text-destructive">{form.formState.errors.companyDescription.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnershipReason">Why do you want to partner with Tilcons? *</Label>
                <Textarea
                  id="partnershipReason"
                  {...form.register("partnershipReason")}
                  placeholder="Share your vision for collaboration and what makes this partnership valuable for both parties"
                  className="min-h-32"
                  data-testid="textarea-partnership-reason"
                />
                {form.formState.errors.partnershipReason && (
                  <p className="text-sm text-destructive">{form.formState.errors.partnershipReason.message}</p>
                )}
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={vendorMutation.isPending}
                  data-testid="button-submit-vendor"
                >
                  {vendorMutation.isPending ? "Submitting..." : "Submit Partner Application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
