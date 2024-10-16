<template>
  <div class="dialog-body">
    <div class="error-body">
      <VueMarkdown :source="message"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import VueMarkdown from 'vue-markdown-render';
import type { Dialog } from '~/types/Dialog';

const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    message: string
  }>>, required: true},
});

const { message } = props.context.payload;
</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

.error-body {
  @include typemix-label;

  padding: $space-large $space-extra;
  height: var(--height);

  p {
    margin: 0;
  }
  
}

.actions {
  @include flex-row;
  @include flex-main(flex-end);

  width: 100%;
}
</style>