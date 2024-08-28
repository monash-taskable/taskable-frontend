export type ProjectClass = {
  classId: number,
  name: string,
  description: string,
  createdAt: Date,
  archived: boolean,
  role: string,
  projects: Project[]
}

export type Template = {
  template_id: number,
  description: string,
  project_class?: ProjectClass,
  archived: boolean
}

export type Project = {
  project_id: number,
  description: string,
  template_id?: Template,
  archived: boolean
}

export type ProjectClassStore = {
  projectClasses: {[key: number]: ProjectClass},
}