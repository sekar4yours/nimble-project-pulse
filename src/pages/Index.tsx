
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Sample projects as fallback - this would be fetched from API
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

  // Check authentication status and fetch projects on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('auth_token');
        const authenticated = !!token;
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          try {
            // Fetch user data to verify token is still valid
            const userData = await apiService.getCurrentUser();
            if (!userData) {
              // If getCurrentUser returns null, token is invalid
              setIsAuthenticated(false);
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user');
              return;
            }
            
            // Try to fetch projects from API
            try {
              const projectsData = await apiService.getProjects();
              if (projectsData && projectsData.data) {
                setProjects(projectsData.data);
                // Set first project as active if we have projects
                if (projectsData.data.length > 0) {
                  setActiveProject(projectsData.data[0].id);
                }
              }
            } catch (projectError) {
              console.error("Failed to fetch projects:", projectError);
              toast.error("Failed to load projects. Using sample data.");
            }
          } catch (error) {
            console.error("Auth validation failed:", error);
            setIsAuthenticated(false);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
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
    
    try {
      // Create project via API
      const response = await apiService.createProject({ name, description });
      
      const newProjectData: Project = response.data || {
        id: `project-${Date.now()}`,
        name: name,
        description: description,
        members: []
      };
      
      setProjects([...projects, newProjectData]);
      setActiveProject(newProjectData.id);
      toast.success(`Project "${name}" created successfully`);
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project. Please try again.");
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

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  // Get the current project
  const activeProjectData = projects.find(p => p.id === activeProject) || null;
  const teamMembers = activeProjectData?.members || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
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
