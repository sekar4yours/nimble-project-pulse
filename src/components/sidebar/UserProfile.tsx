
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";

interface UserProfileProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  isAuthenticated,
  onLogout
}) => {
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-2">
        <Link to="/login">
          <Button variant="default" className="w-full">Login</Button>
        </Link>
        <Link to="/signup">
          <Button variant="outline" className="w-full">Sign Up</Button>
        </Link>
      </div>
    );
  }

  return (
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
        <Button variant="ghost" size="icon" title="Logout" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
