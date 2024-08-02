<template>
  <div class="centered">
    <IconButton :styles="buttonStyle" :caption="$t('signin.signin')"/>
  </div>
</template>

<script lang="ts" setup>
import type {ButtonStyle } from '~/types/ButtonStyle';

const t = useI18n();

const buttonStyle: ButtonStyle = {
  colorPreset: "layer",
  size: "large"
};
</script>

<style lang="scss" scoped>

@import "/assets/styles/constants/Flex.scss";

.centered {
  @include flex-col;
  @include flex-cross(center);
  @include flex-main(center);
  height: calc(100% - 100px);
}


</style>