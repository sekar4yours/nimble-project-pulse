
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project";

interface ProjectListProps {
  projects: Project[];
  activeProject: string | null;
  onProjectSelect: (projectId: string) => void;
  onAddProject: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  activeProject,
  onProjectSelect,
  onAddProject,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-muted-foreground flex items-center">
          <FolderKanban className="mr-2 h-4 w-4 text-muted-foreground" />
          PROJECTS
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5"
          onClick={onAddProject}
        >
          <PlusCircle className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Add Project</span>
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
            <div className="flex justify-between items-center">
              <span className="flex-grow truncate">{project.name}</span>
            </div>
            {project.description && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {project.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
