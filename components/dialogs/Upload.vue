<template>
  <div class="dialog-root">
    <FileUpload @change="_onChange" :caption="caption"/>
  </div>
</template>

<script lang="ts" setup>
import type { Dialog } from '~/types/Dialog';

const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    caption: string,
    onUpload: (c: Dialog<any>, file: File) => any,
  }>>, required: true},
});

const {caption, onUpload} = props.context.payload;

const _onChange = ({file}: {file: File}) => onUpload(props.context, file);
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";

.dialog-root {
  padding: $space-large;
  height: 300px;

  :deep(.file-upload) {
    height: 300px;
  }
}
</style>