import { useState } from 'react';
import { TaskWithComments, TaskStatus } from '@/types/task';
import { toast } from 'sonner';

export const useTaskModals = (projectId: string, tasks: Record<TaskStatus, TaskWithComments[]>, setTasks: React.Dispatch<React.SetStateAction<Record<TaskStatus, TaskWithComments[]>>>) => {
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

  return {
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
  };
};
