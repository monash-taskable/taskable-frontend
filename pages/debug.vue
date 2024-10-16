<template>
  <div class="page-root">
    <IconButton @click="debug"/>
  </div>
</template>

<script lang="ts" setup>
import { FetchRequest } from '~/scripts/FetchTools';

definePageMeta({
  layout: "empty",
})

const debug = () => {
  FetchRequest.api('/classes/1/projects/3/tasks/16').commit();
}
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";

.page-root{
  @include flex-col;
  @include flex-main(center);
  @include flex-cross(center);

  height: 80vh;
  width: 100vw;

  background: var(--background);
}
</style>