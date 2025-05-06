
import { useState } from 'react';
import { TaskWithComments, TaskStatus } from '@/types/task';
import { toast } from 'sonner';

interface UseDragAndDropProps {
  tasks: Record<TaskStatus, TaskWithComments[]>;
  setTasks: React.Dispatch<React.SetStateAction<Record<TaskStatus, TaskWithComments[]>>>;
}

const useDragAndDrop = ({ tasks, setTasks }: UseDragAndDropProps) => {
  const [draggedTask, setDraggedTask] = useState<{
    taskId: string;
    fromColumn: TaskStatus;
  } | null>(null);

  const [draggingOver, setDraggingOver] = useState<string | null>(null);

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

  return {
    draggedTask,
    draggingOver,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragOverTeamMember,
    handleDropOnTeamMember
  };
};

export default useDragAndDrop;
