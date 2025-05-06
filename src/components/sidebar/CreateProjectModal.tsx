
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
import { Textarea } from "@/components/ui/textarea";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (name: string, description: string) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const [newProject, setNewProject] = useState({
    name: "",
    description: ""
  });

  const handleCreateProject = () => {
    onCreateProject(newProject.name, newProject.description);
    setNewProject({ name: "", description: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="projectName" className="text-sm font-medium">Project Name</label>
            <Input 
              id="projectName" 
              value={newProject.name} 
              onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              placeholder="Enter project name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="projectDescription" className="text-sm font-medium">Project Description (Optional)</label>
            <Textarea 
              id="projectDescription" 
              value={newProject.description} 
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              placeholder="Enter project description"
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreateProject}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
