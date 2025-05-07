
import { useState, useEffect } from 'react';
import { TeamMember } from '@/types/team';
import { TaskStatus, TaskWithComments } from '@/types/task';
import useTaskManagement from './useTaskManagement';
import { useTaskModals } from './useTaskModals';
import { useTaskOperations } from './useTaskOperations';
import useApi from './useApi';

interface UseTaskBoardProps {
  projectId: string;
  teamId: string | null;
  selectedMember?: string | null;
}

const useTaskBoard = ({ projectId, teamId, selectedMember }: UseTaskBoardProps) => {
  const api = useApi();
  
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
    handleTaskClick: originalHandleTaskClick,
    handleAddTask
  } = useTaskModals(projectId, tasks, setTasks);

  const {
    handleCreateTask: taskOperationsCreateTask,
    handleUpdateTask: taskOperationsUpdateTask,
    handleAddComment: taskOperationsAddComment
  } = useTaskOperations(tasks, setTasks);

  // Enhanced handleTaskClick to fetch task details and comments from API
  const handleTaskClick = async (taskId: string, columnId: string) => {
    // Use the original handler to set up the UI
    originalHandleTaskClick(taskId, columnId);
    
    // Then fetch task details from API
    if (projectId) {
      try {
        const result = await api.fetchTaskDetails(taskId);
        if (result.success && result.data) {
          // Update the selected task with the fetched data
          setSelectedTask(prevTask => {
            if (prevTask) {
              return {
                ...prevTask,
                ...result.data,
                comments: result.data.comments || []
              };
            }
            return prevTask;
          });
        }
      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    }
  };

  // Fetch tasks when project changes
  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  // Fetch tasks from API
  const fetchTasks = async () => {
    if (!projectId) return;
    
    const result = await api.fetchTasks(projectId);
    if (result.success && result.data) {
      // Convert API response to task format
      const tasksData: Record<TaskStatus, any[]> = result.data;
      setTasks(tasksData);
    }
  };

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

  // Enhanced create task to use API
  const handleCreateTask = async () => {
    // Use the original handler
    const success = taskOperationsCreateTask(newTask, targetColumn);
    
    if (success) {
      setIsTaskModalOpen(false);
      
      // Refresh tasks from API
      await fetchTasks();
    }
  };

  // Enhanced update task to use API
  const handleUpdateTask = async () => {
    // Use the original handler for now
    const success = taskOperationsUpdateTask(selectedTask);
    
    if (success) {
      setIsTaskDetailsOpen(false);
      
      // Refresh tasks from API
      await fetchTasks();
    }
  };

  // Enhanced add comment to use API
  const handleAddComment = async () => {
    if (!selectedTask || !newComment.trim()) return;
    
    // Add comment via API
    const result = await api.addTaskComment(selectedTask.id, newComment);
    
    if (result.success && result.data) {
      // Update the selected task with the new comment
      setSelectedTask(prevTask => {
        if (prevTask) {
          const updatedTask = {
            ...prevTask,
            comments: [...(prevTask.comments || []), result.data]
          };
          return updatedTask;
        }
        return prevTask;
      });
      
      // Clear comment input
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
