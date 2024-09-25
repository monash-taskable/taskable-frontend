import { AssignMultipleToSubtaskRequest, CreateCommentRequest, CreateCommentResponse, CreateSubtaskRequest, CreateSubtaskResponse, CreateTaskRequest, CreateTaskResponse, GetCommentResponse, GetCommentsResponse, GetSubtaskResponse, GetSubtasksResponse, GetTaskResponse, GetTasksResponse, UpdateCommentRequest, UpdateSubtaskRequest, UpdateTaskRequest } from "~/types/proto/Task"
import { FetchRequest } from "./FetchTools"
import { isPriority, isTaskColor, isTaskStatus, type Comment, type Member, type Priority, type Subtask, type Task, type TaskColor, type TaskStatus } from "~/types/ProjectClass"
import type { Optional } from "~/types/Optional";
import { findInList, ident } from "./Utils";
import { loadClassIfNotExist } from "./ProjectClassesFetches";
import { dateToString, stringToDate } from "./Datetime";

export const createTask = async (classId: number, projectId: number, title: string, description: string, color?: TaskColor) => {
  const req = await FetchRequest
  .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/create`)
  .post()
  .payload(CreateTaskRequest.encode, {title, description, color: color ?? 'blue'})
  .commitAndRecv(CreateTaskResponse.decode);
  
  if (!req.isError() && req._result){
    return req._result.id;
  }
}
  
export const getTask = async (classId: number, projectId: number, taskId: number): Promise<Optional<Task>> => {
  const req = await FetchRequest
  .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}`)
  .commitAndRecv(GetTaskResponse.decode);
  
  if (!req.isError() && req._result && req._result.task) {
    const {color, description, id, title} = req._result.task;
    return {
      description, id, title,
      color: isTaskColor(color) ? color : "blue",
    }
  }
}

export const getTasks = async (classId: number, projectId: number): Promise<Task[]> => {
  const req = await FetchRequest
  .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks`)
  .commitAndRecv(GetTasksResponse.decode);
  
  if (!req.isError() && req._result && req._result.tasks) 
    return req._result.tasks.map(({color, description, id, title}) => ({
      description, id, title,
      color: isTaskColor(color) ? color : "blue",
    }))

  return []
}

export const updateTask = async (classId: number, projectId: number, taskId: number,
  data: {title?: string, description?: string, color?: TaskColor}
) => {  
await FetchRequest
  .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/update`)
  .post()
  .payload(UpdateTaskRequest.encode, data)
  .commit();
}
  
export const deleteTask = async (classId: number, projectId: number, taskId: number) => {
  await FetchRequest
  .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/delete`)
  .delete()
  .commit();
}

export const createSubtask = async (classId: number, projectId: number, taskId: number, 
  title: string, description: string, status: TaskStatus, priority: Priority, start: Date, end: Date
) => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/create`)
    .post()
    .payload(CreateSubtaskRequest.encode, {
      title, description, status, priority,
      start: dateToString(start),
      end: dateToString(end),
    })
    .commitAndRecv(CreateSubtaskResponse.decode);

  if (!req.isError() && req._result) return req._result.id;
}

export const getSubtask = async (classId: number, projectId: number, task: Task, subtaskId: number): Promise<Optional<Subtask>> => {
  await loadClassIfNotExist(classId);
  const pc = useProjectClassStore();
  
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${task.id}/subtasks/${subtaskId}`)
    .commitAndRecv(GetSubtaskResponse.decode);

  if (req._result === undefined) return undefined;
  if (req.isError() || req._result.subtask === undefined) return undefined;
    
  const { description, end, id, priority, start, status, title } = req._result.subtask;
  const assigneeIds = req._result.assigneeIds;
  const assignment: Member[] = pc.projectClasses[classId].members.filter(m => assigneeIds.includes(m.id));
  
  return {
    assignment, description, id, task, title,
    priority: isPriority(priority) ? priority : 'non-urgent',
    status: isTaskStatus(status) ? status : 'unassigned',
    end: stringToDate(end),
    start: stringToDate(start),
  }
}

export const getSubtasks = async (classId: number, projectId: number, task: Task): Promise<Subtask[]> => {
  await loadClassIfNotExist(classId);
  const pc = useProjectClassStore();

  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${task.id}/subtasks`)
    .commitAndRecv(GetSubtasksResponse.decode);
  
  if (req.isError() || req._result === undefined || req._result.subtaskResponses === undefined) return [];

  const result: Subtask[] = [];
  for (const {assigneeIds, subtask} of req._result.subtaskResponses){
    if (subtask === undefined) continue;

    const {description, id, title, priority, status, end, start} = subtask;
    const assignment: Member[] = pc.projectClasses[classId].members.filter(m => assigneeIds.includes(m.id));

    result.push({
      assignment, description, id, task, title,
      priority: isPriority(priority) ? priority : 'non-urgent',
      status: isTaskStatus(status) ? status : 'unassigned',
      end: stringToDate(end),
      start: stringToDate(start),
    });
  }

  return result;
}

