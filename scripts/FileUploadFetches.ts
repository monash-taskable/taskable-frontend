import { AttachFileRequest, FilePreUploadRequest, FilePreUploadResponse, GetFileDownloadResponse, GetFileResponse, GetFilesResponse, GetSubtaskFilesResponse } from "~/types/proto/Files"
import { FetchRequest } from "./FetchTools"
import type { Optional } from "~/types/Optional";
import type { SharedFile } from "~/types/Files";

export const projectFilePreUpload = async (classId: number, projectId: number, filename: string, size: number): Promise<Optional<{id: number, url: string}>> => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/files/pre-upload`)
    .post()
    .payload(FilePreUploadRequest.encode, { filename, size })
    .commitAndRecv(FilePreUploadResponse.decode);

  if (req.isError() || req._result === undefined) return;

  return req._result;
}

export const templateFilePreUploadRequest = async (classId: number, templateId: number, filename: string, size: number): Promise<Optional<{id: number, url: string}>> => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/templates/${templateId}/files/pre-upload`)
    .post()
    .payload(FilePreUploadRequest.encode, { filename, size })
    .commitAndRecv(FilePreUploadResponse.decode);

  if (req.isError() || req._result === undefined) return;

  return req._result;
}

export const subtaskFilePreUploadRequest = async (classId: number, projectId: number, taskId: number, subtaskId: number, filename: string, size: number): Promise<Optional<{id: number, url: string}>> => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/files/pre-upload`)
    .post()
    .payload(FilePreUploadRequest.encode, { filename, size })
    .commitAndRecv(FilePreUploadResponse.decode);

  if (req.isError() || req._result === undefined) return;

  return req._result;
}

export const getProjectFiles = async (classId: number, projectId: number):Promise<{templateFiles: SharedFile[], projectFiles: SharedFile[]}>  => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/files/`)
    .commitAndRecv(GetFilesResponse.decode);
  
  if (req.isError() || req._result === undefined) return {templateFiles: [], projectFiles: []};
  
  return req._result;
}

export const getTemplateFiles = async (classId: number, templateId: number):Promise<{templateFiles: SharedFile[], projectFiles: SharedFile[]}>  => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/templates/${templateId}/files/`)
    .commitAndRecv(GetFilesResponse.decode);
  
  if (req.isError() || req._result === undefined) return {templateFiles: [], projectFiles: []};
  
  return req._result;
}

export const getSubtaskFiles = async (classId: number, projectId: number, taskId: number, subtaskId: number):Promise<SharedFile[]>  => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/files`)
    .commitAndRecv(GetSubtaskFilesResponse.decode);
  
  if (req.isError() || req._result === undefined) return [];
  
  return req._result.files;
}

export const getProjectFile = async (classId: number, projectId: number, fileId: number):Promise<Optional<SharedFile>>  => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/files/${fileId}`)
    .commitAndRecv(GetFileResponse.decode);
  
  if (req.isError() || req._result === undefined) return undefined;
  
  return req._result.file;
}

export const getTemplateFile = async (classId: number, templateId: number, fileId: number):Promise<Optional<SharedFile>>  => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/templates/${templateId}/files/${fileId}`)
    .commitAndRecv(GetFileResponse.decode);
  
  if (req.isError() || req._result === undefined) return undefined;
  
  return req._result.file;
}

export const getSubtaskFile = async (classId: number, projectId: number, taskId: number, subtaskId: number, fileId: number): Promise<Optional<SharedFile>> => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/files/${fileId}`)
    .commitAndRecv(GetFileResponse.decode);
  
  if (req.isError() || req._result === undefined) return undefined;
  
  return req._result.file;
}

export const deleteProjectFile = async (classId: number, projectId: number, fileId: number)  => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/files/${fileId}/delete`)
    .delete()
    .commit();
}

export const deleteTemplateFile = async (classId: number, templateId: number, fileId: number)  => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/templates/${templateId}/files/${fileId}/delete`)
    .delete()
    .commit();
}

export const deleteSubtaskFile = async (classId: number, projectId: number, taskId: number, subtaskId: number, fileId: number) => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/files/${fileId}/delete`)
    .delete()
    .commit();
}

export const projectDownloadRequest = async (classId: number, projectId: number, fileId: number): Promise<Optional<string>> => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/files/${fileId}/download`)
    .commitAndRecv(GetFileDownloadResponse.decode);

  if (req.isError() || req._result === undefined) return;

  return req._result.url;
}

export const templateFileDownloadRequest = async (classId: number, templateId: number, fileId: number): Promise<Optional<string>> => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/templates/${templateId}/files/${fileId}/download`)
    .commitAndRecv(GetFileDownloadResponse.decode);

  if (req.isError() || req._result === undefined) return;

  return req._result.url;
}

export const subtaskFileDownloadRequest = async (classId: number, projectId: number, taskId: number, subtaskId: number, fileId: number): Promise<Optional<string>> => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/files/${fileId}/download`)
    .commitAndRecv(GetFileDownloadResponse.decode);

  if (req.isError() || req._result === undefined) return;

  return req._result.url;
}

export const attachFileToSubtask = async (classId: number, projectId: number, taskId: number, subtaskId: number, fileId: number) => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/files/${fileId}/attach`)
    .post()
    .payload(AttachFileRequest.encode, {id: fileId})
    .commit();
}