<template>
  <div class="dialog-body">
    <div class="content">
      {{ message }}
    </div>
    <div class="action">
      <IconButton v-for="action in actions"
        :caption="action.caption"
        :icon="action.icon"
        :expanding="action.expanding"
        :expanded="action.expanded"
        :styles="action.style"
        @click="() => action.action ? action.action(context, undefined): undefined"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { ButtonStyle } from '~/types/Button';
import type { Dialog, DialogAction } from '~/types/Dialog';

const retryStyle: ButtonStyle = {colorPreset: 'strong', backgroundColor: 'background'};

const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    message: string,
    actions: DialogAction[],
  }>>, required: true},
});

const {message, actions} = props.context.payload;

const tryAgain = () => {
  useDialogs().closeAllDialogs();
  navigateTo("/login");
}

</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Flex.scss";

.dialog-body {
  @include flex-col;
  @include flex-cross(stretch);
}

.content {
  @include typemix-label;
  padding: $space-large;
}

.action {
  @include flex-row;
  @include flex-main(flex-end);
}
</style>