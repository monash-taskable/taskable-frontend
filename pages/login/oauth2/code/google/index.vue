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
const error = () => {
  dialogs.closeAllDialogs();
  // timeout is for ux
  setTimeout(()=>{
    dialogs.openDialog({
      dialogType: "signInError",
      payload: undefined,
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
    error();
    return;
  }

  openSignInLoadingDialog();
  
  const appState = useAppStateStore();
  if (await appState.signIn(code)) {
    location.href = "/";
  }
  else {
    error();
  }

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