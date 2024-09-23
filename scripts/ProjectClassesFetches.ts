import type { Member, OwnershipRole, ProjectMembers, ProjectStatus } from "~/types/ProjectClass";
import { FetchRequest } from "./FetchTools";

export const getProjectMembers = async (projectId: number): Promise<ProjectMembers> => {
  // FetchRequest.protectedAPI(`projects/${projectId}/members`);
  return [
    {email: "jpor0000@student.monash.edu", id: 1, name: "john pork", role: "OWNER"},
    {email: "jpor0001@student.monash.edu", id: 2, name: "john pork II", role: "STUDENT"},
  ];
}

export const getProjectStatus = async (projectId: number): Promise<ProjectStatus> => {
  return "Mutable";
}

export const getProjectManagers = async (projectId: number): Promise<ProjectMembers> => {
  return [];
}

export const modifyProjectMemberRole = async (projectId: number, members: Member[], role: OwnershipRole): Promise<void> => {
}

export const addProjectMember = async (projectId: number, emails: string[]): Promise<string[]> => {
  return [];
}

export const removeProjectMember = async (projectId: number, members: Member[]): Promise<void> => {
}

export const getProjectProfile = async (projectId: number): Promise<Member> => {
  return {
    id: 1,
    name: "john pork",
    role: "OWNER",
    email: "jpor0001@student.monash.edu",
  }
}