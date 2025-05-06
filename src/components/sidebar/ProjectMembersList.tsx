
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PlusCircle, UserPlus, Users } from "lucide-react";
import { TeamMember } from "@/types/team";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectMembersListProps {
  activeProject: Project | null;
  onAddMember: (projectId: string) => void;
  onInviteMember?: (projectId: string) => void;
  onSelectMember?: (member: TeamMember) => void;
  selectedMember?: string | null;
}

const ProjectMembersList: React.FC<ProjectMembersListProps> = ({
  activeProject,
  onAddMember,
  onInviteMember,
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
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5"
            onClick={() => onAddMember(activeProject.id)}
            title="Add Member"
          >
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Add Member</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5"
            onClick={() => onInviteMember ? onInviteMember(activeProject.id) : onAddMember(activeProject.id)}
            title="Invite Member via Email"
          >
            <UserPlus className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Invite Team Member</span>
          </Button>
        </div>
      </div>
      
      <ul className="space-y-1 pl-2">
        {activeProject.members && activeProject.members.length > 0 ? (
          activeProject.members.map(member => (
            <li 
              key={member.id}
              onClick={() => onSelectMember && onSelectMember(member)}
              className={cn(
                "flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors",
                selectedMember === member.id 
                  ? "bg-primary text-white" 
                  : "bg-secondary hover:bg-secondary/80"
              )}
              // Make members droppable for task assignment
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const taskData = e.dataTransfer.getData('task');
                if (taskData) {
                  console.log(`Task ${taskData} assigned to ${member.name}`);
                }
              }}
            >
              <Avatar className="h-8 w-8 mr-3">
                <AvatarFallback className="bg-primary/80 text-white">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{member.name}</span>
                {member.role && (
                  <span className="text-xs opacity-80">{member.role}</span>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="text-xs text-muted-foreground py-2 px-2">No members yet</li>
        )}
      </ul>
    </div>
  );
};

export default ProjectMembersList;
