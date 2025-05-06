
import React from 'react';
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskColumnHeaderProps {
  title: string;
  taskCount: number;
  onAddTask: () => void;
}

const TaskColumnHeader: React.FC<TaskColumnHeaderProps> = ({
  title,
  taskCount,
  onAddTask
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-medium text-sm">{title} ({taskCount})</h2>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-5 w-5 hover:bg-gray-200"
        onClick={onAddTask}
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TaskColumnHeader;
