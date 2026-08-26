import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface BulkEmailDialogProps {
  selectedEmails: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function BulkEmailDialog({ selectedEmails, open, onOpenChange, onSuccess }: BulkEmailDialogProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const { toast } = useToast();

  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/bulk-email", {
        emails: selectedEmails,
        subject,
        body,
      });
    },
    onSuccess: () => {
      toast({ title: "Emails scheduled for sending" });
      setSubject("");
      setBody("");
      onSuccess();
      onOpenChange(false);
    },
    onError: () => toast({ title: "Failed to send emails", variant: "destructive" }),
  });

  const handleSend = () => {
    if (!subject || !body) {
      toast({ title: "Subject and body are required", variant: "destructive" });
      return;
    }
    sendEmailMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#0ea5e9]" />
            Bulk Email Outreach ({selectedEmails.length} recipients)
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Recipients</Label>
            <div className="bg-muted p-2 rounded-md max-h-24 overflow-y-auto text-xs text-muted-foreground font-mono">
              {selectedEmails.join(", ")}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Subject *</Label>
            <Input 
              placeholder="e.g. Exciting new opportunities at Tilcons!" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Email Body *</Label>
            <Textarea 
              placeholder="Write your message here..." 
              value={body} 
              onChange={(e) => setBody(e.target.value)} 
              rows={8}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Supports plain text. Avoid spammy keywords to ensure delivery.
            </p>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSend} 
              disabled={sendEmailMutation.isPending || !subject || !body}
              className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              {sendEmailMutation.isPending ? "Sending..." : "Send Bulk Email"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
