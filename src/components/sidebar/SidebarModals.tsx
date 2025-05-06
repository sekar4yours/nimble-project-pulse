
import React from 'react';
import { Project } from '@/types/project';
import CreateProjectModal from './CreateProjectModal';
import CreateMemberModal from './CreateMemberModal';
import InviteMemberModal from './InviteMemberModal';

interface SidebarModalsProps {
  isProjectModalOpen: boolean;
  setIsProjectModalOpen: (isOpen: boolean) => void;
  isProjectMemberModalOpen: boolean;
  setIsProjectMemberModalOpen: (isOpen: boolean) => void;
  isInviteMemberModalOpen: boolean;
  setIsInviteMemberModalOpen: (isOpen: boolean) => void;
  selectedProjectForMember: Project | null;
  onCreateProject: (name: string, description: string) => void;
  onCreateMember: (name: string, email: string, role: string) => void;
  onSendInvite: (email: string) => void;
}

const SidebarModals: React.FC<SidebarModalsProps> = ({
  isProjectModalOpen,
  setIsProjectModalOpen,
  isProjectMemberModalOpen,
  setIsProjectMemberModalOpen,
  isInviteMemberModalOpen,
  setIsInviteMemberModalOpen,
  selectedProjectForMember,
  onCreateProject,
  onCreateMember,
  onSendInvite
}) => {
  return (
    <>
      <CreateProjectModal 
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onCreateProject={onCreateProject}
      />

      <CreateMemberModal 
        isOpen={isProjectMemberModalOpen}
        onClose={() => setIsProjectMemberModalOpen(false)}
        selectedProject={selectedProjectForMember}
        onCreateMember={onCreateMember}
      />

      <InviteMemberModal
        isOpen={isInviteMemberModalOpen}
        onClose={() => setIsInviteMemberModalOpen(false)}
        selectedProject={selectedProjectForMember}
        onSendInvite={onSendInvite}
      />
    </>
  );
};

export default SidebarModals;
