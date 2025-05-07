import { useState } from 'react';

// Base API URL - change this to your PHP backend URL
const API_BASE_URL = '/api';  // This will point to your PHP backend

interface ApiOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: HeadersInit;
}

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  fetchData: () => Promise<void>;
  mutate: (body?: any) => Promise<void>;
}

export function useApi<T>(options: ApiOptions): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${API_BASE_URL}/${options.endpoint.replace(/^\//, '')}`;
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...(options.body && { body: JSON.stringify(options.body) }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result.data || result);
    } catch (err) {
      setError(err as Error);
      console.error('API request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const mutate = async (body?: any) => {
    const mutateOptions = { ...options };
    if (body) {
      mutateOptions.body = body;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const url = `${API_BASE_URL}/${options.endpoint.replace(/^\//, '')}`;
      const response = await fetch(url, {
        method: options.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(body || options.body),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result.data || result);
    } catch (err) {
      setError(err as Error);
      console.error('API mutation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData, mutate };
}

// Helper functions for common API operations with basic PHP backend
export const apiService = {
  // Authentication
  register: async (data: { name: string, email: string, password: string, password_confirmation: string }) => {
    const response = await fetch(`${API_BASE_URL}/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },

  login: async (data: { email: string, password: string }) => {
    const response = await fetch(`${API_BASE_URL}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const result = await response.json();
    
    // Store user data in localStorage
    if (result.user && result.token) {
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('isAuthenticated', 'true');
    }
    
    return result;
  },

  logout: async () => {
    const token = localStorage.getItem('auth_token');
    
    // Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    
    // Optionally inform the server about logout
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/logout.php`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
    
    return { success: true };
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/forgot-password.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send password reset email');
    }
    
    return response.json();
  },

  resetPassword: async (data: { token: string, email: string, password: string, password_confirmation: string }) => {
    const response = await fetch(`${API_BASE_URL}/reset-password.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }
    
    return response.json();
  },

  updatePassword: async (data: { current_password: string, password: string, password_confirmation: string }) => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/update-password.php`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password update failed');
    }
    return response.json();
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/user.php`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to get user data');
      return response.json();
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      return null;
    }
  },
  
  // Projects
  getProjects: async () => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/projects.php`, {
      headers: { 
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },
  
  getProject: async (id: string) => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/project.php?id=${id}`, {
      headers: { 
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  },
  
  createProject: async (data: any) => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/project-create.php`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },
  
  // Members
  getMembers: async () => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/members.php`, {
      headers: { 
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch members');
    return response.json();
  },
  
  addProjectMember: async (projectId: string, memberId: string, role?: string) => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/add-project-member.php`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ project_id: projectId, member_id: memberId, role })
    });
    
    if (!response.ok) throw new Error('Failed to add member to project');
    return response.json();
  },
  
  // Tasks
  getProjectTasks: async (projectId: string) => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/project-tasks.php?project_id=${projectId}`, {
      headers: { 
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch project tasks');
    return response.json();
  },
  
  createTask: async (data: any) => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/create-task.php`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },
  
  updateTask: async (id: string, data: any) => {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/update-task.php?id=${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  }
};

// Add authorization header to all requests if token exists
export const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
