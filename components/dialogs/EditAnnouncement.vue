<template>
  <div class="editor-root">
    <div class="group">
      <h3>{{ $t('projects.announcements.title') }}</h3>
      <TextInput v-model="title" :value="_title" :styles="{colorPreset: 'layer'}" @keydown="emitValue" @change="emitValue"/>
    </div>
    <div class="editor">
      <div class="group">
        <h3>{{ $t('projects.announcements.content') }}</h3>
        <Multiline v-model="content" :value="_content" :styles="{colorPreset: 'layer', height: '270px'}" @keydown="emitValue" @change="emitValue"/>
      </div>
      <div class="group">
        <h3>{{ $t('projects.announcements.preview') }}</h3>
        <div class="preview">
          <VueMarkdown :source="content"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import VueMarkdown from 'vue-markdown-render';
import type { Dialog } from '~/types/Dialog';

const emit = defineEmits(["emit"]);
const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    title: string,
    content: string,
  }>>, required: true},
});

const { title: _title, content: _content } = props.context.payload;

const title = ref(_title);
const content = ref(_content);

const emitValue = () => {
  emit("emit", {
    title: title.value,
    content: content.value,
  });
}
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";

.editor-root {
  @include flex-col();
  @include flex-cross(stretch);
  @include flex-main(flex-start);

  gap: $space-large;
  padding: $space-large;
}

.editor {
  @include flex-row();
  @include flex-cross(stretch);
  
  gap: $space-large;
  height: 300px;
  
  &>.group { flex: 1; }
}


.group {
  @include flex-col();
  @include flex-cross(stretch);
  @include flex-main(flex-start);
  
  gap: $space-medium;
}

h3 {
  @include typemix-label;
  margin: 0;
}

.preview {
  background: var(--layer-background);
  height: 270px;
  overflow-y: auto;
  padding: $space-medium;
  
  ::v-deep {
    * {
      @include typemix-label;
      margin: 0;
      margin-bottom: $space-medium;
    }

    h1 {
      @include typemix-title;
    }
    
    h2 {
      @include typemix-header;
    }
    
    h3, strong {
      font-weight: 500;
    }
    
    a {
      color: var(--accent-strong);
      &:hover {
        background: var(--accent-weak);
      }
    }
  }
}
</style>