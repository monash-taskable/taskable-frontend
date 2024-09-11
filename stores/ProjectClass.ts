import { defineStore } from 'pinia'
import { FetchRequest } from '~/scripts/FetchTools'
import { stringToDate } from '~/scripts/Utils'
import { isRole, type ProjectClassStore } from '~/types/ProjectClass'
import { GetClassesResponse, GetMembersResponse, type GetClassResponse } from '~/types/proto/ProjectClass'

export const useProjectClassStore = defineStore({
  id: 'projectClassStore',
  state: (): ProjectClassStore => ({
    projectClasses: {}
  }),
  actions: {
    createClassCallback(projCls: GetClassResponse){
      this.projectClasses[projCls.id] = {
        classId: projCls.id,
        archived: projCls.archived,
        createdAt: stringToDate(projCls.createdAt),
        description: projCls.classDesc,
        name: projCls.className,
        projects: [],
        role: "OWNER",
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
    async loadMembers(classId: number){
      if (!(classId in this.projectClasses)){
        return;
      }
      const memberReq = await FetchRequest.protectedAPI(`/classes/${classId}/members`).commitAndRecv(GetMembersResponse.decode);
      if (!memberReq.isError() && memberReq._result){
        this.projectClasses[classId].members = memberReq._result?.classMembers.map(memberProto => ({
          id: memberProto.id,
          name: [memberProto.firstName, memberProto.lastName].join(" ").trim(),
          role: (isRole(memberProto.role)) ? memberProto.role : "STUDENT",
        }))
      }
    }
  },
})
