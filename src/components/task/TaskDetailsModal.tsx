
import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { TaskWithComments } from '@/types/task';
import { TeamMember } from '@/types/team';
import { toast } from 'sonner';

interface TaskDetailsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedTask: TaskWithComments | null;
  setSelectedTask: (task: TaskWithComments | null) => void;
  isCurrentUserTaskCreator: boolean;
  onUpdateTask: () => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  onAddComment: () => void;
  teamMembers: TeamMember[];
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  setIsOpen,
  selectedTask,
  setSelectedTask,
  isCurrentUserTaskCreator,
  onUpdateTask,
  newComment,
  setNewComment,
  onAddComment,
  teamMembers
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!selectedTask) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="taskTitle" className="text-sm font-medium">Title</label>
            <Input 
              id="taskTitle" 
              value={selectedTask.title} 
              onChange={e => setSelectedTask({...selectedTask, title: e.target.value})}
              readOnly={!isCurrentUserTaskCreator}
              className={!isCurrentUserTaskCreator ? "bg-gray-100" : ""}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="taskDescription" className="text-sm font-medium">Description</label>
            <Textarea 
              id="taskDescription" 
              value={selectedTask.description} 
              onChange={e => setSelectedTask({...selectedTask, description: e.target.value})}
              rows={3}
              readOnly={!isCurrentUserTaskCreator}
              className={!isCurrentUserTaskCreator ? "bg-gray-100" : ""}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="taskAssignee" className="text-sm font-medium">Assignee</label>
              <Select 
                value={selectedTask.assignee || ""} 
                onValueChange={(value) => setSelectedTask({...selectedTask, assignee: value})}
                disabled={!isCurrentUserTaskCreator}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.name}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="taskPriority" className="text-sm font-medium">Priority</label>
              <Select 
                value={selectedTask.priority} 
                onValueChange={value => setSelectedTask({...selectedTask, priority: value as TaskWithComments['priority']})}
                disabled={!isCurrentUserTaskCreator}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedTask.dueDate && (
            <div className="space-y-2">
              <label htmlFor="taskDueDate" className="text-sm font-medium">Due Date</label>
              <Input 
                id="taskDueDate" 
                value={selectedTask.dueDate} 
                onChange={e => setSelectedTask({...selectedTask, dueDate: e.target.value})}
                readOnly={!isCurrentUserTaskCreator}
                className={!isCurrentUserTaskCreator ? "bg-gray-100" : ""}
              />
            </div>
          )}
          
          {selectedTask.tags && (
            <div className="space-y-2">
              <label htmlFor="taskTags" className="text-sm font-medium">Tags</label>
              <Input 
                id="taskTags" 
                value={selectedTask.tags.join(", ")} 
                onChange={e => setSelectedTask({...selectedTask, tags: e.target.value.split(",").map(tag => tag.trim())})}
                placeholder="Separate tags with commas"
                readOnly={!isCurrentUserTaskCreator}
                className={!isCurrentUserTaskCreator ? "bg-gray-100" : ""}
              />
            </div>
          )}
          
          {/* Task Comments */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium mb-3">Comments</h3>
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
              {selectedTask.comments && selectedTask.comments.length > 0 ? (
                selectedTask.comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs mr-2">
                          {comment.author.charAt(0)}
                        </div>
                        <span className="font-medium text-sm">{comment.author}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm mt-2 pl-10">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
              )}
            </div>
            
            {/* Add Comment */}
            <div className="flex gap-2">
              <Textarea 
                placeholder="Add a comment..." 
                className="flex-1"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={onAddComment} disabled={!newComment.trim()}>
                Reply
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
          {isCurrentUserTaskCreator && (
            <Button onClick={onUpdateTask}>Update Task</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
