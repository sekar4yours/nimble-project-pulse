
import React from 'react';
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

interface CreateTaskModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  newTask: Partial<TaskWithComments>;
  setNewTask: (task: Partial<TaskWithComments>) => void;
  onCreateTask: () => void;
  teamMembers: TeamMember[];
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  setIsOpen,
  newTask,
  setNewTask,
  onCreateTask,
  teamMembers
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input 
              id="title" 
              value={newTask.title} 
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              placeholder="Task title"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea 
              id="description" 
              value={newTask.description} 
              onChange={e => setNewTask({...newTask, description: e.target.value})}
              placeholder="Task description"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="assignee" className="text-sm font-medium">Assignee</label>
              <Select 
                value={newTask.assignee} 
                onValueChange={(value) => setNewTask({...newTask, assignee: value})}
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
              <label htmlFor="priority" className="text-sm font-medium">Priority</label>
              <Select 
                value={newTask.priority as string} 
                onValueChange={value => setNewTask({...newTask, priority: value as TaskWithComments['priority']})}
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={onCreateTask}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
