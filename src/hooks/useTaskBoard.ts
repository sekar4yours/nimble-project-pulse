
import { useState, useEffect } from 'react';
import { TeamMember } from '@/types/team';
import { TaskStatus, TaskWithComments } from '@/types/task';
import useTaskManagement from './useTaskManagement';
import { useTaskModals } from './useTaskModals';
import { useTaskOperations } from './useTaskOperations';

interface UseTaskBoardProps {
  projectId: string;
  teamId: string | null;
  selectedMember?: string | null;
}

const useTaskBoard = ({ projectId, teamId, selectedMember }: UseTaskBoardProps) => {
  const {
    tasks,
    setTasks,
    getFilteredTasks,
    getTeamMembers,
    draggedTask,
    draggingOver,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragOverTeamMember,
    handleDropOnTeamMember
  } = useTaskManagement(projectId, teamId);

  const [filteredTasks, setFilteredTasks] = useState(getFilteredTasks());
  const teamMembers = getTeamMembers();

  const {
    isTaskModalOpen,
    setIsTaskModalOpen,
    newTask,
    setNewTask,
    targetColumn,
    isTaskDetailsOpen,
    setIsTaskDetailsOpen,
    selectedTask,
    setSelectedTask,
    isCurrentUserTaskCreator,
    newComment,
    setNewComment,
    handleTaskClick,
    handleAddTask
  } = useTaskModals(projectId, tasks, setTasks);

  const {
    handleCreateTask: taskOperationsCreateTask,
    handleUpdateTask: taskOperationsUpdateTask,
    handleAddComment: taskOperationsAddComment
  } = useTaskOperations(tasks, setTasks);

  // Update filtered tasks when project or selected member changes
  useEffect(() => {
    const allTasks = getFilteredTasks();
    
    if (selectedMember) {
      // If a member is selected, filter tasks by assignee
      const memberName = teamMembers.find(m => m.id === selectedMember)?.name;
      
      if (memberName) {
        const memberFilteredTasks: Record<TaskStatus, TaskWithComments[]> = {
          'backlog': allTasks.backlog.filter(task => task.assignee === memberName),
          'in-progress': allTasks['in-progress'].filter(task => task.assignee === memberName),
          'done': allTasks.done.filter(task => task.assignee === memberName),
        };
        setFilteredTasks(memberFilteredTasks);
      } else {
        setFilteredTasks(allTasks);
      }
    } else {
      setFilteredTasks(allTasks);
    }
  }, [projectId, selectedMember, tasks]);

  // Wrapped handlers to maintain the original API but using the new hooks
  const handleCreateTask = () => {
    const success = taskOperationsCreateTask(newTask, targetColumn);
    if (success) {
      setIsTaskModalOpen(false);
    }
  };

  const handleUpdateTask = () => {
    const success = taskOperationsUpdateTask(selectedTask);
    if (success) {
      setIsTaskDetailsOpen(false);
    }
  };

  const handleAddComment = () => {
    const updatedTask = taskOperationsAddComment(selectedTask, newComment);
    if (updatedTask) {
      setSelectedTask(updatedTask);
      setNewComment('');
    }
  };

  return {
    // Task management
    filteredTasks,
    teamMembers,
    draggedTask,
    draggingOver,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragOverTeamMember,
    handleDropOnTeamMember,
    
    // Task operations
    handleTaskClick,
    handleAddTask,
    
    // Modal management and states
    isTaskModalOpen,
    setIsTaskModalOpen,
    newTask,
    setNewTask,
    handleCreateTask,
    isTaskDetailsOpen,
    setIsTaskDetailsOpen,
    selectedTask,
    setSelectedTask,
    isCurrentUserTaskCreator,
    handleUpdateTask,
    newComment,
    setNewComment,
    handleAddComment
  };
};

export default useTaskBoard;
