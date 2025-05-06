
import React from 'react';
import { TaskStatus, TaskWithComments } from '@/types/task';
import TaskColumnContainer from '../TaskColumnContainer';

interface TaskBoardContainerProps {
  filteredTasks: Record<TaskStatus, TaskWithComments[]>;
  onAddTask: (columnId: TaskStatus) => void;
  handleTaskClick: (taskId: string, columnId: TaskStatus) => void;
  handleDragOver: (e: React.DragEvent, columnId: string) => void;
  handleDrop: (e: React.DragEvent, targetColumn: string) => void;
  handleDragStart: (e: React.DragEvent, taskId: string, fromColumn: string) => void;
  draggingOver: string | null;
}

const TaskBoardContainer: React.FC<TaskBoardContainerProps> = ({
  filteredTasks,
  onAddTask,
  handleTaskClick,
  handleDragOver,
  handleDrop,
  handleDragStart,
  draggingOver
}) => {
  return (
    <TaskColumnContainer 
      filteredTasks={filteredTasks}
      onAddTask={onAddTask}
      handleTaskClick={handleTaskClick}
      handleDragOver={handleDragOver}
      handleDrop={handleDrop}
      handleDragStart={handleDragStart}
      draggingOver={draggingOver}
    />
  );
};

export default TaskBoardContainer;