export const updateSubtask = async (classId: number, projectId: number, taskId: number, subtaskId: number,
  data: {taskId: number, title: string, description: string, status: TaskStatus, priority: Priority, start: Date, end: Date}
) => {
  await FetchRequest
  .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/update`)
  .post()
  .payload(UpdateSubtaskRequest.encode, {
    description: data.description, 
    end: dateToString(data.end),
    priority: data.priority,
    start: dateToString(data.start),
    status: data.status,
    taskId: data.taskId,
    title: data.title,
  })
  .commit();
}

export const deleteSubtask = async (classId: number, projectId: number, taskId: number, subtaskId: number) => {
  await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/delete`)
    .delete().commit();
}

export const createComment = async (classId: number, projectId: number, taskId: number, subtaskId: number,
  comment: string, createdAt: Date
) => {
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/comments/create`)
    .post()
    .payload(CreateCommentRequest.encode, {comment, createdDate: dateToString(createdAt)})
    .commitAndRecv(CreateCommentResponse.decode);

  if (!req.isError() && req._result) return req._result.id;
}

export const getComment = async (classId: number, projectId: number, taskId: number, subtaskId: number, commentId: number): Promise<Optional<Comment>> => {
  await loadClassIfNotExist(classId);
  const pc = useProjectClassStore();
  
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/comments/${commentId}`)
    .commitAndRecv(GetCommentResponse.decode);

  if (req.isError() || req._result === undefined || req._result.comment === undefined) return undefined;

  const {comment, createdDate, id, userId} = req._result.comment;
  
  return {
    comment, id,
    author: findInList(pc.projectClasses[classId].members, m => m.id === userId, ident)!,
    created: stringToDate(createdDate),
  }
}

export const getComments = async (classId: number, projectId: number, taskId: number, subtaskId: number): Promise<Comment[]>  => {
  await loadClassIfNotExist(classId);
  const pc = useProjectClassStore();
  
  const req = await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/comments`)
    .commitAndRecv(GetCommentsResponse.decode);
    
    if (req.isError() || req._result === undefined || req._result.comments === undefined) return [];
    
    return req._result.comments.map(({comment, id, createdDate, userId}) => ({
      comment, id,
      author: findInList(pc.projectClasses[classId].members, m => m.id === userId, ident)!,
      created: stringToDate(createdDate),
    }));
  }

export const updateComments = async (classId: number, projectId: number, taskId: number, subtaskId: number, commentId: number, comment: string) => {
  await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/comments/${commentId}/update`)
    .post()
    .payload(UpdateCommentRequest.encode, { comment })
    .commit();
}

export const deleteComments = async (classId: number, projectId: number, taskId: number, subtaskId: number, commentId: number
) => {
  await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/comments/${commentId}/delete`)
    .delete().commit();
}

export const assignToSubtask = async (classId: number, projectId: number, taskId: number, subtaskId: number, memberIds: number[]) => {
  await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/assign`)
    .post()
    .payload(AssignMultipleToSubtaskRequest.encode, {userIds: memberIds})
    .commit()
}

export const unassignToSubtask = async (classId: number, projectId: number, taskId: number, subtaskId: number, memberIds: number[]) => {
  await FetchRequest
    .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/unassign`)
    .post()
    .payload(AssignMultipleToSubtaskRequest.encode, {userIds: memberIds})
    .commit()
}

export const markAllSubtasksAs = async (classId: number, projectId: number, taskId: number) => {
  await FetchRequest
  .protectedAPI(`/classes/${classId}/projects/${projectId}/tasks/${taskId}/subtasks/mark-all-as-done`)
  .post()
  .commit()
}