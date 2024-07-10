<template>
  <button :tabindex="tabindex"
      :class="getClass(expandedState, props.expanding, enterFlag, focusFlag, props.styles)"
      :style="getStyle(props.styles)"
      @mouseover="expand" @mouseleave="collapse"
      @focusin="expand" @focusout="onFocusOut"
      @click="onClick()" @keyup="onKeyUp"
      >
    <Icon :name="icon"/>
    <span tabindex="-1" @click="onClick" class="caption">
      {{ caption }}
    </span>
  </button>
</template>

<script lang="ts" setup>
import { buttonStyle, presets, type ButtonStyle } from '~/types/ButtonStyle';

const props = defineProps({
  icon: {type: String, default: "fluent:clover-20-regular"},
  expanded: {type: Boolean, required: false, default: undefined},
  expanding: {type: Boolean, default: false},
  caption: {type: String},
  styles: {type: Object, required: false},
  tabindex: {type: Number, required: false},
  maintainClick: {type: Boolean, default: false},
})

// interaction logic
const enterFlag = ref(false);
const focusFlag = ref(false);
const emitClick = defineEmits(["click"]);
const onKeyUp = (event: KeyboardEvent) => {
  focusFlag.value = true;
  if (event.key === "Enter"){
    onClick();
    enterFlag.value = true;
  }
};
const onFocusOut = () => {
  enterFlag.value = false;
  focusFlag.value = false;
  collapse();
}
const onClick = () => {
  enterFlag.value = props.maintainClick;
  emitClick("click");
}

// expandable logic
const initExpandedState = (props.expanded === undefined) ? !props.expanding : props.expanded;
const expandedState = ref(initExpandedState);
const expand = () => { expandedState.value = (props.expanded === undefined) ? true : props.expanded; };
const collapse = () => { expandedState.value = (props.expanded === undefined) ? initExpandedState : props.expanded; };

// getters
const getClass = (
  expanded: boolean, expanding: boolean,
  enter: boolean, focus: boolean, 
  styles?: ButtonStyle): string => {

  const expandedCls = expanded ? "expanded" : "";
  const expandingCls = expanding ? "expanding" : "";
  const enterCls = enter ? "enter" : "";
  const focusCls = focus ? "focused" : "";

  styles = <ButtonStyle>((styles === undefined) ? presets.get("background") : styles);
  styles = buttonStyle(styles);
  const sizeCls = (styles.size === undefined) ? "medium" : styles.size;
  const focusableCls = (styles.focusable === undefined || styles.focusable) ? "focusable" : "non-focusable";
  const bgHoverCls = (styles.backgroundColorHover === undefined) ? "" : "bgHover";
  const fgHoverCls = (styles.foregroundColorHover === undefined) ? "" : "fgHover";
  const paddingCls = (styles.padding === undefined) ? "" : "padding";

  return [
    expandedCls,
    expandedCls,
    sizeCls,
    focusableCls,
    bgHoverCls,
    fgHoverCls,
    paddingCls,
    expandingCls,
    focusCls,
    enterCls,
  ].join(" ");
}

const getStyle = (styles?: ButtonStyle): string => {
  styles = <ButtonStyle>((styles === undefined) ? presets.get("background") : styles);
  styles = buttonStyle(styles);

  let styleStr = "";

  if (styles.backgroundColor !== undefined) {
    styleStr += `--bg: ${styles.backgroundColor};`;
  }

  if (styles.backgroundColorHover !== undefined) {
    styleStr += `--bgHover: ${styles.backgroundColorHover};`;
  }

  if (styles.foregroundColor !== undefined) {
    styleStr += `--fg: ${styles.foregroundColor};`;
  }

  if (styles.foregroundColorHover !== undefined) {
    styleStr += `--fgHover: ${styles.foregroundColorHover};`;
  }

  if (styles.padding !== undefined) {
    styleStr += `--padding: ${styles.padding};`;
  }

  return styleStr;
}

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/DefaultStyles.scss";
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

button {
  @include typemix-label();
  @include defmix-box();
  @include flex-row();
  @include flex-cross(center);

  .caption {
    overflow-x: hidden;
    transition: $def-transition;
    display: inline-block;
    white-space: nowrap;
  }
  
  gap: $space-medium;
  transition: $def-transition;
  background: var(--bg);
  color: var(--fg);
  
  &>span:not(.caption) {
    font-size: $icon-size-medium;
    width: $icon-size-medium;
    height: $icon-size-medium;
  }
}

// sizes
button {
  &.small {
    padding: $space-small;
    &.expanded {padding: $space-small $space-small-splitting $space-small $space-small}
  }
  
  &.medium {
    padding: $space-medium;
    &.expanded {padding: $space-medium $space-medium-splitting $space-medium $space-medium}
  }
  
  &.large {
    padding: $space-large;
    &.expanded {padding: $space-large $space-large-splitting $space-large $space-large}
  }
}

// style option rules
button {
  &.focusable {
    @include defmix-focusable();
  }

  &.non-focusable {
    @include defmix-focusable(2px transparent solid);
  }

  &:not(.expanded) .caption {
    width: 0px; 
  }

  &:not(.expanded) {
    gap: 0px;
  }

  &.bgHover:hover, &.enter {
    background: var(--bgHover);
  }

  &.fgHover:hover, &.enter {
    color: var(--fgHover);
  }

  &.padding {
    padding: var(--padding);
  }
}
</style>