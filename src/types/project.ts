
import { TeamMember } from './team';

export interface Project {
  id: string;
  name: string;
  description?: string;
  members?: TeamMember[];
}
