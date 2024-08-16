<template>
  <div class="page-root">
    <IconButton @click="debug" :styles="{colorPreset: 'layer'}" caption="debug"/>
  </div>
</template>

<script lang="ts" setup>
import { quickError, type DialogInit } from '~/types/Dialog';

const dialog = useDialogs();

const debug = () => {
  quickError("something went wrong!")
}
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