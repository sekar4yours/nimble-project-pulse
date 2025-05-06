
import { TaskWithComments, TaskStatus } from '@/types/task';
import { toast } from 'sonner';

export const useTaskOperations = (
  tasks: Record<TaskStatus, TaskWithComments[]>,
  setTasks: React.Dispatch<React.SetStateAction<Record<TaskStatus, TaskWithComments[]>>>
) => {
  const handleCreateTask = (newTask: Partial<TaskWithComments>, targetColumn: TaskStatus) => {
    if (!newTask.title || !newTask.description) {
      toast.error("Please fill in all required fields");
      return false;
    }

    const taskId = `task-${Date.now()}`;
    const createdTask: TaskWithComments = {
      id: taskId,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority as TaskWithComments['priority'] || 'medium',
      assignee: newTask.assignee,
      projectId: newTask.projectId,
      createdBy: 'John Doe',
      comments: []
    };

    setTasks({
      ...tasks,
      [targetColumn]: [...tasks[targetColumn], createdTask]
    });

    toast.success(`Task "${createdTask.title}" created`);
    return true;
  };

  const handleUpdateTask = (selectedTask: TaskWithComments | null) => {
    if (!selectedTask) return false;
    
    const { id } = selectedTask;
    const columnId = Object.keys(tasks).find(column => 
      tasks[column as TaskStatus].some(task => task.id === id)
    ) as TaskStatus;
    
    if (!columnId) return false;
    
    const updatedTasks = tasks[columnId].map(task => 
      task.id === id ? selectedTask : task
    );
    
    setTasks({
      ...tasks,
      [columnId]: updatedTasks
    });
    
    toast.success(`Task "${selectedTask.title}" updated`);
    return true;
  };

  const handleAddComment = (selectedTask: TaskWithComments | null, newComment: string) => {
    if (!selectedTask || !newComment.trim()) return false;
    
    const comment = {
      id: `comment-${Date.now()}`,
      author: 'John Doe',
      text: newComment,
      createdAt: new Date().toISOString()
    };
    
    // Find which column the task is in
    const columnId = Object.keys(tasks).find(column => 
      tasks[column as TaskStatus].some(task => task.id === selectedTask.id)
    ) as TaskStatus;
    
    if (!columnId) return false;
    
    // Create updated task with new comment
    const updatedTask = {
      ...selectedTask,
      comments: [...(selectedTask.comments || []), comment]
    };
    
    // Update tasks state
    const updatedTasks = tasks[columnId].map(task => 
      task.id === selectedTask.id ? updatedTask : task
    );
    
    setTasks({
      ...tasks,
      [columnId]: updatedTasks
    });
    
    toast.success('Comment added');
    return updatedTask;
  };

  return {
    handleCreateTask,
    handleUpdateTask,
    handleAddComment,
  };
};
