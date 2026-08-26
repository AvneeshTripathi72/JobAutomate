import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Loader2, Linkedin, Facebook, ArrowRight, Clock, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { InsertContact } from "@shared/schema";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const NAVY = "#0d2137";
const SKY = "#0ea5e9";

export default function Contact() {
  useDocumentMeta(
    "Contact Tilcons",
    "Contact Tilcons recruitment team — share a job description, partner with us, or reach our office in Vasundhara, Ghaziabad. We respond within 24 hours."
  );
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: ""
  });
  const [inquiryTypeError, setInquiryTypeError] = useState(false);
  const inquiryErrorRef = useRef<HTMLParagraphElement>(null);

  const createContact = useMutation({
    mutationFn: async (data: InsertContact) => {
      return await apiRequest("POST", "/api/contacts", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", phone: "", inquiryType: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.inquiryType) {
      setInquiryTypeError(true);
      setTimeout(() => {
        inquiryErrorRef.current?.focus();
        document.getElementById("inquiryType")?.focus();
      }, 100);
      return;
    }
    setInquiryTypeError(false);
    createContact.mutate(formData);
  };

  const contactItems = [
    {
      icon: Phone,
      label: "Phone",
      value: "+91-7276105036",
      href: "tel:+917276105036",
      testId: "link-contact-phone",
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@tilcons.com",
      href: "mailto:info@tilcons.com",
      testId: "link-contact-email",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "linkedin.com/company/tilcons",
      href: "https://www.linkedin.com/company/tilcons",
      testId: "link-contact-linkedin",
      external: true,
    },
    {
      icon: Facebook,
      label: "Facebook",
      value: "facebook.com/tilcons",
      href: "https://www.facebook.com/tilcons",
      testId: "link-contact-facebook",
      external: true,
    },
    {
      icon: MapPin,
      label: "Headquarters",
      value: "710 GF Sector-1 Vasundhara, Ghaziabad, 201012",
      testId: "text-contact-address",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section
        className="py-12 md:py-20 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #163554 100%)` }}
      >
        <div className="absolute inset-0 ai-grid-overlay pointer-events-none" />
        <div className="absolute inset-0 ai-hero-glow pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${SKY}, #38bdf8, ${SKY})` }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${SKY}66, transparent)` }} />
        <div className="absolute top-6 right-12 ai-node hidden md:block" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-8 right-24 ai-node hidden md:block" style={{ animationDelay: "1.5s" }} />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] mb-5 border" style={{ background: `${SKY}1A`, borderColor: `${SKY}4D`, color: SKY }}>
            <BrainCircuit className="h-3.5 w-3.5" />
            Reach Out
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Get in <span className="ai-gradient-text">Touch</span>
          </h1>
          <p className="text-white/65 text-base max-w-xl mx-auto">
            We're here to help you find talent or your next opportunity. Let's start the conversation.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact form */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: SKY }}>Send a Message</p>
              <h2 className="text-2xl font-black tracking-tight mb-6" style={{ color: NAVY }}>We'd love to hear from you</h2>

              <div className="border border-border rounded-xl overflow-hidden">
                <div className="h-1 w-full" style={{ background: SKY }} />
                <div className="p-7">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                        data-testid="input-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                        data-testid="input-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91-9876543210"
                        data-testid="input-phone"
                      />
                    </div>

                    <div>
                      <Label htmlFor="inquiryType">
                        Inquiry Type <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.inquiryType}
                        onValueChange={(value) => {
                          setFormData({ ...formData, inquiryType: value });
                          setInquiryTypeError(false);
                        }}
                      >
                        <SelectTrigger
                          id="inquiryType"
                          data-testid="select-inquiry-type"
                          className={cn(inquiryTypeError && "border-destructive focus:ring-destructive")}
                          aria-invalid={inquiryTypeError}
                          aria-describedby={inquiryTypeError ? "inquiry-type-error" : undefined}
                        >
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="job-seeker">I'm Looking for Work</SelectItem>
                          <SelectItem value="employer">I Need to Hire</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                      <div aria-live="polite" aria-atomic="true">
                        {inquiryTypeError && (
                          <p
                            id="inquiry-type-error"
                            ref={inquiryErrorRef}
                            className="text-sm text-destructive mt-1"
                            role="alert"
                            tabIndex={-1}
                          >
                            Please select your inquiry type from the options above
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your needs..."
                        rows={5}
                        required
                        data-testid="textarea-message"
                        className="resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full font-bold uppercase tracking-wider text-sm flex items-center gap-2"
                      style={{ background: SKY }}
                      data-testid="button-submit"
                      disabled={createContact.isPending}
                    >
                      {createContact.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: SKY }}>Contact Details</p>
              <h2 className="text-2xl font-black tracking-tight mb-6" style={{ color: NAVY }}>Find us here</h2>

              <div className="space-y-3 mb-5">
                {contactItems.map(({ icon: Icon, label, value, href, testId, external }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 p-5 border border-border rounded-xl bg-background"
                  >
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: `${SKY}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: SKY }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="text-sm font-semibold text-foreground hover:text-sky-500 transition-colors"
                          data-testid={testId}
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-foreground" data-testid={testId}>
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Office hours */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="h-1 w-full" style={{ background: SKY }} />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-4 w-4" style={{ color: SKY }} />
                    <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: NAVY }}>Office Hours</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      { day: "Monday – Friday", hours: "8:00 AM – 6:00 PM" },
                      { day: "Saturday", hours: "9:00 AM – 2:00 PM" },
                      { day: "Sunday", hours: "Closed" },
                    ].map(({ day, hours }) => (
                      <div key={day} className="flex justify-between items-center">
                        <span className="text-muted-foreground">{day}</span>
                        <span className="font-semibold text-foreground">{hours}</span>
                      </div>
                    ))}
                  </div>
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
