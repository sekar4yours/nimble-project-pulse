
import React from 'react';
import { PlusCircle, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Project } from '@/types/sidebar';

interface ProjectListProps {
  projects: Project[];
  activeProject: string | null;
  onProjectSelect: (projectId: string) => void;
  onOpenProjectModal: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  activeProject, 
  onProjectSelect,
  onOpenProjectModal
}) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-muted-foreground flex items-center">
          <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
          PROJECTS
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5"
          onClick={onOpenProjectModal}
        >
          <PlusCircle className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      
      <ul className="space-y-1">
        {projects.map(project => (
          <li 
            key={project.id}
            className={cn(
              "px-2 py-1.5 text-sm rounded-md cursor-pointer",
              activeProject === project.id ? "bg-primary text-white" : "hover:bg-secondary"
            )}
            onClick={() => onProjectSelect(project.id)}
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
