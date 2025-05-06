
import { TeamMember } from '@/types/team';

const useTeamMembers = (
  projectId: string, 
  getProjectMembers: () => TeamMember[]
) => {
  // Add getTeamMembers as an alias for getProjectMembers for backwards compatibility
  const getTeamMembers = getProjectMembers;

  const handleAddProjectMember = () => {
    // This function will be implemented in the parent component
    return projectId;
  };

  return {
    getTeamMembers,
    handleAddProjectMember
  };
};

export default useTeamMembers;
