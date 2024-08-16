export type ProjectClass = {
  class_id: number,
  name: string,
  description: string,
  created_at: Date,
  archived: boolean,
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
  projectClasses: ProjectClass[],
}