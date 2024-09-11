import { defineStore } from 'pinia';
import { FetchRequest } from '~/scripts/FetchTools';
import type { AppState } from '~/types/AppState';
import { GetCsrfResponse } from '~/types/proto/Auth';
import { GetProfileResponse } from '~/types/proto/Profile';
import { nullSession } from '~/types/Session';
import { isAccentColor, isTheme } from '~/types/Theming';

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
    async initSessionAndCsrf() {
      // get csrf
      const csrfProxy = await FetchRequest.api("/auth/get-csrf").commitAndRecv(GetCsrfResponse.decode);
      csrfProxy.res(csrfMessage => {
        FetchRequest.updateCsrf(csrfMessage.csrfToken);
      })

      // load profile
      const appState = useAppStateStore();
      const appConfig = useAppConfigStore();

      const profileReq = await FetchRequest.protectedAPI("/user/get-profile").commitAndRecv(GetProfileResponse.decode);
      profileReq.res(profilePrt => {
        appState.session.profile = {
          id: profilePrt.id,
          firstName: profilePrt.firstName,
          lastName: profilePrt.lastName,
          email: profilePrt.email
        };

        appConfig.accent = isAccentColor(profilePrt.color) ? profilePrt.color : "blue";
        appConfig.theme = isTheme(profilePrt.theme) ? profilePrt.theme : "light";
      })
    }
  }
})