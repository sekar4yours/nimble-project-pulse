
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  assigneeId?: string;
  assigneeInitials?: string;
  dueDate?: string;
  priority: TaskPriority;
  tags?: string[];
}

interface TaskCardProps {
  task: Task;
  draggable?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent, taskId: string, fromColumn: string) => void;
  onDragEnd?: () => void;
  columnId: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  draggable = true,
  onClick,
  onDragStart,
  onDragEnd,
  columnId
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('fromColumn', columnId);
    if (onDragStart) {
      onDragStart(e, task.id, columnId);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div 
      className={cn(
        "task-card mb-3",
        isDragging ? "dragging opacity-50" : "opacity-100"
      )}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      id={`task-${task.id}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm">{task.title}</h3>
        <div className={cn("w-2 h-2 rounded-full", getPriorityColor(task.priority))} />
      </div>
      
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex justify-between items-center">
        {task.assignee && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs">
              {task.assigneeInitials || task.assignee.charAt(0)}
            </div>
            <span className="text-xs text-gray-500">{task.assignee}</span>
          </div>
        )}
        
        {task.dueDate && (
          <span className="text-xs text-gray-500">{task.dueDate}</span>
        )}
      </div>
      
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map((tag, index) => (
            <span key={index} className="px-2 py-0.5 bg-gray-100 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
