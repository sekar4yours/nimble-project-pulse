
import { useState, useEffect } from 'react';
import { TaskWithComments, TaskStatus } from '@/types/task';
import { TeamMember } from '@/types/team';

interface UseTaskFiltersProps {
  tasks: Record<TaskStatus, TaskWithComments[]>;
  projectId: string;
  getProjectMembers: () => TeamMember[];
}

const useTaskFilters = ({ tasks, projectId, getProjectMembers }: UseTaskFiltersProps) => {
  // Get filtered tasks based on active project and selected member
  const getFilteredTasks = (selectedMember?: string | null) => {
    const filtered: Record<TaskStatus, TaskWithComments[]> = {
      'backlog': [],
      'in-progress': [],
      'done': []
    };
    
    // Filter by project
    Object.keys(tasks).forEach(status => {
      const statusTasks = tasks[status as TaskStatus].filter(task => 
        (!task.projectId || task.projectId === projectId)
      );
      filtered[status as TaskStatus] = statusTasks;
    });

    // Further filter by team member if selected
    if (selectedMember) {
      const teamMembers = getProjectMembers();
      const memberName = teamMembers.find(m => m.id === selectedMember)?.name;
      
      if (memberName) {
        Object.keys(filtered).forEach(status => {
          filtered[status as TaskStatus] = filtered[status as TaskStatus]
            .filter(task => task.assignee === memberName);
        });
      }
    }
    
    return filtered;
  };

  return { getFilteredTasks };
};

export default useTaskFilters;
