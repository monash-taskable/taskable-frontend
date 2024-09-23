<template>
  <div :id="'dialog_' + $props.context.id" :style="getStyle(props.context)" class="dialog" :class="getClass(props.context)">
    <div class="title">
      <div class="float">
        <Icon name="fluent:re-order-dots-vertical-20-regular"/>
        <span v-if="context.icon" class="title-icon">
          <Icon :name="context.icon"/>
        </span>
        {{ (context.title === "@@UUID") ? context.id : context.title }}
      </div>
      <div class="right">
        <IconButton 
          v-for="action in context.actionsLeft"
          @click="() => getClickEvent(props.context, emitted, action.action)"
          :expanding="action.expanding"
          :styles="{...action.style, size: 'small'}"
          :icon="action.icon"
          :caption="action.caption"/>
        <IconButton 
          v-if="context.close !== undefined"
          @click="closeDialog"
          :expanding="context.close.expanding"
          :expanded="context.close.expanded"
          :styles="{...context.close.style, size: 'small'}"
          :icon="context.close.icon"
          :caption="context.close.caption"/>
        <IconButton 
          v-for="action in context.actionsRight"
          @click="() => getClickEvent(props.context, emitted, action.action)"
          :expanding="action.expanding"
          :styles="{...action.style, size: 'small'}"
          :icon="action.icon"
          :caption="action.caption"/>
      </div>
      <div class="left" @mousedown="dragOn" @mouseup="dragOff" @mousemove="onDrag" @mouseleave="dragOff"></div>
    </div>
    
    <!-- Dialog Types -->
    <DialogsAlert @emit="updateEmit" v-if="context.dialogType === 'alert'" :context="props.context"/>
    <DialogsError @emit="updateEmit" v-if="context.dialogType === 'error'" :context="props.context"/>
    <DialogsCreateClass @emit="updateEmit" v-if="context.dialogType === 'createClass'" :context="props.context"/>
    <DialogsSignIn @emit="updateEmit" v-if="context.dialogType === 'signIn'" :context="props.context"/>
    <DialogsSignInLoading @emit="updateEmit" v-if="context.dialogType === 'signInLoading'" :context="props.context"/>
    <DialogsSignInError @emit="updateEmit" v-if="context.dialogType === 'signInError'" :context="props.context"/>
    <DialogsCreateProjectTemplate @emit="updateEmit" v-if="context.dialogType === 'createProjectTemplate'" :context="props.context"/>
    <DialogsEditClass @emit="updateEmit" v-if="context.dialogType === 'editClass'" :context="props.context"/>
    <DialogsUpdateMemberRole @emit="updateEmit" v-if="context.dialogType === 'updateMemberRole'" :context="props.context"/>
    <DialogsSearchUser @emit="updateEmit" v-if="context.dialogType === 'searchUser'" :context="props.context"/>
    <DialogsBatchMemberAdd @emit="updateEmit" v-if="context.dialogType === 'batchMemberAdd'" :context="props.context"/>
    <DialogsSessionError @emit="updateEmit" v-if="context.dialogType === 'sessionError'" :context="props.context"/>
    <DialogsProjectError @emit="updateEmit" v-if="context.dialogType === 'projectError'" :context="props.context"/>
    <DialogsEditTemplate @emit="updateEmit" v-if="context.dialogType === 'editTemplate'" :context="props.context"/>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue';
import type { Dialog } from '~/types/Dialog';
import type { Optional } from '~/types/Optional';

const props = defineProps({
  context: {type: Object as PropType<Dialog<any>>, required: true},
});

const styleSwitch = (style: Optional<string>, name: string) =>
  style ? `--${name}: ${style};` : "";

const getStyle = (context: Dialog<any>): string => {
  const style = context.style ?? {};
  
  return [
    `--width-dlg: ${context.width};`,
    `--height-dlg: ${context.height};`,
    `--x: ${context.x}px;`,
    `--y: ${context.y}px;`,
    styleSwitch(style.titleBackground, "title-background"),
    styleSwitch(style.titleColor, "title-color"),
  ].join("");
}

const classSwitch = (on: Optional<any>, name: string) =>
  on ? name : ""

const getClass = (context: Dialog<any>): string => {
  const style = context.style ?? {};
  const draggable = context.x != undefined && context.y != undefined;

  return  [
    classSwitch(style.titleBackground, "title-background"),
    classSwitch(style.titleColor, "title-color"),
    classSwitch(draggable, "draggable"),
  ].join(" ");
}

const control = useDialogs();

// clickable
const closeDialog = () => control.closeDialog(props.context.id);
const getClickEvent = <T>(
  context: Dialog<T>, 
  emit: any, 
  action?: (context: Dialog<T>, emit: any) => void) => 
    action ? action(context, emit) : null;

// draggable logic
const dragFlag = ref(false);
const dragOn = () => { dragFlag.value = true; }
const dragOff = () => {dragFlag.value = false;}
const onDrag = (e: MouseEvent) => {
  if (!dragFlag.value) return;

  if (props.context.x != undefined && props.context.y != undefined)
  control.updateDialog(props.context.id, {
    ...props.context,
    x: props.context.x + e.movementX,
    y: props.context.y + e.movementY,
  })
}

// getting emitted values
const emitted: globalThis.Ref<any> = ref(undefined);
const updateEmit = (new_val: any) => emitted.value = new_val;
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/DefaultStyles.scss";
@import "/assets/styles/constants/Flex.scss";

@keyframes pop {
  0% {
    opacity: 0.3;
    transform: scale(0.97);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.dialog {
  @include defmix-float;

  animation: pop 0.1s ease-out forwards;
  border: var(--background-interaction-strong) 1px solid;
  border-radius: 3px;
  background: var(--background);
  pointer-events: all;
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--width-dlg);
  height: min-content;
}

.title {
  @include typemix-label;
  @include flex-row-rev;
  @include flex-main(space-between);
  @include flex-cross(stretch);
  
  border-radius: 3px 3px 0px 0px;
  background: var(--layer-background);
  width: var(--width-dlg);
  overflow-x: hidden;
  height: min-content;
  user-select: none;
  
  & .right {
    @include flex-row;
    min-height: ($space-small * 2) + $icon-size-medium;
  }

  & .left {
    text-wrap: nowrap;
    .draggable { cursor: move; }
    padding: $space-small;
    flex: 1;

  }
  
  & .float {
    @include flex-row;
    @include flex-cross(center);
    @include flex-main(flex-start);
    
    gap: $space-small;
    position: absolute;
    top: $space-medium;
    left: $space-small;
    pointer-events: none;

    & span:not(.title-icon) {
      width: $icon-size-medium;
      color: var(--foreground-weak);
    }

    & span.title-icon span {
      width: $icon-size-small;
      height: $icon-size-small;
      color: var(--foreground);
    }

    & span.title-icon {
      height: $icon-size-small;
    }
  }
}

// custom style
.title {
  .title-background & {
    background-color: var(--title-background);
  }

  .title-color & {
    color: var(--title-color);
    & .float span.title-icon span { color: var(--title-color); }
  }
}
</style>