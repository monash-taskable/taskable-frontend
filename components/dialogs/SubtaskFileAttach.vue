<template>
  <div class="file-select-root">
    <FileUpload @change="fileDrop" :caption="$t('projects.batchCreate.chooseFilePrompt')"/>

    <span v-if="files.length !== 0">{{ $t('projects.sharedFiles.selectFile') }}</span>

    <div class="files">
      <Button
        v-for="file in files"
        :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)'}"
        :caption="file.filename"
        @click="() => onFileSelect(file, props.context.id)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Dialog } from '~/types/Dialog';
import type { SharedFile } from '~/types/Files';

const emits = defineEmits(["emit"]);
const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    files: SharedFile[],
    onFileDrop: (f: File, ctxId: string) => void
    onFileSelect: (f: SharedFile, ctxId: string) => void
  }>>, required: true}
})

const {files, onFileDrop, onFileSelect} = props.context.payload;

const fileDrop = ({file}: {file: File}) => onFileDrop(file, props.context.id);

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Flex.scss";

.file-select-root {
  @include flex-col;
  @include flex-cross(flex-start);
  @include flex-main(stretch);
  
  gap: $space-medium;
  padding: $space-large;

  :deep(.file-upload) {
    width: 100%;
  }
}

.files {
  width: 100%;
  
  &:deep(button) {
    width: 100%;
  }
}
</style>