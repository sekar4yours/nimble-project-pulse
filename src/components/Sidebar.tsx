
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderKanban } from "lucide-react";
import { toast } from "sonner";
import { Project } from "@/types/project";
import { TeamMember } from "@/types/team";

// Import our new components
import ProjectList from "./sidebar/ProjectList";
import ProjectMembersList from "./sidebar/ProjectMembersList";
import UserProfile from "./sidebar/UserProfile";
import CreateProjectModal from "./sidebar/CreateProjectModal";
import CreateMemberModal from "./sidebar/CreateMemberModal";

interface SidebarProps {
  activeProject: string | null;
  onProjectSelect: (projectId: string) => void;
  onCreateProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeProject,
  onProjectSelect,
  onCreateProject
}) => {
  // Sample data - in a real app, this would come from API
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

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProjectMemberModalOpen, setIsProjectMemberModalOpen] = useState(false);
  const [selectedProjectForMember, setSelectedProjectForMember] = useState<Project | null>(null);

  // Auth state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check localStorage for authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Get the currently selected project's details
  const activeProjectData = activeProject 
    ? projects.find(p => p.id === activeProject) 
    : null;

  const handleAddProject = () => {
    setIsProjectModalOpen(true);
  };

  const handleCreateProject = (name: string, description: string) => {
    if (!name.trim()) return;
    
    const newProjectData: Project = {
      id: `project-${Date.now()}`,
      name: name,
      description: description,
      members: []
    };
    
    setProjects([...projects, newProjectData]);
    setIsProjectModalOpen(false);
    onProjectSelect(newProjectData.id);
    toast.success(`Project "${newProjectData.name}" created`);
  };

  const handleAddProjectMember = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProjectForMember(project);
      setIsProjectMemberModalOpen(true);
    }
  };

  const handleCreateProjectMember = (name: string, email: string, role: string) => {
    if (!selectedProjectForMember || !name.trim()) return;

    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: name,
      email: email,
      role: role
    };

    const updatedProjects = projects.map(project => {
      if (project.id === selectedProjectForMember.id) {
        return {
          ...project,
          members: [...(project.members || []), newMember]
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    setIsProjectMemberModalOpen(false);
    toast.success(`${newMember.name} added to ${selectedProjectForMember.name}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold text-sidebar-foreground flex items-center gap-2">
          <FolderKanban className="h-5 w-5" /> Project Pulse
        </h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <ProjectList 
            projects={projects}
            activeProject={activeProject}
            onProjectSelect={onProjectSelect}
            onAddProject={handleAddProject}
          />
          
          <ProjectMembersList 
            activeProject={activeProjectData}
            onAddMember={handleAddProjectMember}
          />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <UserProfile 
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      </div>

      {/* Modals */}
      <CreateProjectModal 
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <CreateMemberModal 
        isOpen={isProjectMemberModalOpen}
        onClose={() => setIsProjectMemberModalOpen(false)}
        selectedProject={selectedProjectForMember}
        onCreateMember={handleCreateProjectMember}
      />
    </div>
  );
};

export default Sidebar;
