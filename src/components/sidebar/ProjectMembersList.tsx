
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { TeamMember } from "@/types/team";
import { Project } from "@/types/project";

interface ProjectMembersListProps {
  activeProject: Project | null;
  onAddMember: (projectId: string) => void;
}

const ProjectMembersList: React.FC<ProjectMembersListProps> = ({
  activeProject,
  onAddMember
}) => {
  if (!activeProject) return null;
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-muted-foreground flex items-center">
          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
          PROJECT MEMBERS
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5"
          onClick={() => onAddMember(activeProject.id)}
        >
          <PlusCircle className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      
      <ul className="space-y-1 pl-4">
        {activeProject.members && activeProject.members.length > 0 ? (
          activeProject.members.map(member => (
            <li 
              key={member.id}
              className="flex items-center px-2 py-1 text-xs text-muted-foreground"
            >
              <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-xs mr-2">
                {member.name.charAt(0)}
              </div>
              {member.name}
              {member.role && (
                <span className="ml-1 text-xs text-muted-foreground">({member.role})</span>
              )}
            </li>
          ))
        ) : (
          <li className="text-xs text-muted-foreground">No members yet</li>
        )}
      </ul>
    </div>
  );
};

export default ProjectMembersList;
