import { defineStore } from 'pinia';
import { FetchRequest } from '~/scripts/FetchTools';
import type { AppState } from '~/types/AppState';
import { nullSession } from '~/types/Session';

export const useAppStateStore = defineStore({
  id: 'appStateStore',
  state: (): AppState => ({
    showingTitle: true,
    title: "",
    titleI18n: true,
    titleHasIcon: true,
    titleIcon: undefined,
    session: nullSession(),
  }),
  actions: {
    hideTitle(){
      this.showingTitle = false;
    },
    setTitle(title: string, isI18n?: boolean, titleHasIcon?: boolean, titleIcon?: string) {
      this.showingTitle = true;
      this.title = title;
      this.titleI18n = isI18n ?? true;
      this.titleHasIcon = titleHasIcon ?? true;
      this.titleIcon = titleIcon;
    },
    clearSession (){
      this.session = nullSession();
    },
    async signOut() {
      FetchRequest.api("/auth/logout").delete().commit();
      this.clearSession();
    },
    async validateSession() {
      if (this.session === undefined){
        this.clearSession();
        return false;
      }
      const testRes = await FetchRequest.api("/auth/verify").commit();
      if (testRes.isError()){
        this.clearSession();
        return false;
      }
      return true;
    },
    async initSession() {}
  }
})
