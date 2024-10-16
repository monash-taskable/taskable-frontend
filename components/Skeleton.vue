<template>
  <span class="skeleton" :class="getClass(props.fill, props.size)" :style="getStyle(props.fill, props.width)"/>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';

const props = defineProps({
  fill: {type: Boolean, default: false},
  size: {type: String as PropType<"label" | "title">, default: "label"},
  width: {type: String, default: "100px"}
});

const getClass = (fill: boolean, size: string) => fill ? "fill" : size;
const getStyle = (fill: boolean, width: string) => fill ? "" : `width: ${width};`;
</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Typography.scss";

.skeleton {
  display: inline-block;
  background: var(--skeleton-base);
  position: relative;
  overflow: hidden;
  vertical-align: baseline;

  &.fill {
    width: 100%;
    height: 100%;
  }

  &.label { height: $typesize-default; }
  &.title { height: $typesize-largest; }
}

.skeleton::before {
  content: '';
  display: block;
  height: 100%;
  width: 100%;
  background: var(--skeleton-pulse);
  position: absolute;
  top: 0;
  left: 0;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>