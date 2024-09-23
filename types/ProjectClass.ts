import { is, isOfType } from "~/scripts/Utils"

export type ProjectClass = {
  classId: number,
  name: string,
  description: string,
  createdAt: Date,
  archived: boolean,
  role: OwnershipRole,
  projects: Project[],
  templates: Template[],
  members: Member[]
}

export type Member = {
  id: number,
  name: string,
  email: string,
  role: OwnershipRole
}

export type Template = {
  template_id: number,
  name: string,
  description: string,
  project_class?: ProjectClass,
  archived: boolean,
}

export type Project = {
  project_id: number,
  name: string,
  description: string,
  template_id?: Template,
  archived: boolean,
}

export type ProjectClassStore = {
  projectClasses: {[key: number]: ProjectClass},
}

export const ownershipRoles = ["STUDENT", "TUTOR", "ADMIN", "OWNER"] as const;
export type OwnershipRole = typeof ownershipRoles[number];
export const isRole = isOfType(ownershipRoles);
export const checkPrecedence = (role1: OwnershipRole, role2: OwnershipRole) =>
  ownershipRoles.findIndex(is(role1)) >= ownershipRoles.findIndex(is(role2));

export type Subtask = {
  id: number,
  title: string,
  description: string,
  status: string,
  priority: string,
  start: Date,
  due: Date,
  assignment: Member,
};

export type Task = {
  id: number,
  title: string,
  description: string,
  subtasks: Subtask[],
}

export type ProjectStatus = "Mutable" | "Immutable";
export type ProjectMembers = Member[];
export type ProjectTasks = Task[];

export type ProjectDetails = 
 | ProjectStatus
 | ProjectMembers
 | ProjectTasks;

export type ProjectWithDetails<T extends ProjectDetails> = {
  project: Project,
  details: T
}

/// DEBUG Project Class
export const debugProjectClass: ProjectClass = {
  archived: false,
  classId: -1,
  projects: [
    {
      archived: false,
      name: "Debug Project",
      description: "",
      project_id: 1987
    }
  ],
  templates: [
    {
      archived: false,
      description: "",
      name: "Debug Template",
      template_id: 1234
    }
  ],
  description: "",
  name: "<CLASS-DEBUG>",
  createdAt: new Date(),
  role: "OWNER",
  members: [
    {id: 1, name: "John Port II", role: "OWNER", email: "pork@example.com"},
    {id: 2, name: "John Port III", role: "STUDENT", email: "pork2@example.com"},
  ]
}
