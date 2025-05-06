
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { TeamMember } from "@/types/team";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectMembersListProps {
  activeProject: Project | null;
  onAddMember: (projectId: string) => void;
  onSelectMember?: (member: TeamMember) => void;
  selectedMember?: string | null;
}

const ProjectMembersList: React.FC<ProjectMembersListProps> = ({
  activeProject,
  onAddMember,
  onSelectMember,
  selectedMember
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
          <span className="sr-only">Add Member</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 pl-2">
        {activeProject.members && activeProject.members.length > 0 ? (
          activeProject.members.map(member => (
            <div
              key={member.id}
              onClick={() => onSelectMember && onSelectMember(member)}
              className={cn(
                "flex flex-col items-center p-2 rounded-md cursor-pointer transition-colors text-center",
                selectedMember === member.id 
                  ? "bg-primary text-white" 
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-white font-medium mb-1">
                {member.name.charAt(0)}
              </div>
              <span className="text-xs font-medium truncate w-full">{member.name}</span>
              {member.role && (
                <span className="text-xs opacity-80 truncate w-full">{member.role}</span>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2 text-xs text-muted-foreground py-2">No members yet</div>
        )}
      </div>
    </div>
  );
};

export default ProjectMembersList;
