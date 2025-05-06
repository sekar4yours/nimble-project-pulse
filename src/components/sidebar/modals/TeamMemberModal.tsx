
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Team, TeamMember } from '@/types/sidebar';

interface TeamMemberModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTeam: Team | null;
  teamMember: {
    name: string;
    email: string;
    role: string;
  };
  onTeamMemberChange: (field: keyof TeamMember, value: string) => void;
  onCreateTeamMember: () => void;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  isOpen,
  onOpenChange,
  selectedTeam,
  teamMember,
  onTeamMemberChange,
  onCreateTeamMember
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add Member to {selectedTeam?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="memberName" className="text-sm font-medium">Name</label>
            <Input 
              id="memberName" 
              value={teamMember.name} 
              onChange={(e) => onTeamMemberChange('name', e.target.value)}
              placeholder="Enter member name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="memberEmail" className="text-sm font-medium">Email</label>
            <Input 
              id="memberEmail" 
              value={teamMember.email} 
              onChange={(e) => onTeamMemberChange('email', e.target.value)}
              placeholder="Enter member email"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="memberRole" className="text-sm font-medium">Role</label>
            <Input 
              id="memberRole" 
              value={teamMember.role} 
              onChange={(e) => onTeamMemberChange('role', e.target.value)}
              placeholder="Enter member role"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onCreateTeamMember}>Add Member</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberModal;
