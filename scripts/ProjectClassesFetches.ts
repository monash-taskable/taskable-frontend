import { checkPrecedence, isRole } from "~/types/ProjectClass";
import type { Member, Project, ProjectMembers, ProjectStatus } from "~/types/ProjectClass";
import { findInList, ident } from "./Utils";
import { FetchRequest } from "./FetchTools";
import { AddProjectMembersRequest, AddProjectMembersResponse, GetMembersResponse, GetProjectResponse } from "~/types/proto/ProjectClass";
import type { Optional } from "~/types/Optional";

export const getProject = async (classId: number, projectId: number): Promise<Optional<Project>> => {
  await loadClassIfNotExist(classId);
  const projectClasses = useProjectClassStore();
  await projectClasses.loadTemplates(classId);
  
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}`)
    .commitAndRecv(GetProjectResponse.decode);

  if (!req.isError() && req._result && req._result.project){
    const {archived, description, id, title, templateId} = req._result.project;
    return {
      archived, description,
      name: title,
      projectId: id,
      template: templateId === undefined ? undefined : 
        findInList(projectClasses.projectClasses[classId].templates, t => t.templateId === templateId, ident),
    }
  }
}

// TODO
export const updateProject = async (classId: number, projectId: number, options: {name?: string, description?: string, archived?: boolean}) => {
  
}

export const deleteProject = async (classId: number, projectId: number) => {
  await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/delete`)
    .delete()
    .commit();
}

export const loadClassIfNotExist = async (classId: number) => {
  const projectClasses = useProjectClassStore();
  if (!(classId in projectClasses.projectClasses)) 
    await projectClasses.loadClass(classId);
};

export const getProjectMembers = async (projectId: number, classId: number): Promise<ProjectMembers> => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/members`)
    .commitAndRecv(GetMembersResponse.decode);
  
  if (!req.isError() && req._result) {
    return req._result.classMembers.map((m): Member => ({
      id: m.id,
      name: `${m.basicInfo!.firstName} ${m.basicInfo!.firstName}`.trim(),
      email: m.basicInfo!.email,
      role: isRole(m.role) ? m.role : "STUDENT",
    }));
  }

  return [];
}

// local
export const getProjectStatus = async (classId: number): Promise<ProjectStatus> => {
  const appState = useAppStateStore();
  const projectClasses = useProjectClassStore();
  await loadClassIfNotExist(classId);
  
  const role = findInList(
    projectClasses.projectClasses[classId].members, 
    m => m.id === appState.session.profile!.id, 
    m => m.role);
    
    return checkPrecedence(role ?? "STUDENT", "ADMIN") ? "Mutable" : "Immutable";
  }
  
  // local
  export const getProjectManagers = async (classId: number): Promise<ProjectMembers> => {
  const projectClasses = useProjectClassStore();
  await loadClassIfNotExist(classId);

  return projectClasses.projectClasses[classId].members.filter(m => checkPrecedence(m.role, "ADMIN"));
}

export const addProjectMember = async (projectId: number, classId: number, emails: string[]): Promise<string[]> => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/members/add`)
    .post()
    .payload(AddProjectMembersRequest.encode, { emails })
    .commitAndRecv(AddProjectMembersResponse.decode);

  if (!req.isError() && req._result) { return req._result.invalidEmails }
  return [];
}

export const removeProjectMember = async (projectId: number, classId: number, members: Member[]): Promise<void> => {
  members.forEach(m => FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/members/${m.id}/delete`)
    .delete()
    .commit()
  )
}

// local
export const getProjectProfile = async (classId: number): Promise<Member> => {
  await loadClassIfNotExist(classId);
  return {
    id: 1,
    name: "john pork",
    role: "OWNER",
    email: "jpor0001@student.monash.edu",
  }
}