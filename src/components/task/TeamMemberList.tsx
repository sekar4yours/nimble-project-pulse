
import React from 'react';
import { TeamMember } from '@/types/team';
import { cn } from '@/lib/utils';

interface TeamMemberListProps {
  teamMembers: TeamMember[];
  onDropOnTeamMember: (e: React.DragEvent, memberName: string) => void;
  handleDragOverTeamMember: (e: React.DragEvent, memberId: string) => void;
  selectedMember?: string | null;
}

const TeamMemberList: React.FC<TeamMemberListProps> = ({
  teamMembers,
  onDropOnTeamMember,
  handleDragOverTeamMember,
  selectedMember
}) => {
  return (
    <div className="flex gap-6 mb-6">
      {teamMembers.map(member => (
        <div
          key={member.id}
          className={cn(
            "flex flex-col items-center p-2 border rounded-md cursor-pointer transition-colors",
            selectedMember === member.id ? "border-primary bg-primary-foreground" : "hover:border-primary-foreground"
          )}
          onDragOver={(e) => handleDragOverTeamMember(e, member.id)}
          onDrop={(e) => onDropOnTeamMember(e, member.name)}
        >
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-medium mb-1",
            selectedMember === member.id ? "bg-primary text-white" : "bg-primary text-white"
          )}>
            {member.name.charAt(0)}
          </div>
          <span className="text-sm">{member.name}</span>
          {member.role && (
            <span className="text-xs text-muted-foreground">{member.role}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeamMemberList;
