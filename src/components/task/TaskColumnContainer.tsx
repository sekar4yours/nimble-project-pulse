
import React from 'react';
import TaskColumn from './TaskColumn';
import { TaskWithComments, TaskStatus } from '@/types/task';

interface TaskColumnContainerProps {
  filteredTasks: Record<TaskStatus, TaskWithComments[]>;
  onAddTask: (columnId: TaskStatus) => void;
  handleTaskClick: (taskId: string, columnId: TaskStatus) => void;
  handleDragOver: (e: React.DragEvent, columnId: string) => void;
  handleDrop: (e: React.DragEvent, targetColumn: string) => void;
  handleDragStart: (e: React.DragEvent, taskId: string, fromColumn: string) => void;
  draggingOver: string | null;
}

const TaskColumnContainer: React.FC<TaskColumnContainerProps> = ({
  filteredTasks,
  onAddTask,
  handleTaskClick,
  handleDragOver,
  handleDrop,
  handleDragStart,
  draggingOver
}) => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6">
      <TaskColumn
        id="backlog"
        title="Backlog"
        tasks={filteredTasks.backlog}
        onAddTask={() => onAddTask('backlog')}
        onTaskClick={(taskId) => handleTaskClick(taskId, 'backlog')}
        onDragOver={(e) => handleDragOver(e, 'backlog')}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        isDraggingOver={draggingOver === 'backlog'}
      />
      
      <TaskColumn
        id="in-progress"
        title="In Progress"
        tasks={filteredTasks['in-progress']}
        onAddTask={() => onAddTask('in-progress')}
        onTaskClick={(taskId) => handleTaskClick(taskId, 'in-progress')}
        onDragOver={(e) => handleDragOver(e, 'in-progress')}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        isDraggingOver={draggingOver === 'in-progress'}
      />
      
      <TaskColumn
        id="done"
        title="Done"
        tasks={filteredTasks.done}
        onAddTask={() => onAddTask('done')}
        onTaskClick={(taskId) => handleTaskClick(taskId, 'done')}
        onDragOver={(e) => handleDragOver(e, 'done')}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        isDraggingOver={draggingOver === 'done'}
      />
    </div>
  );
};

export default TaskColumnContainer;
