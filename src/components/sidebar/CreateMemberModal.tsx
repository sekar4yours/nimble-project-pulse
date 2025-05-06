
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Project } from "@/types/project";

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

  const handleCreateMember = () => {
    onCreateMember(newMember.name, newMember.email, newMember.role);
    setNewMember({ name: "", email: "", role: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add Member to {selectedProject?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="memberName" className="text-sm font-medium">Name</label>
            <Input 
              id="memberName" 
              value={newMember.name} 
              onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              placeholder="Enter member name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="memberEmail" className="text-sm font-medium">Email</label>
            <Input 
              id="memberEmail" 
              value={newMember.email} 
              onChange={(e) => setNewMember({...newMember, email: e.target.value})}
              placeholder="Enter member email"
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
          <Button onClick={handleCreateMember}>Add Member</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMemberModal;
