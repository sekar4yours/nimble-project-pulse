
import { useEffect } from 'react';
import useTaskStorage from './useTaskStorage';
import useProjectData from './useProjectData';
import useDragAndDrop from './useDragAndDrop';
import useTaskFilters from './useTaskFilters';

const useTaskManagement = (projectId: string, teamId: string | null) => {
  const { tasks, setTasks } = useTaskStorage();
  const { projects, setProjects, getProjectMembers } = useProjectData(projectId);
  
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

  const handleAddProjectMember = () => {
    // This function will be implemented in the parent component
    return projectId;
  };

  return {
    tasks,
    setTasks,
    getFilteredTasks,
    getProjectMembers,
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
