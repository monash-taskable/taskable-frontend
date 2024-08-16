import { defineStore } from 'pinia'
import type { ProjectClassStore } from '~/types/ProjectClass'

export const useProjectClassStore = defineStore({
  id: 'projectClassStore',
  state: (): ProjectClassStore => ({
    projectClasses: []
  }),
  actions: {
    
  }
})
