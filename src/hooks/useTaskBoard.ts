import { useState, useEffect } from 'react';
import { TeamMember } from '@/types/team';
import { TaskStatus, TaskWithComments } from '@/types/task';
import { toast } from 'sonner';
import useTaskManagement from './useTaskManagement';

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

  // Task modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<TaskWithComments>>({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    projectId: projectId,
    createdBy: 'John Doe'
  });
  const [targetColumn, setTargetColumn] = useState<TaskStatus>('backlog');

  // Task details modal state
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithComments | null>(null);
  const [isCurrentUserTaskCreator, setIsCurrentUserTaskCreator] = useState(false);
  
  // Comment state
  const [newComment, setNewComment] = useState('');

  const handleTaskClick = (taskId: string, columnId: TaskStatus) => {
    const task = tasks[columnId].find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      // Check if current user is the creator of the task
      setIsCurrentUserTaskCreator(task.createdBy === 'John Doe');
      setIsTaskDetailsOpen(true);
    }
  };

  const handleAddTask = (columnId: TaskStatus) => {
    setTargetColumn(columnId);
    // Reset new task form but keep the project ID
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
      projectId: projectId,
      createdBy: 'John Doe'
    });
    setIsTaskModalOpen(true);
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const taskId = `task-${Date.now()}`;
    const createdTask: TaskWithComments = {
      id: taskId,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority as TaskWithComments['priority'] || 'medium',
      assignee: newTask.assignee,
      projectId: projectId,
      createdBy: 'John Doe',
      comments: []
    };

    setTasks({
      ...tasks,
      [targetColumn]: [...tasks[targetColumn], createdTask]
    });

    toast.success(`Task "${createdTask.title}" created`);
    setIsTaskModalOpen(false);
  };

  const handleUpdateTask = () => {
    if (!selectedTask) return;
    
    const { id } = selectedTask;
    const columnId = Object.keys(tasks).find(column => 
      tasks[column as TaskStatus].some(task => task.id === id)
    ) as TaskStatus;
    
    if (!columnId) return;
    
    const updatedTasks = tasks[columnId].map(task => 
      task.id === id ? selectedTask : task
    );
    
    setTasks({
      ...tasks,
      [columnId]: updatedTasks
    });
    
    toast.success(`Task "${selectedTask.title}" updated`);
    setIsTaskDetailsOpen(false);
  };

  const handleAddComment = () => {
    if (!selectedTask || !newComment.trim()) return;
    
    const comment = {
      id: `comment-${Date.now()}`,
      author: 'John Doe',
      text: newComment,
      createdAt: new Date().toISOString()
    };
    
    // Find which column the task is in
    const columnId = Object.keys(tasks).find(column => 
      tasks[column as TaskStatus].some(task => task.id === selectedTask.id)
    ) as TaskStatus;
    
    if (!columnId) return;
    
    // Create updated task with new comment
    const updatedTask = {
      ...selectedTask,
      comments: [...(selectedTask.comments || []), comment]
    };
    
    // Update tasks state
    const updatedTasks = tasks[columnId].map(task => 
      task.id === selectedTask.id ? updatedTask : task
    );
    
    setTasks({
      ...tasks,
      [columnId]: updatedTasks
    });
    
    // Update selected task with new comment
    setSelectedTask(updatedTask);
    setNewComment('');
    
    toast.success('Comment added');
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
