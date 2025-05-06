
import { useEffect } from 'react';
import useTaskStorage from './useTaskStorage';
import useProjectData from './useProjectData';
import useDragAndDrop from './useDragAndDrop';
import useTaskFilters from './useTaskFilters';
import useTeamMembers from './useTeamMembers';

const useTaskManagement = (projectId: string, teamId: string | null) => {
  const { tasks, setTasks } = useTaskStorage();
  const { projects, getProjectMembers } = useProjectData(projectId);
  
  const { 
    draggedTask, 
    draggingOver, 
    handleDragStart, 
    handleDragOver, 
    handleDrop,
    handleDragOverTeamMember,
    handleDropOnTeamMember
  } = useDragAndDrop({ tasks, setTasks });
  
  const { getFilteredTasks } = useTaskFilters({ 
    tasks, 
    projectId, 
    getProjectMembers 
  });

  const { getTeamMembers, handleAddProjectMember } = useTeamMembers(projectId, getProjectMembers);

  return {
    tasks,
    setTasks,
    getFilteredTasks,
    getProjectMembers,
    getTeamMembers,
    draggedTask,
    draggingOver,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragOverTeamMember,
    handleDropOnTeamMember,
    handleAddProjectMember
  };
};

export default useTaskManagement;
