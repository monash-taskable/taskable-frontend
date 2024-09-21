<template>
  <div class="dialog-overlay" :class="hasDialogs(dialogControllerRef.dialogs.value)">
    <Dialog v-for="dialog in dialogControllerRef.dialogs.value" :context="dialog"/>
  </div>
</template>

<script lang="ts" setup>
import type { Dialog } from '~/types/Dialog';

const dialogControllerRef = storeToRefs(useDialogs());

const hasDialogs = (dialogs: {[key: string]: Dialog<any>}) => Object.entries(dialogs).length > 0 ? "has-dialog" : "";
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";

.dialog-overlay {
  @include flex-row;
  @include flex-main(center);
  @include flex-cross(center);

  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 2000;

  pointer-events: none;
}

.has-dialog {
  background-color: var(--popup-overlay);
  pointer-events: all;
}

</style>