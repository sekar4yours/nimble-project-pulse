
import React from 'react';
import useTaskBoard from '@/hooks/useTaskBoard';
import TaskHeader from './task/board/TaskHeader';
import TaskBoardContainer from './task/board/TaskBoardContainer';
import TaskModalsContainer from './task/modals/TaskModalsContainer';

interface TaskBoardProps {
  projectId: string;
  teamId: string | null;
  selectedMember?: string | null;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ projectId, teamId, selectedMember }) => {
  const {
    // Task data and rendering
    filteredTasks,
    teamMembers,
    draggedTask,
    draggingOver,
    
    // Event handlers
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleTaskClick,
    handleAddTask,
    
    // Modal states and handlers
    isTaskModalOpen,
    setIsTaskModalOpen,
    newTask,
    setNewTask,
    handleCreateTask,
    isTaskDetailsOpen,
    setIsTaskDetailsOpen,
    selectedTask,
    setSelectedTask,
    isCurrentUserTaskCreator,
    handleUpdateTask,
    newComment,
    setNewComment,
    handleAddComment
  } = useTaskBoard({ projectId, teamId, selectedMember });

  return (
    <div className="flex-1 p-6 overflow-auto">
      <TaskHeader 
        projectId={projectId} 
        selectedMember={selectedMember}
        teamMembers={teamMembers}
      />
      
      <TaskBoardContainer 
        filteredTasks={filteredTasks}
        onAddTask={handleAddTask}
        handleTaskClick={handleTaskClick}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleDragStart={handleDragStart}
        draggingOver={draggingOver}
      />

      <TaskModalsContainer
        // Create task modal props
        isTaskModalOpen={isTaskModalOpen}
        setIsTaskModalOpen={setIsTaskModalOpen}
        newTask={newTask}
        setNewTask={setNewTask}
        handleCreateTask={handleCreateTask}
        
        // Task details modal props
        isTaskDetailsOpen={isTaskDetailsOpen}
        setIsTaskDetailsOpen={setIsTaskDetailsOpen}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        isCurrentUserTaskCreator={isCurrentUserTaskCreator}
        handleUpdateTask={handleUpdateTask}
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
        
        // Shared props
        teamMembers={teamMembers}
      />
    </div>
  );
};

export default TaskBoard;
