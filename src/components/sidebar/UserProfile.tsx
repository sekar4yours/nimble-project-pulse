
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";
import { apiService } from "@/hooks/useApi";

interface UserProfileProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

interface UserData {
  name: string;
  email: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  isAuthenticated,
  onLogout
}) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Try to get user data from localStorage first
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing stored user data", error);
        }
      }
      
      // Fetch current user data from API
      const fetchUserData = async () => {
        try {
          const response = await apiService.getCurrentUser();
          if (response && response.data) {
            setUserData(response.data);
            // Update stored user data
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      };
      
      fetchUserData();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
          <p className="text-sm font-medium">{userData?.name || 'Loading...'}</p>
          <p className="text-xs text-gray-500">{userData?.email || 'Loading...'}</p>
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
  );
};

export default UserProfile;
