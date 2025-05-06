
import React, { useState, useEffect } from 'react';
import { PlusCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TeamMemberModal from './TeamMemberModal';
import ProjectModal from './ProjectModal';

export type Project = {
  id: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  email: string;
  initials: string;
};

interface SidebarProps {
  activeProject: string | null;
  onProjectSelect: (projectId: string) => void;
  onCreateProject: () => void;
  onCreateTeam: () => void;
  teams: Team[];
  projects: Project[];
  onAddTeamMember: (team: Team) => void;
  onAddProject: (project: Project) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeProject, 
  onProjectSelect,
  onCreateProject,
  onCreateTeam,
  teams,
  projects,
  onAddTeamMember,
  onAddProject,
  onLogout
}) => {
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [user, setUser] = useState<{name: string, email: string, initials: string} | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

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
              onClick={() => setIsProjectModalOpen(true)}
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
              onClick={() => setIsTeamModalOpen(true)}
            >
              <PlusCircle className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          
          <ul className="space-y-1">
            {teams.map(team => (
              <li 
                key={team.id}
                className="px-2 py-1.5 text-sm rounded-md hover:bg-secondary cursor-pointer flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                  {team.initials}
                </div>
                <span>{team.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-2">
          {user && (
            <>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                {user.initials}
              </div>
              <div className="text-sm">
                <div className="font-medium">{user.name}</div>
                <div className="text-muted-foreground text-xs">{user.email}</div>
              </div>
            </>
          )}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-2" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <TeamMemberModal 
        isOpen={isTeamModalOpen} 
        onClose={() => setIsTeamModalOpen(false)} 
        onAddTeamMember={onAddTeamMember}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onAddProject={onAddProject}
      />
    </div>
  );
};

export default Sidebar;
