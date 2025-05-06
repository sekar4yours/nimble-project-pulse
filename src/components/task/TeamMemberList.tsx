
import React from 'react';
import { TeamMember } from '@/types/team';

interface TeamMemberListProps {
  teamMembers: TeamMember[];
  onDropOnTeamMember: (e: React.DragEvent, memberName: string) => void;
  handleDragOverTeamMember: (e: React.DragEvent, memberId: string) => void;
}

const TeamMemberList: React.FC<TeamMemberListProps> = ({
  teamMembers,
  onDropOnTeamMember,
  handleDragOverTeamMember
}) => {
  return (
    <div className="flex gap-6 mb-6">
      {teamMembers.map(member => (
        <div
          key={member.id}
          className="flex flex-col items-center p-2 border rounded-md cursor-pointer"
          onDragOver={(e) => handleDragOverTeamMember(e, member.id)}
          onDrop={(e) => onDropOnTeamMember(e, member.name)}
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium mb-1">
            {member.name.charAt(0)}
          </div>
          <span className="text-sm">{member.name}</span>
        </div>
      ))}
    </div>
  );
};

export default TeamMemberList;
