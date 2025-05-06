
export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

export interface Team {
  id: string;
  name: string;
  members?: TeamMember[];
}
