import { isOfType } from "~/scripts/Utils"

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

const roles = ["STUDENT", "TUTOR", "ADMIN", "OWNER"] as const;
export type OwnershipRole = typeof roles[number];
export const isRole = isOfType(roles);