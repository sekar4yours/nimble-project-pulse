import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import TaskBoard from "@/components/TaskBoard";
import { toast } from "sonner";
import { TeamMember } from "@/types/team";
import CreateMemberModal from "@/components/sidebar/CreateMemberModal";
import InviteMemberModal from "@/components/sidebar/InviteMemberModal";
import { Project } from "@/types/project";
import { apiService } from "@/hooks/useApi";

const Index = () => {
  const [activeProject, setActiveProject] = useState<string>("project-1");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [isProjectMemberModalOpen, setIsProjectMemberModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);
  const [selectedProjectForMember, setSelectedProjectForMember] = useState<Project | null>(null);
  const navigate = useNavigate();
  
  // Sample projects - to be replaced with API data
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication status on mount and fetch projects if authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const authStatus = localStorage.getItem('isAuthenticated');
      
      if (token && authStatus === 'true') {
        setIsAuthenticated(true);
        try {
          // Verify token is still valid
          const userData = await apiService.getCurrentUser();
          if (!userData) {
            handleLogout();
            return;
          }
          
          // Fetch projects
          await fetchProjects();
        } catch (error) {
          console.error("Authentication check failed:", error);
          handleLogout();
        }
      } else {
        setIsLoading(false);
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getProjects();
      if (response && response.data) {
        setProjects(response.data);
        
        // If no active project is set or the active project doesn't exist anymore
        if (response.data.length > 0) {
          const savedProject = localStorage.getItem('activeProject');
          const projectExists = response.data.some(p => p.id === savedProject);
          
          if (!savedProject || !projectExists) {
            setActiveProject(response.data[0].id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleProjectSelect = (projectId: string) => {
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

  const handleCreateProject = (name: string, description: string) => {
    if (!name.trim()) return;
    
    const newProjectData: Project = {
      id: `project-${Date.now()}`,
      name: name,
      description: description,
      members: []
    };
    
    setProjects([...projects, newProjectData]);
    setActiveProject(newProjectData.id);
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        activeProject={activeProject}
        onProjectSelect={handleProjectSelect}
        onCreateProject={handleCreateProject}
        onMemberSelect={handleMemberSelect}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
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
