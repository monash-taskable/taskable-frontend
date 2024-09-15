import { defineStore } from 'pinia';
import { API, FetchRequest } from '~/scripts/FetchTools';
import type { AppState } from '~/types/AppState';
import { GetCsrfResponse, LoginExchangeResponse } from '~/types/proto/Auth';
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
      API.auth.logout().commit();
      this.clearSession();
    },
    async validateSession() {
      if (this.session === undefined){
        this.clearSession();
        return false;
      }
      const testRes = await API.auth.verify().commit();
      if (testRes.isError()){
        this.clearSession();
        return false;
      }
      return true;
    },
    async initSessionAndCsrf() {
      // get csrf
      const csrfProxy = await API.auth.getCSRF().commitAndRecv(GetCsrfResponse.decode);
      csrfProxy.res(csrfMessage => {
        FetchRequest.updateCsrf(csrfMessage.csrfToken);
      })

      // load profile
      const appState = useAppStateStore();
      const appConfig = useAppConfigStore();

      const profileReq = await API.auth.getProfile().commitAndRecv(GetProfileResponse.decode);
      profileReq.res(profilePrt => {
        appState.session.profile = {
          id: profilePrt.user!.id,
          firstName: profilePrt.user!.basicInfo!.firstName,
          lastName: profilePrt.user!.basicInfo!.lastName,
          email: profilePrt.user!.basicInfo!.email
        };

        appConfig.accent = isAccentColor(profilePrt.user!.userSettings!.color) ? profilePrt.user!.userSettings!.color : "blue";
        appConfig.theme = isTheme(profilePrt.user!.userSettings!.theme) ? profilePrt.user!.userSettings!.theme : "light";
      })
    },
    async signIn(code: string) {
      // get temp csrf token
      const tempCsrfTokenFetch = await API.auth.getTempCsrf().commitAndRecv(GetCsrfResponse.decode);
      let token = "";
      if (tempCsrfTokenFetch._result !== undefined){
        token = tempCsrfTokenFetch._result.csrfToken;
      }

      // try sign in
      const tokenExchange = await API.auth.loginExchange(code, token).commitAndRecv(LoginExchangeResponse.decode);
      if (tokenExchange.isError()){
        return false;
      }

      // set global csrf
      tokenExchange.res(csrfMessage => {
        FetchRequest.updateCsrf(csrfMessage.csrfToken);
      })

      return !tokenExchange.isError();
    }
  }
})