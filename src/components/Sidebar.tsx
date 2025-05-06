
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Users, Folder, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

export type Project = {
  id: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  members?: TeamMember[];
};

export type TeamMember = {
  id: string;
  name: string;
  email?: string;
  role?: string;
};

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
  onCreateProject,
  onCreateTeam 
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
  };

  const handleAddTeamMember = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setSelectedTeamForMember(team);
      setIsTeamMemberModalOpen(true);
    }
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
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-64 h-full bg-sidebar flex flex-col border-r border-border">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold text-primary">Project Pulse</h1>
      </div>
      
      <div className="flex flex-col flex-grow overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-muted-foreground flex items-center">
              <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
              PROJECTS
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5"
              onClick={() => setIsProjectModalOpen(true)}
            >
              <PlusCircle className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          
          <ul className="space-y-1">
            {projects.map(project => (
              <li 
                key={project.id}
                className={cn(
                  "px-2 py-1.5 text-sm rounded-md cursor-pointer",
                  activeProject === project.id ? "bg-primary text-white" : "hover:bg-secondary"
                )}
                onClick={() => onProjectSelect(project.id)}
              >
                {project.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-muted-foreground flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              TEAMS
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5"
              onClick={() => setIsTeamModalOpen(true)}
            >
              <PlusCircle className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          
          <ul className="space-y-1">
            {teams.map(team => (
              <li key={team.id} className="group">
                <div 
                  className={cn(
                    "px-2 py-1.5 text-sm rounded-md cursor-pointer flex justify-between items-center",
                    activeTeam === team.id ? "bg-primary text-white" : "hover:bg-secondary"
                  )}
                >
                  <span 
                    className="flex-grow"
                    onClick={() => onTeamSelect(team.id)}
                  >
                    {team.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity",
                      activeTeam === team.id ? "text-white" : "text-muted-foreground"
                    )}
                    onClick={() => handleAddTeamMember(team.id)}
                  >
                    <PlusCircle className="h-3 w-3" />
                  </Button>
                </div>
                {team.members && team.members.length > 0 && activeTeam === team.id && (
                  <ul className="pl-4 mt-1 space-y-1">
                    {team.members.map(member => (
                      <li 
                        key={member.id}
                        className="flex items-center px-2 py-1 text-xs text-muted-foreground"
                      >
                        <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-xs mr-2">
                          {member.name.charAt(0)}
                        </div>
                        {member.name}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
              {getUserInitials()}
            </div>
            <div className="text-sm">
              <div className="font-medium">{user?.name || 'User'}</div>
              <div className="text-muted-foreground text-xs">{user?.email || 'user@example.com'}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add Project Modal */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="projectName" className="text-sm font-medium">Project Name</label>
              <Input 
                id="projectName" 
                value={newProjectName} 
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProjectModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Team Modal */}
      <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="teamName" className="text-sm font-medium">Team Name</label>
              <Input 
                id="teamName" 
                value={newTeamName} 
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTeamModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTeam}>Create Team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Team Member Modal */}
      <Dialog open={isTeamMemberModalOpen} onOpenChange={setIsTeamMemberModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Add Member to {selectedTeamForMember?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="memberName" className="text-sm font-medium">Name</label>
              <Input 
                id="memberName" 
                value={newTeamMember.name} 
                onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
                placeholder="Enter member name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="memberEmail" className="text-sm font-medium">Email</label>
              <Input 
                id="memberEmail" 
                value={newTeamMember.email} 
                onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})}
                placeholder="Enter member email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="memberRole" className="text-sm font-medium">Role</label>
              <Input 
                id="memberRole" 
                value={newTeamMember.role} 
                onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})}
                placeholder="Enter member role"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTeamMemberModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTeamMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
