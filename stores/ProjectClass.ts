import { defineStore } from 'pinia'
import { getCurrentGMTDateTime, stringToDate } from '~/scripts/Datetime'
import { FetchRequest } from '~/scripts/FetchTools'
import { findInList, ident, listRemove } from '~/scripts/Utils'
import { isRole, type Member, type OwnershipRole, type ProjectClass, type ProjectClassStore, type Template, type Project } from '~/types/ProjectClass'
import { AddMembersRequest, AddMembersResponse, CreateProjectRequest, CreateProjectResponse, CreateTemplateRequest, CreateTemplateResponse, GetClassesResponse, GetClassResponse, GetMembersResponse, GetProjectResponse, GetProjectsResponse, GetTemplateResponse, GetTemplatesResponse, Template as TemplateProto, UpdateClassRequest, UpdateMemberRoleRequest, UpdateTemplateRequest } from '~/types/proto/ProjectClass'

export const useProjectClassStore = defineStore({
  id: 'projectClassStore',
  state: (): ProjectClassStore => ({
    projectClasses: {}
  }),
  actions: {
    createClassCallback(projCls: GetClassResponse){
      this.projectClasses[projCls.classroom!.id] = {
        classId: projCls.classroom!.id,
        archived: projCls.classroom!.archived,
        createdAt: stringToDate(projCls.classroom!.createdAt),
        description: projCls.classroom!.description,
        name: projCls.classroom!.name,
        projects: [],
        role: isRole(projCls.role) ? projCls.role : "STUDENT",
        members: [],
        templates: []
      }
    },
    cleanupLocalClasses(){
      this.projectClasses = {};
    },
    async loadClasses(){
      this.cleanupLocalClasses();
      const getClasses = await FetchRequest.protectedAPI("/classes").commitAndRecv(GetClassesResponse.decode);
      getClasses.res(classes => {
        classes.responses.forEach(res => {
          this.createClassCallback(res);
          if (res.classroom){
            this.loadTemplates(res.classroom.id);
            this.loadProjects(res.classroom.id);
          }
        })
      });
    },
    async loadClass(classId: number){
      if (classId === -1){
        return;
      }

      delete this.projectClasses[classId];
      const getClass = await FetchRequest
        .protectedAPI(`/classes/${classId}`)
        .commitAndRecv(GetClassResponse.decode);
      
      getClass.res(this.createClassCallback);

      if (getClass.isError()){
        return false;
      }
      
      await this.loadMembers(classId);
      await this.loadProjects(classId);

      return true;
    },
    async loadMembers(classId: number){
      if (classId === -1 || !(classId in this.projectClasses)){
        return;
      }

      const memberReq = await FetchRequest.protectedAPI(`/classes/${classId}/members`).commitAndRecv(GetMembersResponse.decode);
      if (!memberReq.isError() && memberReq._result){
        this.projectClasses[classId].members = memberReq._result?.classMembers.map(memberProto => ({
          id: memberProto.id,
          name: [memberProto.basicInfo!.firstName, memberProto.basicInfo!.lastName].join(" ").trim(),
          role: (isRole(memberProto.role)) ? memberProto.role : "STUDENT",
          email: memberProto.basicInfo!.email,
        }))
      }
    },
    async loadTemplates(classId: number) {
      const req = await FetchRequest
        .protectedAPI(`/classes/${classId}/templates`)
        .commitAndRecv(GetTemplatesResponse.decode);
      
        req.res(templateRes => {
          this.projectClasses[classId].templates = templateRes.templates.map(({archived, description, id, name}): Template => ({
            archived, description, name,
            templateId: id
          }));
        });
    },
    async loadTemplate(classId: number, templateId: number) {
      const req = await FetchRequest
        .protectedAPI(`/classes/${classId}/templates/${templateId}`)
        .commitAndRecv(GetTemplateResponse.decode);
      
      req.res(({template}) => {
        if (!template) return;

        const old = findInList(this.projectClasses[classId].templates, t => t.templateId === templateId, ident);
        if (old !== undefined) {
          listRemove(this.projectClasses[classId].templates, old);
        }

        const {archived, name, description, id} = template;

        this.projectClasses[classId].templates.push({ archived, name, description, templateId: id })
      })
    },
    async loadProjects(classId: number) {
      await this.loadTemplates(classId);

      const req = await FetchRequest
        .protectedAPI(`/classes/${classId}/projects`)
        .commitAndRecv(GetProjectsResponse.decode);

      req.res(projRes => {
        this.projectClasses[classId].projects = projRes.projects.map(({description, id, title, archived, templateId}): Project => ({
          projectId: id,
          name: title,
          description: description,
          archived: archived,
          template: templateId === undefined ? undefined 
            : findInList(this.projectClasses[classId].templates, t => t.templateId === templateId, ident)
        }))
      });
    },
    async loadProject(classId: number, projectId: number) {
      await this.loadTemplates(classId);
      
      const old = findInList(this.projectClasses[classId].projects, p => p.projectId === projectId, ident);
      if (old) listRemove(this.projectClasses[classId].projects, old);

      const req = await FetchRequest
        .protectedAPI(`/classes/${classId}/projects/${projectId}`)
        .commitAndRecv(GetProjectResponse.decode);

      req.res(({project}) => {
        if (!project) return;
        
        this.projectClasses[classId].projects.push({
          projectId: project.id,
          name: project.title,
          description: project.description,
          archived: project.archived,
          template: project.templateId === undefined ? undefined 
            : findInList(this.projectClasses[classId].templates, t => t.templateId === project.templateId, ident)
        })
      })
    },
    setLocalClass(projCls: ProjectClass) {
      this.projectClasses[projCls.classId] = projCls;
    },
    async deleteMembersFromClass(classId: number, members: Member[]){
      if (!(classId in this.projectClasses)) return[];

      const mids = members.filter(_m => _m.role !== "OWNER").map(m => m.id);
      mids.forEach(id => {
        console.log(`/classes/${classId}/members/${id}/delete`);
        FetchRequest.protectedAPI(`/classes/${classId}/members/${id}/delete`).delete().commit();
      })
      this.projectClasses[classId].members = this.projectClasses[classId].members.filter(
        (_m: Member) => !mids.includes(_m.id)
      )
    },
    async addMembersToClass(classId: number, emails: string[]): Promise<string[]>{
      if (!(classId in this.projectClasses)) return [];

      const memberAddReq = await FetchRequest
      .protectedAPI(`/classes/${classId}/members/add`)
      .post()
      .payload(AddMembersRequest.encode, {userEmails: emails})
      .commitAndRecv(AddMembersResponse.decode);

      await this.loadMembers(classId);
      let result: string[] = [];
      memberAddReq.res(({invalidEmails}) => {
        result = invalidEmails;
      });

      return result;
    },
    async updateClassMembersRole(classId: number, members: Member[], role: OwnershipRole){
      if (!(classId in this.projectClasses)) return;

      for (const member of members) {
        const req = await FetchRequest
          .protectedAPI(`/classes/${classId}/members/${member.id}/update-role`)
          .payload(UpdateMemberRoleRequest.encode, { role })
          .post()
          .commit();
        
        if (req.isError()) continue;
        if (req._response && (await req._response.text()) !== "true") continue;
    
      }
      
      this.loadMembers(classId);
    },
    async deleteClass(classId: number){
      if (!(classId in this.projectClasses)) return;
      const req = await FetchRequest.protectedAPI(`/classes/${classId}/delete`).delete().commit();
      if (!req.isError()){
        delete this.projectClasses[classId];
      }
    },
    async updateClass(classId: number, className?: string, archived?: boolean){
      if (!(classId in this.projectClasses)) return;
      if (className === undefined && archived === undefined) return;
      
      const req = await FetchRequest
        .protectedAPI(`/classes/${classId}/update`)
        .post()
        .payload(UpdateClassRequest.encode, {
          archived, className,
          classDesc: undefined,
        })
        .commit();

      if (!req.isError()){
        if(className) this.projectClasses[classId].name = className;
        if(archived) this.projectClasses[classId].archived = archived;
      }
    },
    async addTemplate(classId: number, templateName: string) {
      const req = await FetchRequest
        .protectedAPI(`/classes/${classId}/templates/create`)
        .post()
        .payload(CreateTemplateRequest.encode, {name: templateName})
        .commitAndRecv(CreateTemplateResponse.decode);

      req.res(async ({id}) => await this.loadTemplate(classId, id));
    },
    async updateTemplate(classId: number, templateId: number, name?: string, description?: string, archived?: boolean) {
      await FetchRequest
        .protectedAPI(`/classes/${classId}/templates/${templateId}/update`)
        .post()
        .payload(UpdateTemplateRequest.encode, {archived, name, description})
        .commit();
    },
    async deleteTemplate(classId: number, templateId: number) {
      await FetchRequest
        .protectedAPI(`/classes/${classId}/templates/${templateId}/delete`)
        .delete()
        .commit();
    },
    async createSingleProjectFromTemplate(classId: number, templateId: number, name: string) {
      const req = await FetchRequest
        .protectedAPI(`/classes/${classId}/templates/${templateId}/create-single`)
        .post()
        .payload(CreateProjectRequest.encode, { name, createdAt: getCurrentGMTDateTime() })
        .commitAndRecv(CreateProjectResponse.decode);

      if (!req.isError() && req._result){
        this.loadProject(classId, req._result.id);
        return req._result.id;
      }
    },
  },
})
