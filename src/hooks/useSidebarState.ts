
import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { TeamMember } from '@/types/team';
import { toast } from 'sonner';

export interface SidebarState {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (isOpen: boolean) => void;
  isProjectMemberModalOpen: boolean;
  setIsProjectMemberModalOpen: (isOpen: boolean) => void;
  isInviteMemberModalOpen: boolean;
  setIsInviteMemberModalOpen: (isOpen: boolean) => void;
  selectedProjectForMember: Project | null;
  setSelectedProjectForMember: (project: Project | null) => void;
  selectedMemberId: string | null;
  setSelectedMemberId: (memberId: string | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  handleCreateProject: (name: string, description: string) => void;
  handleAddProjectMember: (projectId: string) => void;
  handleCreateProjectMember: (name: string, email: string, role: string) => void;
  handleInviteMember: (projectId: string) => void;
  handleSendInvite: (email: string) => void;
  handleMemberSelect: (member: TeamMember) => void;
  handleLogout: () => void;
}

export const useSidebarState = (
  activeProject: string | null,
  onProjectSelect: (projectId: string) => void,
  onMemberSelect?: (memberId: string) => void
): SidebarState => {
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
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);
  const [selectedProjectForMember, setSelectedProjectForMember] = useState<Project | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Auth state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check localStorage for authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

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

  const handleInviteMember = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProjectForMember(project);
      setIsInviteMemberModalOpen(true);
    }
  };

  const handleSendInvite = (email: string) => {
    if (!selectedProjectForMember || !email.trim()) return;
    
    // In a real app, this would send an invitation email
    toast.success(`Invitation sent to ${email}`);
    setIsInviteMemberModalOpen(false);
  };

  const handleMemberSelect = (member: TeamMember) => {
    setSelectedMemberId(member.id);
    if (onMemberSelect) {
      onMemberSelect(member.id);
    }
    toast.info(`Selected team member: ${member.name}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  return {
    projects,
    setProjects,
    isProjectModalOpen,
    setIsProjectModalOpen,
    isProjectMemberModalOpen,
    setIsProjectMemberModalOpen,
    isInviteMemberModalOpen,
    setIsInviteMemberModalOpen,
    selectedProjectForMember,
    setSelectedProjectForMember,
    selectedMemberId,
    setSelectedMemberId,
    isAuthenticated,
    setIsAuthenticated,
    handleCreateProject,
    handleAddProjectMember,
    handleCreateProjectMember,
    handleInviteMember,
    handleSendInvite,
    handleMemberSelect,
    handleLogout
  };
};

export default useSidebarState;
