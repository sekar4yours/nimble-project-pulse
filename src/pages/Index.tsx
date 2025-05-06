
import { useState, useEffect } from "react";
import Sidebar, { Project, Team } from "@/components/Sidebar";
import TaskBoard from "@/components/TaskBoard";
import { toast } from "sonner";
import AuthForms from "@/components/AuthForms";

const Index = () => {
  const [activeProject, setActiveProject] = useState<string>("project-1");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [projects, setProjects] = useState<Project[]>([
    { id: "project-1", name: "Marketing Campaign" },
    { id: "project-2", name: "Website Redesign" },
    { id: "project-3", name: "Mobile App Development" }
  ]);
  
  const [teams, setTeams] = useState<Team[]>([
    { id: "team-1", name: "Alex Smith", email: "alex@example.com", initials: "AS" },
    { id: "team-2", name: "Sarah Johnson", email: "sarah@example.com", initials: "SJ" },
    { id: "team-3", name: "Mike Davis", email: "mike@example.com", initials: "MD" }
  ]);

  // Check authentication status on load
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthModalOpen(true);
    }
    
    // Load saved projects and teams
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  // Save projects and teams to localStorage when they change
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);
  
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  const handleProjectSelect = (projectId: string) => {
    setActiveProject(projectId);
    const selectedProject = projects.find(p => p.id === projectId);
    if (selectedProject) {
      toast(`Switched to ${selectedProject.name}`);
    }
  };

  const handleAddProject = (newProject: Project) => {
    setProjects([...projects, newProject]);
  };

  const handleAddTeamMember = (newTeam: Team) => {
    setTeams([...teams, newTeam]);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsAuthModalOpen(true);
    toast.info("Logged out successfully");
  };

  if (!isAuthenticated) {
    return (
      <AuthForms 
        isOpen={isAuthModalOpen} 
        onClose={() => {}} // Prevent closing if not authenticated
        initialMode="login"
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        activeProject={activeProject}
        onProjectSelect={handleProjectSelect}
        onCreateProject={() => {}}
        onCreateTeam={() => {}}
        teams={teams}
        projects={projects}
        onAddTeamMember={handleAddTeamMember}
        onAddProject={handleAddProject}
        onLogout={handleLogout}
      />
      <TaskBoard 
        projectId={activeProject} 
        teams={teams}
      />
    </div>
  );
};

export default Index;
