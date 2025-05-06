
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onCreateProject(newProject.name, newProject.description);
      setNewProject({ name: "", description: "" });
      toast.success(`Project "${newProject.name}" created successfully`);
    } catch (error) {
      toast.error("Failed to create project");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project to your workspace. Projects help you organize your tasks and team members.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="projectName" className="text-sm font-medium">Project Name <span className="text-red-500">*</span></label>
            <Input 
              id="projectName" 
              value={newProject.name} 
              onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              placeholder="Enter project name"
              autoFocus
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
          <Button 
            onClick={handleCreateProject} 
            disabled={isSubmitting || !newProject.name.trim()}
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
