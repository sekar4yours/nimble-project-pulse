
import { Task } from '@/components/TaskCard';

export interface TaskComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface TaskWithComments extends Task {
  comments?: TaskComment[];
}

export type TaskStatus = 'backlog' | 'in-progress' | 'done';
