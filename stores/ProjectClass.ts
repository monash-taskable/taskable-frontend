import { defineStore } from 'pinia'
import { FetchRequest } from '~/scripts/FetchTools'
import { stringToDate } from '~/scripts/Utils'
import { isRole, type Member, type OwnershipRole, type ProjectClassStore } from '~/types/ProjectClass'
import { AddMembersRequest, AddMembersResponse, GetClassesResponse, GetClassResponse, GetMembersResponse, UpdateMemberRoleRequest } from '~/types/proto/ProjectClass'

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
      getClasses.res(classes => classes.responses.forEach(this.createClassCallback));
    },
    async loadClass(classId: number){
      if (classId === -1 || !(classId in this.projectClasses)){
        return;
      }

      delete this.projectClasses[classId];
      const getClass = await FetchRequest.protectedAPI(`/class/${classId}`).commitAndRecv(GetClassResponse.decode);
      getClass.res(this.createClassCallback);
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
        }))
      }
    },
    async deleteMembersFromClass(classId: number, members: Member[]){
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
    }
  },
})
