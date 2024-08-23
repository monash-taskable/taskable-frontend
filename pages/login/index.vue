<template>
  <div class="centered">
    <div class="filter" :class="getClass(dialogFlag)">
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {ButtonStyle } from '~/types/ButtonStyle';

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
  dialogs.closeAllWithTypeThenOpen({
    title: "taskable",
    titleI18n: true,
    dialogType: "signIn",
    payload: undefined,
    width: "400px",
  }, false);
};

onMounted(()=>{
  openSigninDialog();
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