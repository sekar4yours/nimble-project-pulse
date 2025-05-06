
import React from 'react';
import { cn } from '@/lib/utils';

interface TaskColumnWrapperProps {
  children: React.ReactNode;
  isDraggingOver?: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const TaskColumnWrapper: React.FC<TaskColumnWrapperProps> = ({
  children,
  isDraggingOver = false,
  onDragOver,
  onDrop
}) => {
  return (
    <div 
      className={cn(
        "task-column transition-colors duration-200",
        isDraggingOver && "bg-gray-100"
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
};

export default TaskColumnWrapper;
