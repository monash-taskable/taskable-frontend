<template>
  <div class="page-root">

  </div>
</template>

<script lang="ts" setup>
import { FetchRequest } from '~/scripts/FetchTools';

definePageMeta({
  layout: "empty",
})

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";

.page-root{
  @include flex-row;
  @include flex-main(center);
  @include flex-cross(center);
  
  height: 80vh;
  width: 100vw;
}
</style>