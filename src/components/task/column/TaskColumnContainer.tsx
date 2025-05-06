
import React from 'react';
import { Task } from '@/components/TaskCard';

interface TaskColumnContainerProps {
  children: React.ReactNode;
}

const TaskColumnContainer: React.FC<TaskColumnContainerProps> = ({ children }) => {
  return (
    <div className="tasks-container">
      {children}
    </div>
  );
};

export default TaskColumnContainer;
