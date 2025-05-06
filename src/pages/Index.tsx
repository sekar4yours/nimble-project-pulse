
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TaskBoard from "@/components/TaskBoard";
import { toast } from "sonner";

const Index = () => {
  const [activeProject, setActiveProject] = useState<string>("project-1");

  const handleProjectSelect = (projectId: string) => {
    setActiveProject(projectId);
    toast(`Switched to ${projectId === "project-1" ? "Marketing Campaign" : 
           projectId === "project-2" ? "Website Redesign" : "Mobile App Development"}`);
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
        onProjectSelect={handleProjectSelect}
        onCreateProject={handleCreateProject}
        onCreateTeam={handleCreateTeam}
      />
      <TaskBoard projectId={activeProject} />
    </div>
  );
};

export default Index;
