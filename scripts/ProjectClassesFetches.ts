import { checkPrecedence, isRole } from "~/types/ProjectClass";
import type { Announcement, Member, Project, ProjectMembers, ProjectStatus } from "~/types/ProjectClass";
import { findInList, ident, isNumericString } from "./Utils";
import { FetchRequest } from "./FetchTools";
import { AddProjectMembersRequest, AddProjectMembersResponse, CreateAnnouncementRequest, CreateAnnouncementResponse, GetAnnouncementResponse, GetAnnouncementsResponse, GetMembersResponse, GetProjectResponse, UpdateAnnouncementRequest, UpdateProjectRequest } from "~/types/proto/ProjectClass";
import type { Optional } from "~/types/Optional";
import { getCurrentGMTDateTime, stringToDate } from "./Datetime";

export const setupProjectState = async (classIdParam: string, projIdParam: string) => {


  const id = projIdParam.trim();
  const classId = classIdParam.trim();
  const appState = useAppStateStore();
  const dialogs = useDialogs();
  const {t} = useI18n();

  const showError = () => dialogs.closeAllWithTypeThenOpen({
    title: t("dialogError.somethingWentWrong"),
    icon: "fluent:error-circle-20-regular",
    dialogType: "projectError",
    width: "400px",
    payload: undefined,
    style: {
      titleBackground: "var(--dangerous-weak)",
      titleColor: "var(--dangerous-strong)",
    },
  }, false);

  if (
    id === '' ||
    !isNumericString(id) ||
    (!isNumericString(classId) && classId !== "-1")
  ) {
    showError();
    return;
  }
  
  // try getting project
  const tryClass = await getProject(Number(classId), Number(id));
  if (
    !useRuntimeConfig().public.debug &&
    !tryClass
  ) {
    showError();
    return;
  }

  appState.setProject(Number(id));
  appState.setClass(Number(classId));
  loadClassIfNotExist(Number(classId));
  appState.setProjectTitle(tryClass!.name);
}

export const getProject = async (classId: number, projectId: number): Promise<Optional<Project>> => {
  const classRes = await loadClassIfNotExist(classId);

  if (!classRes) return;

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

export const detachProject = async (classId: number, projectId: number) => {
  await FetchRequest.protectedAPI(`/classes/${classId}/projects/${projectId}/detach`)
    .post().commit();
}

// TODO
export const updateProject = async (classId: number, projectId: number, options: {name?: string, description?: string, archived?: boolean}) => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/update`)
    .post()
    .payload(UpdateProjectRequest.encode, {
      description: options.description, 
      archived: options.archived, 
      title: options.name
    })
    .commit();
}

export const deleteProject = async (classId: number, projectId: number) => {
  await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/delete`)
    .delete()
    .commit();
}

export const loadClassIfNotExist = async (classId: number) => {
  const projectClasses = useProjectClassStore();
  if (!(classId in projectClasses.projectClasses)){
    return await projectClasses.loadClass(classId);
  }
  else {
    if (projectClasses.projectClasses[classId].members.length === 0) 
      projectClasses.loadMembers(classId);
    if (projectClasses.projectClasses[classId].projects.length === 0) 
      projectClasses.loadProjects(classId);
    if (projectClasses.projectClasses[classId].templates.length === 0) 
      projectClasses.loadTemplates(classId);
  }
  return true;
};

export const getProjectMembers = async (projectId: number, classId: number): Promise<ProjectMembers> => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/members`)
    .commitAndRecv(GetMembersResponse.decode);

  req.res(console.log);

  if (!req.isError() && req._result) {
    return req._result.classMembers.map((m): Member => ({
      id: m.id,
      name: `${m.basicInfo!.firstName} ${m.basicInfo!.lastName}`.trim(),
      email: m.basicInfo!.email,
      role: isRole(m.role) ? m.role : "STUDENT",
    }));
  }

  return [];
}

export const getProjectStatus = async (classId: number): Promise<ProjectStatus> => {
  const appState = useAppStateStore();
  const projectClasses = useProjectClassStore();
  await loadClassIfNotExist(classId);
  
  if (projectClasses.projectClasses[classId].members.length === 0){
    await projectClasses.loadMembers(classId);
  }

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

export const getAnnouncements = async (classId: number): Promise<Announcement[]> => {
  await loadClassIfNotExist(classId);
  const projectClasses = useProjectClassStore();
  
  const req = await FetchRequest
  .protectedAPI(`/classes/${classId}/announcements`)
  .commitAndRecv(GetAnnouncementsResponse.decode);

  if (!req.isError() && req._result) {

    return req._result.announcements.map(a => {
      return {
        author: findInList(projectClasses.projectClasses[classId].members, m => m.id === a.authorId, ident)!,
        projectClass: projectClasses.projectClasses[classId],
        content: a.content,
        id: a.id,
        sentAt: stringToDate(a.sentAt),
        title: a.title,
      }
    });
  }
  
  return []
}

export const getAnnouncement = async (classId: number, announcementId: number): Promise<Optional<Announcement>> => {
  await loadClassIfNotExist(classId);
  const projectClasses = useProjectClassStore();
  
  const req = await FetchRequest
  .protectedAPI(`/classes/${classId}/announcements/${announcementId}`)
  .commitAndRecv(GetAnnouncementResponse.decode);

  if (!req.isError() && req._result) {
    return {
      author: findInList(projectClasses.projectClasses[classId].members, m => m.id === req._result!.announcement!.authorId, ident)!,
      projectClass: projectClasses.projectClasses[classId],
      content: req._result.announcement!.content,
      id: req._result.announcement!.id,
      sentAt: stringToDate(req._result.announcement!.sentAt),
      title: req._result.announcement!.title,
    }
  }
}

export const createAnnouncement = async (classId: number, title: string, content: string) => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/announcements/create`)
    .post()
    .payload(CreateAnnouncementRequest.encode, { content, title, sentAt: getCurrentGMTDateTime() })
    .commitAndRecv(CreateAnnouncementResponse.decode);
    
    if (!req.isError() && req._result) {
      return req._result.id;
    }
}

export const updateAnnouncement = async (classId: number, announcementId: number, options: {title?: string, content?: string}) => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/announcements/${announcementId}/update`)
    .post()
    .payload(UpdateAnnouncementRequest.encode, options)
    .commit()
}

export const deleteAnnouncement = async (classId: number, announcementId: number) => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/announcements/${announcementId}/delete`)
    .delete()
    .commit()
}