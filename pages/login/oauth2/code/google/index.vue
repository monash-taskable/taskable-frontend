<template>
  <div class="centered">
    <div class="filter" :class="getClass(dialogFlag)">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { api, FetchError, postAndDecode } from '~/scripts/FetchTools';
import type {ButtonStyle } from '~/types/ButtonStyle';
import { quickError } from '~/types/Dialog';
import type { Optional } from '~/types/Optional';
import { ReqAuth, ResAuth } from '~/types/proto/Auth';

definePageMeta({ layout: "empty" });

const t = useI18n();

const buttonStyle: ButtonStyle = {
  colorPreset: "layer",
  size: "large"
};

const getClass = (dialog: boolean) => dialog ? "filtered" : "";

// signin dialog
const dialogFlag = ref(false);
const dialogs = useDialogs();
const openSigninDialog = () => {
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
  appState.signout();

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
  
  const signinLoading = openSigninDialog();

  // try sign in
  const code = useRoute().query.code as Optional<string>;

  if (code === undefined) {
    return;
  }

  const tokenExchange = await postAndDecode(
    api("/auth/token"),
    ReqAuth.encode,
    {authorizationCode: code},
    ResAuth.decode
  );

  tokenExchange.otherErr(error).httpErr(error).res((result) => {
    dialogs.closeAllWithType("signInLoading");
    // sign in code here
  });
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