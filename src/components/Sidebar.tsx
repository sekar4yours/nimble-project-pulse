
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ProjectList from './sidebar/ProjectList';
import TeamList from './sidebar/TeamList';
import UserProfile from './sidebar/UserProfile';
import ProjectModal from './sidebar/modals/ProjectModal';
import TeamModal from './sidebar/modals/TeamModal';
import TeamMemberModal from './sidebar/modals/TeamMemberModal';
import { Project, Team, TeamMember } from '@/types/sidebar';

interface SidebarProps {
  activeProject: string | null;
  activeTeam: string | null;
  onProjectSelect: (projectId: string) => void;
  onTeamSelect: (teamId: string) => void;
  onCreateProject: () => void;
  onCreateTeam: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeProject, 
  activeTeam,
  onProjectSelect,
  onTeamSelect,
  onCreateProject: externalOnCreateProject,
  onCreateTeam: externalOnCreateTeam
}) => {
  // Sample data - in a real app, this would come from API
  const [projects, setProjects] = useState<Project[]>([
    { id: "project-1", name: "Marketing Campaign" },
    { id: "project-2", name: "Website Redesign" },
    { id: "project-3", name: "Mobile App Development" }
  ]);
  
  const [teams, setTeams] = useState<Team[]>([
    { 
      id: "team-1", 
      name: "Design Team",
      members: [
        { id: "user-1", name: "Alex" },
        { id: "user-2", name: "Sarah" }
      ]
    },
    { 
      id: "team-2", 
      name: "Development Team",
      members: [
        { id: "user-3", name: "Mike" },
        { id: "user-4", name: "Emily" }
      ]
    },
    { 
      id: "team-3", 
      name: "Marketing Team",
      members: [
        { id: "user-2", name: "Sarah" },
        { id: "user-5", name: "David" }
      ]
    }
  ]);

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isTeamMemberModalOpen, setIsTeamMemberModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedTeamForMember, setSelectedTeamForMember] = useState<Team | null>(null);
  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    email: "",
    role: ""
  });
  
  // User state
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();
  
  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: newProjectName
    };
    
    setProjects([...projects, newProject]);
    setNewProjectName("");
    setIsProjectModalOpen(false);
    onProjectSelect(newProject.id);
    toast.success(`Project "${newProject.name}" created`);
    
    // Call the external handler if provided
    if (externalOnCreateProject) {
      externalOnCreateProject();
    }
  };

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;
    
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      members: []
    };
    
    setTeams([...teams, newTeam]);
    setNewTeamName("");
    setIsTeamModalOpen(false);
    toast.success(`Team "${newTeam.name}" created`);
    
    // Call the external handler if provided
    if (externalOnCreateTeam) {
      externalOnCreateTeam();
    }
  };

  const handleAddTeamMember = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setSelectedTeamForMember(team);
      setIsTeamMemberModalOpen(true);
    }
  };

  const handleTeamMemberChange = (field: keyof TeamMember, value: string) => {
    setNewTeamMember({
      ...newTeamMember,
      [field]: value
    });
  };

  const handleCreateTeamMember = () => {
    if (!selectedTeamForMember || !newTeamMember.name.trim()) return;

    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: newTeamMember.name,
      email: newTeamMember.email,
      role: newTeamMember.role
    };

    const updatedTeams = teams.map(team => {
      if (team.id === selectedTeamForMember.id) {
        return {
          ...team,
          members: [...(team.members || []), newMember]
        };
      }
      return team;
    });

    setTeams(updatedTeams);
    setNewTeamMember({ name: "", email: "", role: "" });
    setIsTeamMemberModalOpen(false);
    toast.success(`${newMember.name} added to ${selectedTeamForMember.name}`);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('activeProject');
    localStorage.removeItem('activeTeam');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="w-64 h-full bg-sidebar flex flex-col border-r border-border">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold text-primary">Project Pulse</h1>
      </div>
      
      <div className="flex flex-col flex-grow overflow-y-auto">
        <ProjectList 
          projects={projects}
          activeProject={activeProject}
          onProjectSelect={onProjectSelect}
          onOpenProjectModal={() => setIsProjectModalOpen(true)}
        />
        
        <TeamList 
          teams={teams}
          activeTeam={activeTeam}
          onTeamSelect={onTeamSelect}
          onOpenTeamModal={() => setIsTeamModalOpen(true)}
          onAddTeamMember={handleAddTeamMember}
        />
      </div>
      
      <UserProfile 
        user={user}
        onLogout={handleLogout}
      />

      {/* Modals */}
      <ProjectModal 
        isOpen={isProjectModalOpen}
        onOpenChange={setIsProjectModalOpen}
        projectName={newProjectName}
        onProjectNameChange={(e) => setNewProjectName(e.target.value)}
        onCreateProject={handleCreateProject}
      />

      <TeamModal 
        isOpen={isTeamModalOpen}
        onOpenChange={setIsTeamModalOpen}
        teamName={newTeamName}
        onTeamNameChange={(e) => setNewTeamName(e.target.value)}
        onCreateTeam={handleCreateTeam}
      />

      <TeamMemberModal 
        isOpen={isTeamMemberModalOpen}
        onOpenChange={setIsTeamMemberModalOpen}
        selectedTeam={selectedTeamForMember}
        teamMember={newTeamMember}
        onTeamMemberChange={handleTeamMemberChange}
        onCreateTeamMember={handleCreateTeamMember}
      />
    </div>
  );
};

export default Sidebar;
