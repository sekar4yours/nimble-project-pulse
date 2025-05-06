
import React from 'react';
import { TaskWithComments } from '@/types/task';
import { TeamMember } from '@/types/team';
import CreateTaskModal from '../CreateTaskModal';
import TaskDetailsModal from '../TaskDetailsModal';

interface TaskModalsContainerProps {
  // Create task modal props
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  newTask: Partial<TaskWithComments>;
  setNewTask: (task: Partial<TaskWithComments>) => void;
  handleCreateTask: () => void;
  
  // Task details modal props
  isTaskDetailsOpen: boolean;
  setIsTaskDetailsOpen: (open: boolean) => void;
  selectedTask: TaskWithComments | null;
  setSelectedTask: (task: TaskWithComments | null) => void;
  isCurrentUserTaskCreator: boolean;
  handleUpdateTask: () => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  handleAddComment: () => void;
  
  // Shared props
  teamMembers: TeamMember[];
}

const TaskModalsContainer: React.FC<TaskModalsContainerProps> = ({
  // Create task modal props
  isTaskModalOpen,
  setIsTaskModalOpen,
  newTask,
  setNewTask,
  handleCreateTask,
  
  // Task details modal props
  isTaskDetailsOpen,
  setIsTaskDetailsOpen,
  selectedTask,
  setSelectedTask,
  isCurrentUserTaskCreator,
  handleUpdateTask,
  newComment,
  setNewComment,
  handleAddComment,
  
  // Shared props
  teamMembers
}) => {
  return (
    <>
      {/* Create Task Dialog */}
      <CreateTaskModal 
        isOpen={isTaskModalOpen}
        setIsOpen={setIsTaskModalOpen}
        newTask={newTask}
        setNewTask={setNewTask}
        onCreateTask={handleCreateTask}
        teamMembers={teamMembers}
      />

      {/* Task Details Dialog */}
      <TaskDetailsModal 
        isOpen={isTaskDetailsOpen}
        setIsOpen={setIsTaskDetailsOpen}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        isCurrentUserTaskCreator={isCurrentUserTaskCreator}
        onUpdateTask={handleUpdateTask}
        newComment={newComment}
        setNewComment={setNewComment}
        onAddComment={handleAddComment}
        teamMembers={teamMembers}
      />
    </>
  );
};

export default TaskModalsContainer;
