
import { useState } from 'react';
import { toast } from 'sonner';

// The base URL for our PHP API
const API_BASE_URL = 'http://localhost/api'; // Change this to your PHP server URL

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/user_data.php`, {
        headers: getAuthHeaders()
      });
      
      const data: ApiResponse<any> = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch user data');
      }
      
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch user data');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/projects.php`, {
        headers: getAuthHeaders()
      });
      
      const data: ApiResponse<any> = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch projects');
      }
      
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch projects');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (name: string, description: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/projects.php`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, description })
      });
      
      const data: ApiResponse<any> = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create project');
      }
      
      toast.success('Project created successfully');
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create project');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const addProjectMember = async (projectId: string, email: string, role: string = 'member') => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/projects.php?action=add_member`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ project_id: projectId, email, role })
      });
      
      const data: ApiResponse<any> = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to add member');
      }
      
      toast.success('Member added successfully');
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add member');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (projectId: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/tasks.php?project_id=${projectId}`, {
        headers: getAuthHeaders()
      });
      
      const data: ApiResponse<any> = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch tasks');
      }
      
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch tasks');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskDetails = async (taskId: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/tasks.php?task_id=${taskId}`, {
        headers: getAuthHeaders()
      });
      
      const data: ApiResponse<any> = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch task details');
      }
      
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error fetching task details:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch task details');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const addTaskComment = async (taskId: string, content: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/tasks.php?action=add_comment`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ task_id: taskId, content })
      });
      
      const data: ApiResponse<any> = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to add comment');
      }
      
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add comment');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchUserData,
    fetchProjects,
    createProject,
    addProjectMember,
    fetchTasks,
    fetchTaskDetails,
    addTaskComment
  };
};

export default useApi;
