
import React from 'react';
import { TeamMember } from '@/types/team';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface TeamMemberListProps {
  teamMembers: TeamMember[];
  onDropOnTeamMember: (e: React.DragEvent, memberName: string) => void;
  handleDragOverTeamMember: (e: React.DragEvent, memberId: string) => void;
  selectedMember?: string | null;
  onAddMember?: () => void;
}

const TeamMemberList: React.FC<TeamMemberListProps> = ({
  teamMembers,
  onDropOnTeamMember,
  handleDragOverTeamMember,
  selectedMember,
  onAddMember
}) => {
  return (
    <div className="flex gap-4 mb-6 items-center">
      {teamMembers.map(member => (
        <div
          key={member.id}
          className={cn(
            "flex flex-col items-center p-2 border rounded-md cursor-pointer transition-colors",
            selectedMember === member.id ? "border-primary bg-primary-foreground" : "hover:border-primary-foreground",
            "relative" // Add relative positioning for drop indicator
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
          
          {/* Visual indicator for drag and drop */}
          <div className="text-xs text-muted-foreground mt-1 opacity-70">
            Drop task to assign
          </div>
        </div>
      ))}
      
      {onAddMember && (
        <Button 
          variant="outline" 
          size="icon"
          className="w-10 h-10 rounded-full border-dashed"
          onClick={onAddMember}
        >
          <PlusCircle className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Add member</span>
        </Button>
      )}
    </div>
  );
};

export default TeamMemberList;
