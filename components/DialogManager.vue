<template>
  <div class="dialog-overlay">
    <Dialog v-for="dialog in dialogControllerRef.dialogs.value" :context="dialog"/>
  </div>
</template>

<script lang="ts" setup>
const dialogControllerRef = storeToRefs(useDialogs());
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

</style>