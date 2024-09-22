import { defineStore } from 'pinia';
import { API, FetchRequest } from '~/scripts/FetchTools';
import { GetCsrfResponse, LoginExchangeResponse } from '~/types/proto/Auth';
import { GetProfileResponse } from '~/types/proto/Profile';
import { isAccentColor, isTheme } from '~/types/Theming';
import { isOfType } from "~/scripts/Utils";
import type { Optional } from '~/types/Optional';

export type Profile = {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
}

export type AppSession = {
  profile: Optional<Profile>;
}

export const nullSession = (): AppSession => ({
  profile: undefined,
});

export type AppState = {
  showingTitle: boolean
  title: string,
  titleHasIcon: boolean,
  titleIcon: Optional<string>,
  session: AppSession,
  sessionLoading: boolean,
  projectId: Optional<number>,
  projectPage: Optional<string>,
  projectMenuState: Boolean,
};

const oAuthProvider = ["Google"] as const;
export type OAuthProvider = typeof oAuthProvider[number];
export const isOAuthProvider = isOfType(oAuthProvider);

export const useAppStateStore = defineStore({
  id: 'appStateStore',
  state: (): AppState => ({
    showingTitle: true,
    title: "",
    titleHasIcon: true,
    titleIcon: undefined,
    session: nullSession(),
    sessionLoading: true,
    projectId: undefined,
    projectPage: undefined,
    projectMenuState: false,
  }),
  actions: {
    hideTitle(){
      this.showingTitle = false;
    },
    setTitle(title: string, titleHasIcon?: boolean, titleIcon?: string) {
      this.showingTitle = true;
      this.title = title;
      this.titleHasIcon = titleHasIcon ?? true;
      this.titleIcon = titleIcon;
      this.projectMenuState = false;
    },
    setProjectTitle(title: string) {
      this.setTitle(title, false, "fluent:clover-20-regular");
      this.projectMenuState = true;
    },
    clearSession (){
      this.session = nullSession();
      this.sessionLoading = true;
    },
    setProject (projectId: number) {
      this.projectId = projectId;
    },
    setProjectPage(projectPage: string) {
      this.projectPage = projectPage;
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
      const appConfig = useAppConfigStore();

      const profileReq = await API.auth.getProfile().commitAndRecv(GetProfileResponse.decode);
      profileReq.res(profilePrt => {
        this.session.profile = {
          id: profilePrt.user!.id,
          firstName: profilePrt.user!.basicInfo!.firstName,
          lastName: profilePrt.user!.basicInfo!.lastName,
          email: profilePrt.user!.basicInfo!.email
        };
        this.sessionLoading = false;

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