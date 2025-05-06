
import React from 'react';
import TaskCard, { Task } from '@/components/TaskCard';
import TaskColumnHeader from './column/TaskColumnHeader';
import TaskColumnContainer from './column/TaskColumnContainer';
import TaskColumnWrapper from './column/TaskColumnWrapper';

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onAddTask: () => void;
  onTaskClick: (taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string, fromColumn: string) => void;
  isDraggingOver?: boolean;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  id,
  title,
  tasks,
  onAddTask,
  onTaskClick,
  onDragOver,
  onDrop,
  onDragStart,
  isDraggingOver = false
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
    <TaskColumnWrapper
      isDraggingOver={isDraggingOver}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <TaskColumnHeader 
        title={title} 
        taskCount={tasks.length} 
        onAddTask={onAddTask} 
      />
      
      <TaskColumnContainer>
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={() => onTaskClick(task.id)}
            onDragStart={onDragStart}
            columnId={id}
          />
        ))}
      </TaskColumnContainer>
    </TaskColumnWrapper>
  );
};

export default TaskColumn;
