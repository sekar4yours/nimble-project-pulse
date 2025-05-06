
import React from 'react';
import { PlusCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Team } from '@/types/sidebar';

interface TeamListProps {
  teams: Team[];
  activeTeam: string | null;
  onTeamSelect: (teamId: string) => void;
  onOpenTeamModal: () => void;
  onAddTeamMember: (teamId: string) => void;
}

const TeamList: React.FC<TeamListProps> = ({ 
  teams, 
  activeTeam, 
  onTeamSelect,
  onOpenTeamModal,
  onAddTeamMember
}) => {
  return (
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
          onClick={onOpenTeamModal}
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
                onClick={() => onAddTeamMember(team.id)}
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
  );
};

export default TeamList;
