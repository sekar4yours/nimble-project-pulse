
import { useState } from 'react';

// Base API URL - change this to the deployed API URL in production
const API_BASE_URL = 'http://localhost:8000/api/v1';

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

// Helper functions for common API operations
export const apiService = {
  // Projects
  getProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },
  
  getProject: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  },
  
  createProject: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
  },
  
  // Members
  getMembers: async () => {
    const response = await fetch(`${API_BASE_URL}/members`);
    if (!response.ok) throw new Error('Failed to fetch members');
    return response.json();
  },
  
  addProjectMember: async (projectId: string, memberId: string, role?: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_id: memberId, role })
    });
    if (!response.ok) throw new Error('Failed to add member to project');
    return response.json();
  },
  
  // Tasks
  getProjectTasks: async (projectId: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch project tasks');
    return response.json();
  },
  
  createTask: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },
  
  updateTask: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  }
};
