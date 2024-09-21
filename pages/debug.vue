<template>
  <div class="page-root">
    <ProjectNavigation :project-id="1234" selected="1"/>
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
  @include flex-cross(flex-start);

  height: 80vh;
  width: 100vw;

  background: var(--background);
}
</style>