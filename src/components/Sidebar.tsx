
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderKanban } from "lucide-react";
import { Project } from "@/types/project";

// Import our components
import ProjectList from "./sidebar/ProjectList";
import ProjectMembersList from "./sidebar/ProjectMembersList";
import UserProfile from "./sidebar/UserProfile";
import SidebarModals from "./sidebar/SidebarModals";
import useSidebarState from "@/hooks/useSidebarState";

interface SidebarProps {
  activeProject: string | null;
  onProjectSelect: (projectId: string) => void;
  onCreateProject: (name: string, description: string) => void;
  onMemberSelect?: (memberId: string) => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeProject,
  onProjectSelect,
  onCreateProject,
  onMemberSelect,
  isAuthenticated,
  onLogout
}) => {
  const {
    projects,
    isProjectModalOpen,
    setIsProjectModalOpen,
    isProjectMemberModalOpen,
    setIsProjectMemberModalOpen,
    isInviteMemberModalOpen,
    setIsInviteMemberModalOpen,
    selectedProjectForMember,
    selectedMemberId,
    isAuthenticated: stateIsAuthenticated,
    handleCreateProject,
    handleAddProjectMember,
    handleCreateProjectMember,
    handleInviteMember,
    handleSendInvite,
    handleMemberSelect,
    handleLogout: stateHandleLogout
  } = useSidebarState(activeProject, onProjectSelect, onMemberSelect);

  // Get the currently selected project's details
  const activeProjectData = activeProject 
    ? projects.find(p => p.id === activeProject) 
    : null;

  const handleAddProject = () => {
    setIsProjectModalOpen(true);
  };

  // Use props if provided, otherwise use from state
  const effectiveIsAuthenticated = isAuthenticated !== undefined ? isAuthenticated : stateIsAuthenticated;
  const effectiveOnLogout = onLogout || stateHandleLogout;

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
          
          {effectiveIsAuthenticated && (
            <ProjectMembersList 
              activeProject={activeProjectData}
              onAddMember={handleInviteMember}
              onSelectMember={handleMemberSelect}
              selectedMember={selectedMemberId}
            />
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <UserProfile 
          isAuthenticated={effectiveIsAuthenticated}
          onLogout={effectiveOnLogout}
        />
      </div>

      {/* Modals */}
      <SidebarModals 
        isProjectModalOpen={isProjectModalOpen}
        setIsProjectModalOpen={setIsProjectModalOpen}
        isProjectMemberModalOpen={isProjectMemberModalOpen}
        setIsProjectMemberModalOpen={setIsProjectMemberModalOpen}
        isInviteMemberModalOpen={isInviteMemberModalOpen}
        setIsInviteMemberModalOpen={setIsInviteMemberModalOpen}
        selectedProjectForMember={selectedProjectForMember}
        onCreateProject={onCreateProject}
        onCreateMember={handleCreateProjectMember}
        onSendInvite={handleSendInvite}
      />
    </div>
  );
};

export default Sidebar;
