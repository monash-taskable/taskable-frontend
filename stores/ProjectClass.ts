import { defineStore } from 'pinia'
import { FetchRequest } from '~/scripts/FetchTools'
import { stringToDate } from '~/scripts/Utils'
import type { ProjectClassStore } from '~/types/ProjectClass'
import { GetClassesResponse, type GetClassResponse } from '~/types/proto/ProjectClass'

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
        role: projCls.role
      }
    },
    cleanupLocalClasses(){
      this.projectClasses = {};
    },
    async loadClasses(){
      this.cleanupLocalClasses();
      const getClasses = await FetchRequest.protectedAPI("/get-classes").commitAndRecv(GetClassesResponse.decode);
      getClasses.res(classes => classes.responses.forEach(this.createClassCallback));
    }
  },
})
