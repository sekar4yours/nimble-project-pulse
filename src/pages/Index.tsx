
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import TaskBoard from "@/components/TaskBoard";
import { toast } from "sonner";
import { TeamMember } from "@/types/team";
import CreateMemberModal from "@/components/sidebar/CreateMemberModal";
import InviteMemberModal from "@/components/sidebar/InviteMemberModal";
import { Project } from "@/types/project";

const Index = () => {
  const [activeProject, setActiveProject] = useState<string>("project-1");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [isProjectMemberModalOpen, setIsProjectMemberModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);
  const [selectedProjectForMember, setSelectedProjectForMember] = useState<Project | null>(null);
  const navigate = useNavigate();

  // Sample projects - this would be fetched from API in a real app
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

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  // Load state from localStorage if available
  useEffect(() => {
    const savedProject = localStorage.getItem('activeProject');
    
    if (savedProject) {
      setActiveProject(savedProject);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeProject', activeProject);
  }, [activeProject]);

  const handleProjectSelect = (projectId: string) => {
    setActiveProject(projectId);
    // Clear selected member when switching projects
    setSelectedMember(null);
    toast(`Switched to ${projectId === "project-1" ? "Marketing Campaign" : 
           projectId === "project-2" ? "Website Redesign" : "Mobile App Development"}`);
  };

  const handleMemberSelect = (memberId: string) => {
    setSelectedMember(memberId === selectedMember ? null : memberId);
  };

  const handleCreateProject = () => {
    // Now handled within the Sidebar component
  };

  const handleAddMember = () => {
    const currentProject = projects.find(p => p.id === activeProject);
    if (currentProject) {
      setSelectedProjectForMember(currentProject);
      setIsProjectMemberModalOpen(true);
    }
  };

  const handleInviteMember = () => {
    const currentProject = projects.find(p => p.id === activeProject);
    if (currentProject) {
      setSelectedProjectForMember(currentProject);
      setIsInviteMemberModalOpen(true);
    }
  };

  const handleCreateProjectMember = (name: string, email: string, role: string) => {
    if (!selectedProjectForMember) return;

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

  const handleSendInvite = (email: string) => {
    if (!selectedProjectForMember) return;
    
    // In a real app, this would send an invitation email
    toast.success(`Invitation sent to ${email}`);
    setIsInviteMemberModalOpen(false);
  };

  // Get the current project
  const activeProjectData = projects.find(p => p.id === activeProject) || null;
  const teamMembers = activeProjectData?.members || [];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        activeProject={activeProject}
        onProjectSelect={handleProjectSelect}
        onCreateProject={handleCreateProject}
        onMemberSelect={handleMemberSelect}
        onAddMember={handleAddMember}
        onInviteMember={handleInviteMember}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TaskBoard 
          projectId={activeProject}
          teamId={null}
          selectedMember={selectedMember}
        />
      </div>

      <CreateMemberModal 
        isOpen={isProjectMemberModalOpen}
        onClose={() => setIsProjectMemberModalOpen(false)}
        selectedProject={selectedProjectForMember}
        onCreateMember={handleCreateProjectMember}
      />

      <InviteMemberModal
        isOpen={isInviteMemberModalOpen}
        onClose={() => setIsInviteMemberModalOpen(false)}
        selectedProject={selectedProjectForMember}
        onSendInvite={handleSendInvite}
      />
    </div>
  );
};

export default Index;
