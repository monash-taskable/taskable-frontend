<template>
  <div class="page-root">
    <DateTimeFormat :datetime="new Date()" format="time-only"/>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "empty",
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