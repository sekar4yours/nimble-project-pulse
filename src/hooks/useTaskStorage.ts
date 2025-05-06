
import { useState, useEffect } from 'react';
import { TaskWithComments, TaskStatus } from '@/types/task';

const useTaskStorage = () => {
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

  return {
    tasks,
    setTasks
  };
};

export default useTaskStorage;
