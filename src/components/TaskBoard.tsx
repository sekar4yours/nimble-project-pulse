
import React, { useState, useEffect } from 'react';
import TaskColumn from './TaskColumn';
import { Task } from './TaskCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Team } from './Sidebar';

type TaskStatus = 'backlog' | 'in-progress' | 'done';

interface TaskBoardProps {
  projectId: string;
  teams: Team[];
}

const TaskBoard: React.FC<TaskBoardProps> = ({ projectId, teams }) => {
  const [tasks, setTasks] = useState<Record<TaskStatus, Task[]>>({
    'backlog': [
      { 
        id: "task-1", 
        title: "Design Landing Page", 
        description: "Create wireframes for the new landing page", 
        assignee: "Alex", 
        assigneeInitials: "A",
        priority: "high",
        dueDate: "May 10",
        tags: ["design", "ui"]
      },
      { 
        id: "task-2", 
        title: "Implement User Authentication", 
        description: "Add JWT authentication to the backend", 
        assignee: "Sarah", 
        assigneeInitials: "S",
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
        assigneeInitials: "M",
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
        assigneeInitials: "E",
        priority: "medium",
        tags: ["database", "architecture"]
      }
    ]
  });

  // Task modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    assigneeId: '',
    assigneeInitials: '',
  });
  const [targetColumn, setTargetColumn] = useState<TaskStatus>('backlog');

  // Load tasks from localStorage when project changes
  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks-${projectId}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [projectId]);

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem(`tasks-${projectId}`, JSON.stringify(tasks));
  }, [tasks, projectId]);

  const handleDragStart = (e: React.DragEvent, taskId: string, fromColumn: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('fromColumn', fromColumn);
  };

  const handleDrop = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const fromColumn = e.dataTransfer.getData('fromColumn') as TaskStatus;
    const targetColumnTyped = targetColumn as TaskStatus;
    
    if (fromColumn === targetColumnTyped) return;
    
    const taskToMove = tasks[fromColumn].find(task => task.id === taskId);
    if (!taskToMove) return;
    
    // Remove from source column
    const updatedSourceColumn = tasks[fromColumn].filter(task => task.id !== taskId);
    
    // Add to target column
    const updatedTargetColumn = [...tasks[targetColumnTyped], taskToMove];
    
    setTasks({
      ...tasks,
      [fromColumn]: updatedSourceColumn,
      [targetColumnTyped]: updatedTargetColumn
    });

    toast(`Task "${taskToMove.title}" moved to ${targetColumn.replace('-', ' ')}`);
  };

  const handleAssignToTeamMember = (e: React.DragEvent, teamMemberId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const fromColumn = e.dataTransfer.getData('fromColumn') as TaskStatus;
    
    const teamMember = teams.find(t => t.id === teamMemberId);
    if (!teamMember) return;
    
    // Find task across all columns
    const taskToAssign = tasks[fromColumn].find(task => task.id === taskId);
    if (!taskToAssign) return;
    
    // Update task with team member
    const updatedTask = {
      ...taskToAssign,
      assignee: teamMember.name,
      assigneeId: teamMember.id,
      assigneeInitials: teamMember.initials
    };
    
    // Update tasks state
    const updatedTasks = {
      ...tasks,
      [fromColumn]: tasks[fromColumn].map(task => 
        task.id === taskId ? updatedTask : task
      )
    };
    
    setTasks(updatedTasks);
    toast(`Task "${taskToAssign.title}" assigned to ${teamMember.name}`);
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
      assigneeId: newTask.assigneeId,
      assigneeInitials: newTask.assigneeInitials,
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
      assigneeId: '',
      assigneeInitials: '',
    });
  };

  const handleAssigneeChange = (value: string) => {
    const selectedTeamMember = teams.find(team => team.id === value);
    if (selectedTeamMember) {
      setNewTask({
        ...newTask,
        assignee: selectedTeamMember.name,
        assigneeId: selectedTeamMember.id,
        assigneeInitials: selectedTeamMember.initials
      });
    } else {
      setNewTask({
        ...newTask,
        assignee: '',
        assigneeId: '',
        assigneeInitials: ''
      });
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Board View</h1>
        <p className="text-sm text-muted-foreground">
          Manage tasks by dragging them between columns or to team members
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

      {/* Team Members Section */}
      <div className="mt-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Team Members</h2>
        <div className="flex flex-wrap gap-4">
          {teams.map(team => (
            <div 
              key={team.id}
              className="p-4 border rounded-md flex items-center gap-3 bg-white shadow-sm"
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleAssignToTeamMember(e, team.id)}
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                {team.initials}
              </div>
              <div>
                <div className="font-medium">{team.name}</div>
                <div className="text-sm text-gray-500">{team.email}</div>
              </div>
            </div>
          ))}
        </div>
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
                <Select onValueChange={handleAssigneeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(team => (
                      <SelectItem key={team.id} value={team.id}>
                        <div className="flex items-center gap-2">
                          <span>{team.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
