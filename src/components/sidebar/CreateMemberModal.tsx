
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
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProject: Project | null;
  onCreateMember: (name: string, email: string, role: string) => void;
}

const CreateMemberModal: React.FC<CreateMemberModalProps> = ({
  isOpen,
  onClose,
  selectedProject,
  onCreateMember
}) => {
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateMember = () => {
    if (!newMember.name.trim()) {
      toast.error("Member name is required");
      return;
    }
    
    if (newMember.email) {
      // Simple email validation if provided
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newMember.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      onCreateMember(newMember.name, newMember.email, newMember.role);
      setNewMember({ name: "", email: "", role: "" });
    } catch (error) {
      toast.error("Failed to add team member");
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
            <UserPlus className="h-5 w-5" />
            Add Member to {selectedProject?.name}
          </DialogTitle>
          <DialogDescription>
            Add a new team member to collaborate on this project.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="memberName" className="text-sm font-medium">Name <span className="text-red-500">*</span></label>
            <Input 
              id="memberName" 
              value={newMember.name} 
              onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              placeholder="Enter member name"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="memberEmail" className="text-sm font-medium">Email</label>
            <Input 
              id="memberEmail" 
              value={newMember.email} 
              onChange={(e) => setNewMember({...newMember, email: e.target.value})}
              placeholder="Enter member email"
              type="email"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="memberRole" className="text-sm font-medium">Role</label>
            <Input 
              id="memberRole" 
              value={newMember.role} 
              onChange={(e) => setNewMember({...newMember, role: e.target.value})}
              placeholder="Enter member role"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleCreateMember} 
            disabled={isSubmitting || !newMember.name.trim()}
          >
            {isSubmitting ? 'Adding...' : 'Add Member'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMemberModal;
