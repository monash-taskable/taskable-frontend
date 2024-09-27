<template>
  <div
    class="selection-provider"
    :class="getClass(uploading, selected)"
    :style="getStyle(uploading)"
    >
    <Button
      :styles="uploading ? uploadingBtn : defaultBtn"
      @click="_onSelect"
    >
      <div class="file-card">
        <div class="icon">
          <Icon name="fluent:document-20-regular" />
        </div>
        <div class="info">
          <div class="file-name">{{ file.filename }}</div>
          <div class="size" v-if="uploading">{{ fBytes(Math.floor(file.size * uploading)) }} / {{ fBytes(file.size) }}</div>
          <div class="size" v-else>{{ fBytes(file.size) }}</div>
        </div>
        <div class="progress"><div class="pulse"/></div>
      </div>
    </Button>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { formatBytes } from '~/scripts/Utils';
import type { SharedFile } from '~/types/Files';
import type { Optional } from '~/types/Optional';

const emits = defineEmits(["select"]);
const props = defineProps({
  file: {type: Object as PropType<SharedFile>, required: true},
  uploading: {type: Number, required: false},
  selected: {type: Boolean, default: false},
});

const defaultBtn = {padding: '0', colorPreset: 'strong', backgroundColor: 'var(--layer-background)'};
const uploadingBtn = {padding: '0'};


// selection logic
const _onSelect = () => {
  if (props.uploading) {
    emits("select", {selection: false})
    return;
  };
  
  emits("select", {selection: !props.selected})
}


const fBytes = (bytes: number) => {
  const formatted = formatBytes(bytes);
  return `${formatted.value} ${formatted.unit}`;
}

const getClass = (uploading: Optional<number>, selected: boolean) => [
  uploading === undefined ? '' : 'uploading',
  selected ? 'selected' : '',
].join(" ");
const getStyle = (uploading: Optional<number>) => uploading === undefined ? '' : `--progress: ${uploading * 100}%`;
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/DefaultStyles.scss";

.selected {
  position: relative;
  outline: 2px solid var(--accent-strong);
}

.file-card {
  @include flex-row;
  @include flex-main(flex-start);
  @include flex-cross(flex-start);
  
  gap: $space-medium;
  padding: $space-medium;
  width: 300px;
  
  .progress {display: none};
  
  .selected & {
    background: var(--accent-weak);
  }
}

.icon, .icon span {
  width: $icon-size-medium;
  height: $icon-size-medium;
  color: var(--foreground);
}

.info {
  @include flex-col;
  @include flex-main(flex-start);
  @include flex-cross(flex-start);

  .file-name { @include typemix-label; }
  .size { @include typemix-label(var(--foreground-weak)); }
}

.uploading .file-card {
  padding: calc($space-medium - 2px);
  border: 2px solid var(--layer-background);
  position: relative;

  .progress {
    display: block;
    position:absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: var(--progress);
    background: var(--accent-intermediate);
    transition: width $def-transition;
    overflow: hidden;
  }
  
  .pulse {
    transition: width $def-transition;
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, transparent 0%, var(--accent-strong) 50%, transparent 100%);
    animation: pulse 1s ease-in-out infinite;
  }
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