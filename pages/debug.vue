<template>
  <div class="page-root">
    <IconButton caption="error" @click="x" :styles="{colorPreset:'accent-strong'}"/>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "empty",
})

const x = () => useDialogs().closeAllWithTypeThenOpen({
  dialogType: "sessionError",
  title: "x",
  width: "122",
  payload: undefined,
})
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";

.page-root{
  @include flex-col;
  @include flex-main(center);
  @include flex-cross(center);

  height: 80vh;
  width: 100vw;
}
</style>