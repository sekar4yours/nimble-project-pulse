
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TeamModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  onTeamNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateTeam: () => void;
}

const TeamModal: React.FC<TeamModalProps> = ({
  isOpen,
  onOpenChange,
  teamName,
  onTeamNameChange,
  onCreateTeam
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="teamName" className="text-sm font-medium">Team Name</label>
            <Input 
              id="teamName" 
              value={teamName} 
              onChange={onTeamNameChange}
              placeholder="Enter team name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onCreateTeam}>Create Team</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamModal;
