
import React, { useState, useEffect } from 'react';
import TaskColumn from './TaskColumn';
import { Task } from './TaskCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type TaskStatus = 'backlog' | 'in-progress' | 'done';

interface TaskBoardProps {
  projectId: string;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Record<TaskStatus, Task[]>>({
    'backlog': [
      { 
        id: "task-1", 
        title: "Design Landing Page", 
        description: "Create wireframes for the new landing page", 
        assignee: "Alex", 
        priority: "high",
        dueDate: "May 10",
        tags: ["design", "ui"]
      },
      { 
        id: "task-2", 
        title: "Implement User Authentication", 
        description: "Add JWT authentication to the backend", 
        assignee: "Sarah", 
        priority: "medium",
        tags: ["backend", "security"]
      }
    ],
    'in-progress': [
      { 
        id: "task-3", 
        title: "API Documentation", 
        description: "Document all API endpoints using Swagger", 
        assignee: "Mike", 
        priority: "low",
        dueDate: "May 15"
      }
    ],
    'done': [
      { 
        id: "task-4", 
        title: "Database Schema", 
        description: "Design initial database schema for the project", 
        assignee: "Emily", 
        priority: "medium",
        tags: ["database", "architecture"]
      }
    ]
  });

  // Drag and drop state
  const [draggedTask, setDraggedTask] = useState<{
    taskId: string;
    fromColumn: TaskStatus;
  } | null>(null);

  // Task modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
  });
  const [targetColumn, setTargetColumn] = useState<TaskStatus>('backlog');

  const handleDragStart = (e: React.DragEvent, taskId: string, fromColumn: string) => {
    setDraggedTask({
      taskId,
      fromColumn: fromColumn as TaskStatus
    });
  };

  const handleDrop = (e: React.DragEvent, targetColumn: string) => {
    if (!draggedTask) return;
    
    const { taskId, fromColumn } = draggedTask;
    const fromColumnTyped = fromColumn as TaskStatus;
    const targetColumnTyped = targetColumn as TaskStatus;
    
    if (fromColumnTyped === targetColumnTyped) return;
    
    const taskToMove = tasks[fromColumnTyped].find(task => task.id === taskId);
    if (!taskToMove) return;
    
    // Remove from source column
    const updatedSourceColumn = tasks[fromColumnTyped].filter(task => task.id !== taskId);
    
    // Add to target column
    const updatedTargetColumn = [...tasks[targetColumnTyped], taskToMove];
    
    setTasks({
      ...tasks,
      [fromColumnTyped]: updatedSourceColumn,
      [targetColumnTyped]: updatedTargetColumn
    });

    toast(`Task "${taskToMove.title}" moved to ${targetColumn.replace('-', ' ')}`);
  };

  const handleTaskClick = (taskId: string) => {
    toast("Task details would open here in a complete app");
  };

  const handleAddTask = (columnId: TaskStatus) => {
    setTargetColumn(columnId);
    setIsTaskModalOpen(true);
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const taskId = `task-${Date.now()}`;
    const createdTask: Task = {
      id: taskId,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority as Task['priority'] || 'medium',
      assignee: newTask.assignee,
    };

    setTasks({
      ...tasks,
      [targetColumn]: [...tasks[targetColumn], createdTask]
    });

    toast.success(`Task "${createdTask.title}" created`);
    setIsTaskModalOpen(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      assignee: '',
    });
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Board View</h1>
        <p className="text-sm text-muted-foreground">
          Manage tasks by dragging them between columns
        </p>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-6">
        <TaskColumn
          id="backlog"
          title="Backlog"
          tasks={tasks.backlog}
          onAddTask={() => handleAddTask('backlog')}
          onTaskClick={handleTaskClick}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
        />
        
        <TaskColumn
          id="in-progress"
          title="In Progress"
          tasks={tasks['in-progress']}
          onAddTask={() => handleAddTask('in-progress')}
          onTaskClick={handleTaskClick}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
        />
        
        <TaskColumn
          id="done"
          title="Done"
          tasks={tasks.done}
          onAddTask={() => handleAddTask('done')}
          onTaskClick={handleTaskClick}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
        />
      </div>

      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input 
                id="title" 
                value={newTask.title} 
                onChange={e => setNewTask({...newTask, title: e.target.value})}
                placeholder="Task title"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description" 
                value={newTask.description} 
                onChange={e => setNewTask({...newTask, description: e.target.value})}
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="assignee" className="text-sm font-medium">Assignee</label>
                <Input 
                  id="assignee" 
                  value={newTask.assignee} 
                  onChange={e => setNewTask({...newTask, assignee: e.target.value})}
                  placeholder="Assignee name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                <Select 
                  value={newTask.priority as string} 
                  onValueChange={value => setNewTask({...newTask, priority: value as Task['priority']})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskBoard;
