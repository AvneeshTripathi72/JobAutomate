import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Copy, Download, FileSignature } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OfferLetterGeneratorProps {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  applicationId: string;
}

export default function OfferLetterGenerator({ candidateName, jobTitle, companyName, applicationId }: OfferLetterGeneratorProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const [joiningDate, setJoiningDate] = useState("");
  const [salary, setSalary] = useState("");
  const [manager, setManager] = useState("");
  const [location, setLocation] = useState("Bangalore, India");
  
  const [generatedOffer, setGeneratedOffer] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!joiningDate || !salary) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    
    const offerHtml = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 40px;">
  <div style="text-align: right; margin-bottom: 30px;">
    <strong>Date:</strong> ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
  </div>
  
  <h2 style="text-align: center; color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">OFFER OF EMPLOYMENT</h2>
  
  <p>Dear <strong>${candidateName}</strong>,</p>
  
  <p>We are thrilled to offer you the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>. We believe your skills and experience will be a great addition to our team.</p>
  
  <p>Please find the details of your offer below:</p>
  
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr>
      <td style="padding: 8px; border: 1px solid #eee; font-weight: bold; width: 30%;">Position</td>
      <td style="padding: 8px; border: 1px solid #eee;">${jobTitle}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Date of Joining</td>
      <td style="padding: 8px; border: 1px solid #eee;">${new Date(joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Reporting Manager</td>
      <td style="padding: 8px; border: 1px solid #eee;">${manager || "TBD"}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Location</td>
      <td style="padding: 8px; border: 1px solid #eee;">${location}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Annual Compensation</td>
      <td style="padding: 8px; border: 1px solid #eee;">₹${parseInt(salary).toLocaleString("en-IN")} per annum</td>
    </tr>
  </table>
  
  <p>Your employment will be subject to the company's standard terms and conditions, background verification, and company policies as amended from time to time.</p>
  
  <p>Please indicate your acceptance of this offer by signing below and returning a copy to us by ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN")}.</p>
  
  <p>We look forward to welcoming you aboard!</p>
  
  <div style="margin-top: 50px;">
    <p>Sincerely,</p>
    <p><strong>Human Resources</strong><br/>${companyName}</p>
  </div>
  
  <div style="margin-top: 50px; padding-top: 20px; border-top: 1px dashed #ccc;">
    <p><strong>Acceptance of Offer</strong></p>
    <p>I acknowledge and accept this offer of employment and agree to the terms specified.</p>
    <div style="display: flex; justify-content: space-between; margin-top: 40px;">
      <div>Signature: ______________________</div>
      <div>Date: ______________________</div>
    </div>
  </div>
</div>
    `;
    
    setGeneratedOffer(offerHtml);
  };

  const handleCopy = () => {
    if (generatedOffer) {
      navigator.clipboard.writeText(generatedOffer);
      toast({ title: "Offer letter HTML copied to clipboard" });
    }
  };

  const handlePrint = () => {
    if (!generatedOffer) return;
    const printWindow = window.open('', '', 'height=800,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Offer Letter</title>');
      printWindow.document.write('</head><body >');
      printWindow.document.write(generatedOffer);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) setGeneratedOffer(null);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 border-[#10b981]/30">
          <FileSignature className="h-4 w-4 mr-2" />
          Generate Offer Letter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#0ea5e9]" />
            Generate Offer Letter for {candidateName}
          </DialogTitle>
        </DialogHeader>
        
        {!generatedOffer ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input value={jobTitle} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input value={companyName} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Date of Joining *</Label>
                <Input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Annual Salary (INR) *</Label>
                <Input type="number" placeholder="e.g. 1500000" value={salary} onChange={(e) => setSalary(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Reporting Manager</Label>
                <Input placeholder="e.g. Ashutosh" value={manager} onChange={(e) => setManager(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="e.g. Bangalore, Remote" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button onClick={handleGenerate} className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white">
                Generate Template
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="border rounded bg-white max-h-[50vh] overflow-y-auto shadow-inner" 
                 dangerouslySetInnerHTML={{ __html: generatedOffer }} />
                 
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setGeneratedOffer(null)}>
                Edit Details
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy HTML
                </Button>
                <Button onClick={handlePrint} className="bg-[#10b981] hover:bg-[#10b981]/90 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Print / Save PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
