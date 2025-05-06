
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Project } from "@/types/project";
import { MailPlus, Send } from "lucide-react";
import { toast } from "sonner";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProject: Project | null;
  onSendInvite: (email: string) => void;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  selectedProject,
  onSendInvite
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendInvite = () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onSendInvite(email);
      setEmail("");
    } catch (error) {
      toast.error("Failed to send invitation");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MailPlus className="h-5 w-5" />
            Invite Member to {selectedProject?.name}
          </DialogTitle>
          <DialogDescription>
            Send an email invitation to collaborate on this project.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="memberEmail" className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
            <Input 
              id="memberEmail" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              type="email"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSendInvite} 
            disabled={isSubmitting || !email.trim()}
            className="flex items-center gap-2"
          >
            {isSubmitting ? 'Sending...' : (
              <>
                <Send className="h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberModal;
