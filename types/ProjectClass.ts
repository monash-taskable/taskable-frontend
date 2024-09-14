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
  role: "ADMIN",
  members: [
    {id: 1, name: "John Port II", role: "OWNER"},
    {id: 2, name: "John Port III", role: "STUDENT"},
  ]
}
