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
  classId: Optional<number>,
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
    classId: undefined,
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
    setClass (classId: number) {
      this.classId = classId;
    },
    setProjectPage(projectPage: string) {
      this.projectPage = projectPage;
    },
    loadDebugProfile(){
      this.session.profile = debugProfile;
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

      if (profileReq.isError() || profileReq._result === undefined || profileReq._result.user === undefined) return;
      const profilePrt = profileReq._result.user;

      this.session.profile = {
        id: profilePrt.id,
        firstName: profilePrt.basicInfo!.firstName,
        lastName: profilePrt.basicInfo!.lastName,
        email: profilePrt.basicInfo!.email
      };
      this.sessionLoading = false;

      appConfig.accent = isAccentColor(profilePrt.userSettings!.color) ? profilePrt.userSettings!.color : "blue";
      appConfig.theme = isTheme(profilePrt.userSettings!.theme) ? profilePrt.userSettings!.theme : "light";

      return profilePrt.userSettings!.language;
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
  },
})

const debugProfile: Profile = {
  email: "debugger@example.com",
  firstName: "De",
  lastName: "Bugger",
  id: 1234,
}