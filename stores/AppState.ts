import { defineStore } from 'pinia'
import { postAndDecode } from '~/scripts/FetchTools';
import type { AppState, OAuthProvider } from '~/types/AppState'
import { ReqAuth, ResAuth } from '~/types/proto/Auth';

export const useAppStateStore = defineStore({
  id: 'appStateStore',
  state: (): AppState => ({
    showingTitle: true,
    title: "",
    titleI18n: true,
    titleHasIcon: true,
    titleIcon: undefined,
    session: undefined,
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
    sessionClear(){

    },
    sessionInit(){
      const currSession = localStorage.getItem("sessionid");

      if (currSession !== null) {
        this.session = currSession;
      }
    },
    async signin(oAuthCode: string, provider: OAuthProvider){
      try {
        const session = await postAndDecode("http://192.168.198.45:8080/api/auth/token", ReqAuth.encode, {authorizationCode: oAuthCode}, ResAuth.decode);
      } catch (e) {
        console.log(e);
      }

    },
    signout() {},
    validateSession() {}
  }
})
