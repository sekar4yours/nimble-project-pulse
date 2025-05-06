
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import TaskBoard from "@/components/TaskBoard";
import { toast } from "sonner";

const Index = () => {
  const [activeProject, setActiveProject] = useState<string>("project-1");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const navigate = useNavigate();

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
    setSelectedMember(memberId);
  };

  const handleCreateProject = () => {
    // Now handled within the Sidebar component
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        activeProject={activeProject}
        onProjectSelect={handleProjectSelect}
        onCreateProject={handleCreateProject}
        onMemberSelect={handleMemberSelect}
      />
      <TaskBoard 
        projectId={activeProject}
        teamId={null} // We no longer use teamId
        selectedMember={selectedMember}
      />
    </div>
  );
};

export default Index;
