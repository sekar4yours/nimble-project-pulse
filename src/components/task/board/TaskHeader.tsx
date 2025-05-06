
import React from 'react';
import { TeamMember } from '@/types/team';

interface TaskHeaderProps {
  projectId: string;
  selectedMember?: string | null;
  teamMembers: TeamMember[];
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ 
  projectId,
  selectedMember,
  teamMembers
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      {selectedMember && (
        <div className="text-sm text-muted-foreground mb-2">
          Filtered by: {teamMembers.find(m => m.id === selectedMember)?.name}
        </div>
      )}
    </div>
  );
};

export default TaskHeader;
