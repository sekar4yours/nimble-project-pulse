
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

  // Team members state
  const [teamMembers, setTeamMembers] = useState([
    { id: "user-1", name: "Alex" },
    { id: "user-2", name: "Sarah" },
    { id: "user-3", name: "Mike" },
    { id: "user-4", name: "Emily" }
  ]);

  // Drag and drop state
  const [draggedTask, setDraggedTask] = useState<{
    taskId: string;
    fromColumn: TaskStatus;
  } | null>(null);

  const [draggingOver, setDraggingOver] = useState<string | null>(null);

  // Task modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
  });
  const [targetColumn, setTargetColumn] = useState<TaskStatus>('backlog');

  // Task details modal state
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string, fromColumn: string) => {
    setDraggedTask({
      taskId,
      fromColumn: fromColumn as TaskStatus
    });
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDraggingOver(columnId);
  };

  const handleDrop = (e: React.DragEvent, targetColumn: string) => {
    setDraggingOver(null);
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

  // Team member drag and drop
  const handleDragOverTeamMember = (e: React.DragEvent, memberId: string) => {
    e.preventDefault();
  };

  const handleDropOnTeamMember = (e: React.DragEvent, memberName: string) => {
    if (!draggedTask) return;
    
    const { taskId, fromColumn } = draggedTask;
    const fromColumnTyped = fromColumn as TaskStatus;
    
    const taskToUpdate = tasks[fromColumnTyped].find(task => task.id === taskId);
    if (!taskToUpdate) return;
    
    // Update the task with the new assignee
    const updatedTask = { ...taskToUpdate, assignee: memberName };
    
    // Create updated task list
    const updatedTasks = tasks[fromColumnTyped].map(task => 
      task.id === taskId ? updatedTask : task
    );
    
    setTasks({
      ...tasks,
      [fromColumnTyped]: updatedTasks
    });

    toast(`Task "${updatedTask.title}" assigned to ${memberName}`);
  };

  const handleTaskClick = (taskId: string, columnId: TaskStatus) => {
    const task = tasks[columnId].find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsTaskDetailsOpen(true);
    }
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

  const handleUpdateTask = () => {
    if (!selectedTask) return;
    
    const { id, title, description, priority, assignee } = selectedTask;
    const columnId = Object.keys(tasks).find(column => 
      tasks[column as TaskStatus].some(task => task.id === id)
    ) as TaskStatus;
    
    if (!columnId) return;
    
    const updatedTasks = tasks[columnId].map(task => 
      task.id === id ? selectedTask : task
    );
    
    setTasks({
      ...tasks,
      [columnId]: updatedTasks
    });
    
    toast.success(`Task "${title}" updated`);
    setIsTaskDetailsOpen(false);
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Board View</h1>
        <p className="text-sm text-muted-foreground">
          Manage tasks by dragging them between columns or to team members
        </p>
      </div>
      
      <div className="flex gap-6 mb-6">
        {teamMembers.map(member => (
          <div
            key={member.id}
            className="flex flex-col items-center p-2 border rounded-md cursor-pointer"
            onDragOver={(e) => handleDragOverTeamMember(e, member.id)}
            onDrop={(e) => handleDropOnTeamMember(e, member.name)}
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium mb-1">
              {member.name.charAt(0)}
            </div>
            <span className="text-sm">{member.name}</span>
          </div>
        ))}
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-6">
        <TaskColumn
          id="backlog"
          title="Backlog"
          tasks={tasks.backlog}
          onAddTask={() => handleAddTask('backlog')}
          onTaskClick={(taskId) => handleTaskClick(taskId, 'backlog')}
          onDragOver={(e) => handleDragOver(e, 'backlog')}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          isDraggingOver={draggingOver === 'backlog'}
        />
        
        <TaskColumn
          id="in-progress"
          title="In Progress"
          tasks={tasks['in-progress']}
          onAddTask={() => handleAddTask('in-progress')}
          onTaskClick={(taskId) => handleTaskClick(taskId, 'in-progress')}
          onDragOver={(e) => handleDragOver(e, 'in-progress')}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          isDraggingOver={draggingOver === 'in-progress'}
        />
        
        <TaskColumn
          id="done"
          title="Done"
          tasks={tasks.done}
          onAddTask={() => handleAddTask('done')}
          onTaskClick={(taskId) => handleTaskClick(taskId, 'done')}
          onDragOver={(e) => handleDragOver(e, 'done')}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          isDraggingOver={draggingOver === 'done'}
        />
      </div>

      {/* Create Task Dialog */}
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
                <Select 
                  value={newTask.assignee} 
                  onValueChange={(value) => setNewTask({...newTask, assignee: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map(member => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
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

      {/* Task Details Dialog */}
      <Dialog open={isTaskDetailsOpen} onOpenChange={setIsTaskDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="taskTitle" className="text-sm font-medium">Title</label>
                <Input 
                  id="taskTitle" 
                  value={selectedTask.title} 
                  onChange={e => setSelectedTask({...selectedTask, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="taskDescription" className="text-sm font-medium">Description</label>
                <Textarea 
                  id="taskDescription" 
                  value={selectedTask.description} 
                  onChange={e => setSelectedTask({...selectedTask, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="taskAssignee" className="text-sm font-medium">Assignee</label>
                  <Select 
                    value={selectedTask.assignee || ""} 
                    onValueChange={(value) => setSelectedTask({...selectedTask, assignee: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map(member => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="taskPriority" className="text-sm font-medium">Priority</label>
                  <Select 
                    value={selectedTask.priority} 
                    onValueChange={value => setSelectedTask({...selectedTask, priority: value as Task['priority']})}
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
              {selectedTask.dueDate && (
                <div className="space-y-2">
                  <label htmlFor="taskDueDate" className="text-sm font-medium">Due Date</label>
                  <Input 
                    id="taskDueDate" 
                    value={selectedTask.dueDate} 
                    onChange={e => setSelectedTask({...selectedTask, dueDate: e.target.value})}
                  />
                </div>
              )}
              {selectedTask.tags && (
                <div className="space-y-2">
                  <label htmlFor="taskTags" className="text-sm font-medium">Tags</label>
                  <Input 
                    id="taskTags" 
                    value={selectedTask.tags.join(", ")} 
                    onChange={e => setSelectedTask({...selectedTask, tags: e.target.value.split(",").map(tag => tag.trim())})}
                    placeholder="Separate tags with commas"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskDetailsOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateTask}>Update Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskBoard;
