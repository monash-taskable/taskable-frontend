<template>
  <div class="centered">
    <div class="filter" :class="getClass(dialogFlag)">
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {ButtonStyle } from '~/types/Button';

definePageMeta({ layout: "empty" });

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
  dialogs.closeAllWithTypeThenOpen({
    title: "taskable",
    titleI18n: true,
    dialogType: "signIn",
    payload: undefined,
    width: "400px",
  }, false);
};
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

openSignInLoadingDialog();

onMounted(async ()=>{
  if (await appState.validateSession()){
    location.href = "/";
    return
  }
  setTimeout(async () => {
    useDialogs().closeAllDialogs();
  }, 200);
  setTimeout(() => openSigninDialog(), 400);
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