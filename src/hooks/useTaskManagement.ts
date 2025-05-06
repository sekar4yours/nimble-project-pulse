
import { useState, useEffect } from 'react';
import { TaskWithComments, TaskStatus, TaskComment } from '@/types/task';
import { TeamMember } from '@/types/team';
import { Project } from '@/types/project';
import { toast } from 'sonner';

const useTaskManagement = (projectId: string, teamId: string | null) => {
  // Get tasks from localStorage if available
  const getInitialTasks = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    
    return {
      'backlog': [
        { 
          id: "task-1", 
          title: "Design Landing Page", 
          description: "Create wireframes for the new landing page", 
          assignee: "Alex", 
          priority: "high",
          dueDate: "May 10",
          tags: ["design", "ui"],
          projectId: "project-1",
          createdBy: "John Doe",
          comments: [
            {
              id: "comment-1",
              author: "John Doe",
              text: "Make sure to use the new brand guidelines.",
              createdAt: "2023-05-01T10:00:00Z"
            }
          ]
        },
        { 
          id: "task-2", 
          title: "Implement User Authentication", 
          description: "Add JWT authentication to the backend", 
          assignee: "Sarah", 
          priority: "medium",
          tags: ["backend", "security"],
          projectId: "project-2",
          createdBy: "John Doe"
        }
      ],
      'in-progress': [
        { 
          id: "task-3", 
          title: "API Documentation", 
          description: "Document all API endpoints using Swagger", 
          assignee: "Mike", 
          priority: "low",
          dueDate: "May 15",
          projectId: "project-1",
          createdBy: "John Doe"
        }
      ],
      'done': [
        { 
          id: "task-4", 
          title: "Database Schema", 
          description: "Design initial database schema for the project", 
          assignee: "Emily", 
          priority: "medium",
          tags: ["database", "architecture"],
          projectId: "project-3",
          createdBy: "John Doe"
        }
      ]
    };
  };

  const [tasks, setTasks] = useState<Record<TaskStatus, TaskWithComments[]>>(getInitialTasks());

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Projects state
  const [projects, setProjects] = useState<Project[]>([
    { 
      id: "project-1", 
      name: "Marketing Campaign",
      description: "Q2 marketing campaign for product launch",
      members: [
        { id: "user-1", name: "Alex" },
        { id: "user-2", name: "Sarah" }
      ]
    },
    { 
      id: "project-2", 
      name: "Website Redesign",
      description: "Redesign the company website with new branding",
      members: [
        { id: "user-3", name: "Mike" },
        { id: "user-4", name: "Emily" }
      ]
    },
    { 
      id: "project-3", 
      name: "Mobile App Development",
      description: "Develop a mobile app for iOS and Android",
      members: [
        { id: "user-2", name: "Sarah" },
        { id: "user-5", name: "David" }
      ]
    }
  ]);

  // Get project members for the current project
  const getProjectMembers = (): TeamMember[] => {
    const project = projects.find(p => p.id === projectId);
    return project?.members || [];
  };

  // Get filtered tasks based on active project
  const getFilteredTasks = () => {
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
    
    return filtered;
  };

  // Drag and drop state
  const [draggedTask, setDraggedTask] = useState<{
    taskId: string;
    fromColumn: TaskStatus;
  } | null>(null);

  const [draggingOver, setDraggingOver] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string, fromColumn: string) => {
    setDraggedTask({
      taskId,
      fromColumn: fromColumn as TaskStatus
    });
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDraggingOver(columnId);
  };

  const handleDrop = (e: React.DragEvent, targetColumn: string) => {
    setDraggingOver(null);
    if (!draggedTask) return;
    
    const { taskId, fromColumn } = draggedTask;
    const fromColumnTyped = fromColumn as TaskStatus;
    const targetColumnTyped = targetColumn as TaskStatus;
    
    if (fromColumnTyped === targetColumnTyped) return;
    
    const taskToMove = tasks[fromColumnTyped].find(task => task.id === taskId);
    if (!taskToMove) return;
    
    // Remove from source column
    const updatedSourceColumn = tasks[fromColumnTyped].filter(task => task.id !== taskId);
    
    // Add to target column
    const updatedTargetColumn = [...tasks[targetColumnTyped], taskToMove];
    
    setTasks({
      ...tasks,
      [fromColumnTyped]: updatedSourceColumn,
      [targetColumnTyped]: updatedTargetColumn
    });

    toast(`Task "${taskToMove.title}" moved to ${targetColumn.replace('-', ' ')}`);
  };

  // Team member drag and drop
  const handleDragOverTeamMember = (e: React.DragEvent, memberId: string) => {
    e.preventDefault();
  };

  const handleDropOnTeamMember = (e: React.DragEvent, memberName: string) => {
    if (!draggedTask) return;
    
    const { taskId, fromColumn } = draggedTask;
    const fromColumnTyped = fromColumn as TaskStatus;
    
    const taskToUpdate = tasks[fromColumnTyped].find(task => task.id === taskId);
    if (!taskToUpdate) return;
    
    // Update the task with the new assignee
    const updatedTask = { ...taskToUpdate, assignee: memberName };
    
    // Create updated task list
    const updatedTasks = tasks[fromColumnTyped].map(task => 
      task.id === taskId ? updatedTask : task
    );
    
    setTasks({
      ...tasks,
      [fromColumnTyped]: updatedTasks
    });

    toast(`Task "${updatedTask.title}" assigned to ${memberName}`);
  };

  return {
    tasks,
    setTasks,
    getFilteredTasks,
    getTeamMembers: getProjectMembers,
    draggedTask,
    draggingOver,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragOverTeamMember,
    handleDropOnTeamMember
  };
};

export default useTaskManagement;
