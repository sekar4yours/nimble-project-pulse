
import React from 'react';
import { TeamMember } from '@/types/team';

interface TaskHeaderProps {
  projectId: string;
  selectedMember: string | null;
  teamMembers: TeamMember[];
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ 
  projectId, 
  selectedMember, 
  teamMembers 
}) => {
  const getProjectName = () => {
    switch(projectId) {
      case "project-1": return "Marketing Campaign";
      case "project-2": return "Website Redesign";
      case "project-3": return "Mobile App Development";
      default: return "Project";
    }
  };

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">{getProjectName()}</h1>
      <p className="text-sm text-muted-foreground">
        {selectedMember 
          ? `Filtered by team member: ${teamMembers.find(m => m.id === selectedMember)?.name || 'Unknown'}`
          : "Manage tasks by dragging them between columns"}
      </p>
    </div>
  );
};

export default TaskHeader;
