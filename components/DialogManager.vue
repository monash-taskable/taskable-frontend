<template>
  <div class="dialog-overlay">
    <Dialog v-for="dialog in dialogControllerRef.dialogs.value" :context="dialog"/>
  </div>
</template>

<script lang="ts" setup>
const dialogControllerRef = storeToRefs(useDialogs());
</script>

<style lang="scss" scoped>

.dialog-overlay {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 2000;

  pointer-events: none;
}

</style>