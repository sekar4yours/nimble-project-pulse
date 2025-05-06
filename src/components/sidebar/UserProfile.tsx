
import React from 'react';
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfileProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
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
          onClick={onLogout}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
