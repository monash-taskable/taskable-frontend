<template>
  <div class="dialog-body">
    <div class="error-body">
      {{ props.context.payload }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Dialog } from '~/types/Dialog';

const props = defineProps({
  context: {type: Object as PropType<Dialog<string>>, required: true},
});

const dialogs = useDialogs();

</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

.error-body {
  @include typemix-label;

  padding: $space-medium;
  height: var(--height);
}

.actions {
  @include flex-row;
  @include flex-main(flex-end);

  width: 100%;
}
</style>