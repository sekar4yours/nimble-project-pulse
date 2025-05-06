
import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { TeamMember } from '@/types/team';

const useProjectData = (projectId: string) => {
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

  return {
    projects,
    setProjects,
    getProjectMembers
  };
};

export default useProjectData;
