
export interface TaskComment {
  id: string;
  text: string;
  author: string;
  timestamp: string; // Adding timestamp field
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assignee?: string;
  createdBy: string;
  projectId: string;
  teamId?: string;
  comments: TaskComment[];
}
