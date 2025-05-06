
import React from 'react';
import TeamMemberList from '../TeamMemberList';
import { TeamMember } from '@/types/team';
import useDragAndDrop from '@/hooks/useDragAndDrop';
import useTaskStorage from '@/hooks/useTaskStorage';

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
  const { tasks, setTasks } = useTaskStorage();
  const { handleDragOverTeamMember, handleDropOnTeamMember } = useDragAndDrop({ tasks, setTasks });
  
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      
      <TeamMemberList 
        teamMembers={teamMembers}
        selectedMember={selectedMember}
        handleDragOverTeamMember={handleDragOverTeamMember}
        onDropOnTeamMember={handleDropOnTeamMember}
      />
    </div>
  );
};

export default TaskHeader;
