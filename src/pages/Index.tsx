
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import TaskBoard from "@/components/TaskBoard";
import { toast } from "sonner";
import { TeamMember } from "@/types/team";
import CreateMemberModal from "@/components/sidebar/CreateMemberModal";
import InviteMemberModal from "@/components/sidebar/InviteMemberModal";
import { Project } from "@/types/project";
import useApi from "@/hooks/useApi";
import { AuthContext } from "@/App";

const Index = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [isProjectMemberModalOpen, setIsProjectMemberModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);
  const [selectedProjectForMember, setSelectedProjectForMember] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const api = useApi();

  // Check authentication status on mount
  useEffect(() => {
    if (!auth?.isAuthenticated) {
      navigate('/login');
    } else {
      // Fetch user data, projects and tasks
      fetchInitialData();
    }
  }, [auth?.isAuthenticated]);

  // Fetch all data after login
  const fetchInitialData = async () => {
    setLoading(true);
    const result = await api.fetchUserData();
    
    if (result.success && result.data) {
      setProjects(result.data.projects || []);
      
      // Set first project as active if available
      if (result.data.projects && result.data.projects.length > 0) {
        setActiveProject(result.data.projects[0].id);
      }
    }
    
    setLoading(false);
  };

  // Load state from localStorage if available
  useEffect(() => {
    const savedProject = localStorage.getItem('activeProject');
    
    if (savedProject) {
      setActiveProject(savedProject);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (activeProject) {
      localStorage.setItem('activeProject', activeProject);
    }
  }, [activeProject]);

  const handleProjectSelect = async (projectId: string) => {
    setActiveProject(projectId);
    // Clear selected member when switching projects
    setSelectedMember(null);
    
    const selectedProject = projects.find(p => p.id === projectId);
    if (selectedProject) {
      toast(`Switched to ${selectedProject.name}`);
    }
  };

  const handleMemberSelect = (memberId: string) => {
    setSelectedMember(memberId === selectedMember ? null : memberId);
  };

  const handleCreateProject = async (name: string, description: string) => {
    if (!name.trim()) return;
    
    const result = await api.createProject(name, description);
    
    if (result.success && result.data) {
      // Refresh projects list
      const projectsResult = await api.fetchProjects();
      if (projectsResult.success && projectsResult.data) {
        setProjects(projectsResult.data);
        setActiveProject(result.data.id);
      }
    }
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

  const handleCreateProjectMember = async (name: string, email: string, role: string) => {
    if (!selectedProjectForMember) return;

    // For this endpoint, we're only using email since the user must already exist
    const result = await api.addProjectMember(selectedProjectForMember.id, email, role);
    
    if (result.success) {
      // Refresh projects to get updated members
      const projectsResult = await api.fetchProjects();
      if (projectsResult.success && projectsResult.data) {
        setProjects(projectsResult.data);
      }
      
      setIsProjectMemberModalOpen(false);
      toast.success(`${email} added to ${selectedProjectForMember.name}`);
    }
  };

  const handleSendInvite = (email: string) => {
    if (!selectedProjectForMember) return;
    
    // In a real app, this would send an invitation email
    toast.success(`Invitation sent to ${email}`);
    setIsInviteMemberModalOpen(false);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        activeProject={activeProject}
        onProjectSelect={handleProjectSelect}
        onCreateProject={handleCreateProject}
        onMemberSelect={handleMemberSelect}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TaskBoard 
          projectId={activeProject || ''}
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
