<template>
  <div class="page-root">
    <IconButton @click="debug"/>
  </div>
</template>

<script lang="ts" setup>
import { defaultClose, type DialogAction } from '~/types/Dialog';

definePageMeta({
  layout: "empty",
})

const debug = () => useDialogs().closeAllWithTypeThenOpen({
  dialogType: "optionsAlert",
  payload: {
    message: "Hello world",
    actions: <DialogAction[]>[
      {
        caption: "hi",
        style: {colorPreset: 'accent-strong'},
        action: console.log,
      },
    ]
  },
  close: defaultClose,
  title: "hi",
  width: "300px",
})
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";

.page-root{
  @include flex-col;
  @include flex-main(center);
  @include flex-cross(flex-start);

  height: 80vh;
  width: 100vw;

  background: var(--background);
}
</style>