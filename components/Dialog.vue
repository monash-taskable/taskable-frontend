<template>
  <div :style="getStyle(props.context)" class="dialog">
    <div class="title">
      <div class="left" @mousedown="dragOn" @mouseup="dragOff" @mousemove="onDrag" @mouseleave="dragOff">
        <Icon name="fluent:re-order-dots-vertical-20-regular"/>
        {{ (context.title === "@@UUID") ? context.id : (context.titleI18n ? $t(context.title) : context.title) }}
      </div>
      <div class="right">
        <IconButton 
          v-for="action in context.actions"
          @click="action.action"
          expanding
          :styles="action.style" 
          :icon="action.icon" 
          :caption="action.captionI18n 
            ? $t(action.caption) 
            : action.caption"/>

        <IconButton 
          v-if="context.close !== undefined"
          @click="closeDialog"
          expanding
          :styles="context.close.style" 
          :icon="context.close.icon" 
          :caption="context.close.captionI18n 
            ? $t(context.close.caption) 
            : context.close.caption"/>
      </div>
    </div>
    
    <DialogsAlert v-if="context.dialogType === 'alert'" :context="props.context"/>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue';
import type { Dialog } from '~/types/Dialog';

const t = useI18n();

const props = defineProps({
  context: {type: Object as PropType<Dialog<any>>, required: true},
});

const getStyle = (context: Dialog<any>): string => {
  return [
    `--width: ${context.width};`,
    `--height: ${context.height};`,
    `--x: ${context.x}px;`,
    `--y: ${context.y}px;`,
  ].join("");
}

const control = useDialogControlStore();

// close logic
const closeDialog = () => control.closeDialog(props.context.id);

// draggable logic
const dragFlag = ref(false);
// const dragOnPos = [0, 0];
const dragOn = (e: MouseEvent) => {
  // dragOnPos[0] = e.clientX;
  // dragOnPos[1] = e.clientY;
  dragFlag.value = true;
}
const dragOff = () => {dragFlag.value = false;}
const onDrag = (e: MouseEvent) => {
  if (!dragFlag.value) return;

  control.updateDialog(props.context.id, {
    ...props.context,
    x: props.context.x + e.movementX,
    y: props.context.y + e.movementY,
  })
  // const delta_x = e.clientX - dragOnPos[0];
  // const delta_y = e.clientY - dragOnPos[1];
}

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/DefaultStyles.scss";
@import "/assets/styles/constants/Flex.scss";

.dialog {
  @include defmix-float;

  border: var(--background-interaction-strong) 1px solid;
  border-radius: 3px;
  background: var(--background);
  pointer-events: all;
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--width);
  height: min-content;
}

.title {
  @include typemix-label;
  @include flex-row;
  @include flex-main(space-between);
  @include flex-cross(center);
  
  border-radius: 3px 3px 0px 0px;
  background: var(--layer-background);
  width: var(--width);
  overflow-x: hidden;
  height: min-content;
  user-select: none;
  
  & .right {
    @include flex-row;
  }

  & .left {
    @include flex-row;
    @include flex-cross(center);
    @include flex-main(flex-start);

    cursor: move;
    padding: $space-small;
    flex: 1;

    & span {
      width: $icon-size-medium;
      color: var(--foreground-weak);
    }
  }
}
</style>