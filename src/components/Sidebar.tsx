
import React, { useState } from 'react';
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Project = {
  id: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
};

interface SidebarProps {
  activeProject: string | null;
  onProjectSelect: (projectId: string) => void;
  onCreateProject: () => void;
  onCreateTeam: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeProject, 
  onProjectSelect,
  onCreateProject,
  onCreateTeam 
}) => {
  // Sample data - in a real app, this would come from API
  const [projects, setProjects] = useState<Project[]>([
    { id: "project-1", name: "Marketing Campaign" },
    { id: "project-2", name: "Website Redesign" },
    { id: "project-3", name: "Mobile App Development" }
  ]);
  
  const [teams, setTeams] = useState<Team[]>([
    { id: "team-1", name: "Design Team" },
    { id: "team-2", name: "Development Team" },
    { id: "team-3", name: "Marketing Team" }
  ]);

  return (
    <div className="w-64 h-full bg-sidebar flex flex-col border-r border-border">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold text-primary">Project Pulse</h1>
      </div>
      
      <div className="flex flex-col flex-grow overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-muted-foreground">PROJECTS</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5"
              onClick={onCreateProject}
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
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-muted-foreground">TEAMS</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5"
              onClick={onCreateTeam}
            >
              <PlusCircle className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          
          <ul className="space-y-1">
            {teams.map(team => (
              <li 
                key={team.id}
                className="px-2 py-1.5 text-sm rounded-md hover:bg-secondary cursor-pointer"
              >
                {team.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            JD
          </div>
          <div className="text-sm">
            <div className="font-medium">John Doe</div>
            <div className="text-muted-foreground text-xs">john@example.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
