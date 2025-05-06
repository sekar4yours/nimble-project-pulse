
export type Project = {
  id: string;
  name: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email?: string;
  role?: string;
};

export type Team = {
  id: string;
  name: string;
  members?: TeamMember[];
};
