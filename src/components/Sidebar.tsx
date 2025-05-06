
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronDown, 
  ChevronRight, 
  PlusCircle, 
  Users, 
  User, 
  Settings, 
  LogOut,
  FolderKanban
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project";
import { TeamMember } from "@/types/team";

interface SidebarProps {
  activeProject: string | null;
  onProjectSelect: (projectId: string) => void;
  onCreateProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeProject,
  onProjectSelect,
  onCreateProject
}) => {
  // Sample data - in a real app, this would come from API
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

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProjectMemberModalOpen, setIsProjectMemberModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: ""
  });
  const [selectedProjectForMember, setSelectedProjectForMember] = useState<Project | null>(null);
  const [newProjectMember, setNewProjectMember] = useState({
    name: "",
    email: "",
    role: ""
  });

  // Add isAuthenticated state (for demo purposes)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check localStorage for authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return;
    
    const newProjectData: Project = {
      id: `project-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      members: []
    };
    
    setProjects([...projects, newProjectData]);
    setNewProject({ name: "", description: "" });
    setIsProjectModalOpen(false);
    onProjectSelect(newProjectData.id);
    toast.success(`Project "${newProjectData.name}" created`);
  };

  const handleAddProjectMember = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProjectForMember(project);
      setIsProjectMemberModalOpen(true);
    }
  };

  const handleCreateProjectMember = () => {
    if (!selectedProjectForMember || !newProjectMember.name.trim()) return;

    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: newProjectMember.name,
      email: newProjectMember.email,
      role: newProjectMember.role
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
    setNewProjectMember({ name: "", email: "", role: "" });
    setIsProjectMemberModalOpen(false);
    toast.success(`${newMember.name} added to ${selectedProjectForMember.name}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // Get the currently selected project's details
  const activeProjectData = activeProject 
    ? projects.find(p => p.id === activeProject) 
    : null;

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold text-sidebar-foreground flex items-center gap-2">
          <FolderKanban className="h-5 w-5" /> Project Pulse
        </h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Projects Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-muted-foreground flex items-center">
                <FolderKanban className="mr-2 h-4 w-4 text-muted-foreground" />
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
                  <div className="flex justify-between items-center">
                    <span className="flex-grow truncate">{project.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity",
                        activeProject === project.id ? "text-white" : "text-muted-foreground"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddProjectMember(project.id);
                      }}
                    >
                      <PlusCircle className="h-3 w-3" />
                    </Button>
                  </div>
                  {project.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {project.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Project Members Section - Only visible when a project is selected */}
          {activeProjectData && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-muted-foreground flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  PROJECT MEMBERS
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5"
                  onClick={() => handleAddProjectMember(activeProjectData.id)}
                >
                  <PlusCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
              
              <ul className="space-y-1 pl-4">
                {activeProjectData.members && activeProjectData.members.length > 0 ? (
                  activeProjectData.members.map(member => (
                    <li 
                      key={member.id}
                      className="flex items-center px-2 py-1 text-xs text-muted-foreground"
                    >
                      <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-xs mr-2">
                        {member.name.charAt(0)}
                      </div>
                      {member.name}
                      {member.role && (
                        <span className="ml-1 text-xs text-muted-foreground">({member.role})</span>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-muted-foreground">No members yet</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        {isAuthenticated ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Demo User</p>
                <p className="text-xs text-gray-500">demo@example.com</p>
              </div>
            </div>
            <div className="flex">
              <Button variant="ghost" size="icon" title="Settings">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Logout" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link to="/login">
              <Button variant="default" className="w-full">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" className="w-full">Sign Up</Button>
            </Link>
          </div>
        )}
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
                value={newProject.name} 
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="projectDescription" className="text-sm font-medium">Project Description (Optional)</label>
              <Textarea 
                id="projectDescription" 
                value={newProject.description} 
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                placeholder="Enter project description"
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProjectModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Project Member Modal */}
      <Dialog open={isProjectMemberModalOpen} onOpenChange={setIsProjectMemberModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Add Member to {selectedProjectForMember?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="memberName" className="text-sm font-medium">Name</label>
              <Input 
                id="memberName" 
                value={newProjectMember.name} 
                onChange={(e) => setNewProjectMember({...newProjectMember, name: e.target.value})}
                placeholder="Enter member name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="memberEmail" className="text-sm font-medium">Email</label>
              <Input 
                id="memberEmail" 
                value={newProjectMember.email} 
                onChange={(e) => setNewProjectMember({...newProjectMember, email: e.target.value})}
                placeholder="Enter member email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="memberRole" className="text-sm font-medium">Role</label>
              <Input 
                id="memberRole" 
                value={newProjectMember.role} 
                onChange={(e) => setNewProjectMember({...newProjectMember, role: e.target.value})}
                placeholder="Enter member role"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProjectMemberModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProjectMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
