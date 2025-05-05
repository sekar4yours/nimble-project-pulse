
import React from 'react';
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskCard, { Task } from './TaskCard';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onAddTask: () => void;
  onTaskClick: (taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string, fromColumn: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  id,
  title,
  tasks,
  onAddTask,
  onTaskClick,
  onDragOver,
  onDrop,
  onDragStart
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e, id);
  };

  return (
    <div 
      className="task-column"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-sm">{title} ({tasks.length})</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5 hover:bg-gray-200"
          onClick={onAddTask}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="tasks-container">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={() => onTaskClick(task.id)}
            onDragStart={onDragStart}
            columnId={id}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
