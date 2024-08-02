<template>
  <button 
    :tabindex="tabindex" class="noti-entry-container" 
    :class="getClass(enterFlag, focusFlag, newEntry)"
    @mouseover="onHoverOn" @mouseleave="onHoverOff"
    @click="onClick" @keyup="onKeyUp"
    @focusout="onFocusOut">
    <div class="icon">
      <Icon :name="icon"/>
    </div>
    <div class="captions">
      <div class="title">{{ title }}</div>
      <div class="meta">{{ source }}</div>
    </div>
    <div class="actions">
      <IconButton
        v-if="newEntry"
        :styles="getCheckButtonStyle(appConfig.theme.value)" 
        icon="fluent:checkmark-20-regular"
        :tabindex="getActionIndex(tabindex, 1)"
        :expanded="false"
        size="large"/>
      <IconButton
        :styles="{colorPreset: 'dangerous'}" 
        icon="fluent:delete-20-regular"
        :tabindex="getActionIndex(tabindex, 2)"
        :expanded="false"
        size="large"/>
    </div>
  </button>
</template>

<script lang="ts" setup>
import type { ButtonStyle } from '~/types/ButtonStyle';
import type { Optional } from '~/types/Optional';
import type { Theme } from '~/types/Theming';

// @ts-ignore
const props = defineProps({
  tabindex: {type: Number, default: undefined, required: false},
  newEntry: {type: Boolean, default: false},
  icon: {type: String, default: "fluent:calendar-error-20-regular"},
  title: {type: String},
  source: {type: String, required: false},
  timestamp: {type: Date}
});

// getters
const getClass = (enter: boolean, focus: boolean, newEntry: boolean): string => {
  const enterCls = enter ? "enter" : "";
  const focusCls = focus ? "focused" : "";
  const newCls = newEntry ? "new" : "";

  return [focusCls, enterCls, newCls].join(" ");
}

const getActionIndex = (base: Optional<number>, index: number): Optional<number> => {
  if (base === undefined) return undefined;
  
  const bstr = base.toString();
  return Number(bstr + (bstr.includes(".") ? "" : ".") + index.toString());
}

const appConfig = storeToRefs(useAppConfigStore());
const getCheckButtonStyle = (theme: Theme): ButtonStyle => {
  if (theme === "dark") return {colorPreset: 'background'}
  return {colorPreset: 'accent', backgroundColorHover: 'var(--accent-weak)'};
}

// interaction logic
const hovered = ref(false);
const enterFlag = ref(false);
const focusFlag = ref(false);
const onHoverOn = () => { hovered.value = true; };
const onHoverOff = () => { hovered.value = enterFlag.value; };
// @ts-ignore
const emitClick = defineEmits(["click"]);
const onKeyUp = (event: KeyboardEvent) => {
  if (event.target !== event.currentTarget) return;
  
  focusFlag.value = true;
  if (event.key === "Enter"){
    onClick();
    hovered.value = true;
    enterFlag.value = true;
  }
};
const onFocusOut = () => {
  focusFlag.value = false;
  hovered.value = false;
  enterFlag.value = false;
}
const onClick = () => {
  hovered.value = true;
  emitClick("click");
}
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/DefaultStyles.scss";

.noti-entry-container {
  @include flex-row;
  @include flex-main(flex-start);
  @include flex-cross(center);
  @include defmix-focusable();

  transition: $def-transition;
  border: 0;
  padding: $space-medium $space-medium-large;
  padding-right: $space-medium;
  gap: $space-large;
  background: var(--background);

  &.new {
    .theme--dark & { background: var(--layer-background); }
    background: var(--accent-weak);
    padding-left: calc($space-medium-large - 5px);
    border-left: var(--accent-strong) 2px solid;

    .title, .icon { color: var(--accent-strong); }
  }

  &:hover, &.enter {
    background: var(--background-interaction-strong);
    &.new {
      .theme--dark & { background: var(--background-interaction-strong); }
      background: var(--accent-interact);
    }
  }
}

.icon {
  font-size: $icon-size-large;
  height: $icon-size-large;
  color: var(--foreground);
}

.captions{
  flex: 1;

  .title, .meta {
    @include typemix-label;
    text-align: start;
    &.meta { color: var(--foreground-weak) }
  }
}

.actions {
  @include flex-row;

  opacity: 0;
  transition: $def-transition;

  .noti-entry-container:hover &, 
  .noti-entry-container.focused &,
  &:has(button.focused) {
    opacity: 1;
  }
}

</style>