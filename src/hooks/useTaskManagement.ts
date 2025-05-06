
import { useState, useEffect } from 'react';
import { TaskWithComments, TaskStatus, TaskComment } from '@/types/task';
import { Team, TeamMember } from '@/types/team';
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

  // Team members state
  const [teams, setTeams] = useState<Team[]>([
    { 
      id: "team-1", 
      name: "Design Team",
      members: [
        { id: "user-1", name: "Alex" },
        { id: "user-2", name: "Sarah" }
      ]
    },
    { 
      id: "team-2", 
      name: "Development Team",
      members: [
        { id: "user-3", name: "Mike" },
        { id: "user-4", name: "Emily" }
      ]
    },
    { 
      id: "team-3", 
      name: "Marketing Team",
      members: [
        { id: "user-2", name: "Sarah" },
        { id: "user-5", name: "David" }
      ]
    }
  ]);

  // Get all team members from all teams
  const getAllTeamMembers = (): TeamMember[] => {
    const allMembers: TeamMember[] = [];
    const uniqueIds = new Set();
    
    teams.forEach(team => {
      if (team.members) {
        team.members.forEach(member => {
          if (!uniqueIds.has(member.id)) {
            allMembers.push(member);
            uniqueIds.add(member.id);
          }
        });
      }
    });
    
    return allMembers;
  };

  // Get team members for a specific team
  const getTeamMembers = (teamId: string | null): TeamMember[] => {
    if (!teamId) return getAllTeamMembers();
    
    const team = teams.find(t => t.id === teamId);
    return team?.members || [];
  };

  // Get filtered tasks based on active project and team
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
      
      // If team filter is active, filter by team members
      if (teamId) {
        const teamMembers = getTeamMembers(teamId);
        const teamMemberNames = teamMembers.map(m => m.name);
        
        filtered[status as TaskStatus] = statusTasks.filter(task => 
          task.assignee && teamMemberNames.includes(task.assignee)
        );
      } else {
        filtered[status as TaskStatus] = statusTasks;
      }
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
    getTeamMembers,
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
