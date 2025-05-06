
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import TaskBoard from "@/components/TaskBoard";
import { toast } from "sonner";

const Index = () => {
  const [activeProject, setActiveProject] = useState<string>("project-1");
  const [activeTeam, setActiveTeam] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  // Load state from localStorage if available
  useEffect(() => {
    const savedProject = localStorage.getItem('activeProject');
    const savedTeam = localStorage.getItem('activeTeam');
    
    if (savedProject) {
      setActiveProject(savedProject);
    }
    
    if (savedTeam) {
      setActiveTeam(savedTeam);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeProject', activeProject);
    if (activeTeam) {
      localStorage.setItem('activeTeam', activeTeam);
    }
  }, [activeProject, activeTeam]);

  const handleProjectSelect = (projectId: string) => {
    setActiveProject(projectId);
    toast(`Switched to ${projectId === "project-1" ? "Marketing Campaign" : 
           projectId === "project-2" ? "Website Redesign" : "Mobile App Development"}`);
  };

  const handleTeamSelect = (teamId: string) => {
    // Toggle team selection if clicking the same team
    if (activeTeam === teamId) {
      setActiveTeam(null);
      toast("Cleared team filter");
    } else {
      setActiveTeam(teamId);
      toast(`Filtered by ${teamId === "team-1" ? "Design Team" : 
             teamId === "team-2" ? "Development Team" : "Marketing Team"}`);
    }
  };

  const handleCreateProject = () => {
    // Now handled within the Sidebar component
  };

  const handleCreateTeam = () => {
    // Now handled within the Sidebar component
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        activeProject={activeProject}
        activeTeam={activeTeam}
        onProjectSelect={handleProjectSelect}
        onTeamSelect={handleTeamSelect}
        onCreateProject={handleCreateProject}
        onCreateTeam={handleCreateTeam}
      />
      <TaskBoard 
        projectId={activeProject} 
        teamId={activeTeam}
      />
    </div>
  );
};

export default Index;
