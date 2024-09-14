<template>
  <div class="centered">
    <div class="filter" :class="getClass(dialogFlag)"/>
  </div>
</template>

<script lang="ts" setup>
import { API, FetchError, FetchRequest } from '~/scripts/FetchTools';
import type { Optional } from '~/types/Optional';
import { GetCsrfResponse, LoginExchangeRequest, LoginExchangeResponse } from '~/types/proto/Auth';

definePageMeta({ layout: "empty" });

const t = useI18n();
const getClass = (dialog: boolean) => dialog ? "filtered" : "";

// sign in dialog
const dialogFlag = ref(false);
const dialogs = useDialogs();
const openSignInLoadingDialog = () => {
  dialogFlag.value = true;
  return dialogs.getDialog(dialogs.closeAllWithTypeThenOpen({
    title: "taskable",
    titleI18n: true,
    dialogType: "signInLoading",
    payload: undefined,
    width: "300px",
  }, false));
};

const appState = useAppStateStore();
const error = (error: FetchError | Error) => {
  dialogs.closeAllDialogs();
  // timeout is for ux
  setTimeout(()=>{
    dialogs.openDialog({
      dialogType: "signInError",
      payload: error,
      title: "dialogError.somethingWentWrong",
      titleI18n: true,
      width: "350px",
      style: {
        titleBackground: "var(--dangerous-weak)",
        titleColor: "var(--dangerous-strong)",
      }
    }, false)
  }, 200);
}

onMounted(async ()=>{
  dialogs.closeAllDialogs();
  
  const route = useRoute();

  // check if error
  const code = route.query.code as Optional<string>;
  if (route.query.error || code === undefined) {
    dialogFlag.value = true;
    error(new Error());
    return;
  }

  openSignInLoadingDialog();

  // get temp csrf token
  const tempCsrfTokenFetch = await FetchRequest.api(API.auth.getTempCsrf).commitAndRecv(GetCsrfResponse.decode);
  let token = "";
  if (tempCsrfTokenFetch._result !== undefined){
    token = tempCsrfTokenFetch._result.csrfToken;
  }

  // try sign in
  const tokenExchange = await FetchRequest.api(API.auth.loginExchange).post().payload(
    LoginExchangeRequest.encode,
    {authorizationCode: code},
  ).overrideCsrf(token).commitAndRecv(LoginExchangeResponse.decode);
  if (tokenExchange.otherErr(error).httpErr(error).isError()){
    return;
  }
  
  // set global csrf
  tokenExchange.res(csrfMessage => {
    FetchRequest.updateCsrf(csrfMessage.csrfToken);
    location.href = "/";
  })

  appState.validateSession();
})
</script>

<style lang="scss" scoped>

@import "/assets/styles/constants/Flex.scss";

.centered {
  height: 100%;
  background-image: url('/assets/images/MonashBusLoop.png');
  background-size: cover;
}

.filter {
  height: 100%;

  &.filtered{ backdrop-filter: blur(3px) saturate(60%); }
}


</style>