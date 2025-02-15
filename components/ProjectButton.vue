<template>
  <button :tabindex="tabindex"
      :class="getClass(expandedState, props.expanding, enterFlag, focusFlag, props.styles)"
      :style="getStyle(props.styles)" :id="id"
      @mouseover="expand" @mouseleave="collapse"
      @focusin="expand" @focusout="onFocusOut"
      @keyup="onKeyUp" @keydown="()=>{}"
      @click="_onClick"
      >
    <Icon :name="getIcon(props.template)"/>
    <span tabindex="-1" @click="onClick" class="caption">
      {{ caption }}
    </span>
  </button>
</template>

<script lang="ts" setup>
import { buttonStyle, presets, type ButtonStyle } from '~/types/Button';

const props = defineProps({
  // icon: {type: String, default: "fluent:clover-20-regular"},
  template: {type: Boolean, required: false, default: false},
  expanded: {type: Boolean, required: false, default: undefined},
  expanding: {type: Boolean, default: false},
  caption: {type: String},
  styles: {type: Object, required: false},
  tabindex: {type: Number, required: false},
  maintainClick: {type: Boolean, default: false},
  id: {type: String, required:false, default: undefined},
})

// interaction logic
const enterFlag = ref(false);
const focusFlag = ref(false);
const emitClick = defineEmits(["click"]);
const onKeyUp = () => { focusFlag.value = true; };
const onFocusOut = () => {
  enterFlag.value = false;
  focusFlag.value = false;
  collapse();
}
const _onClick = () => {
  enterFlag.value = props.maintainClick;
  emitClick("click");
}

// expandable logic
const initExpandedState = (props.expanded === undefined) ? !props.expanding : props.expanded;
const expandedState = ref(initExpandedState);
const expand = () => { expandedState.value = (props.expanded === undefined) ? true : props.expanded; };
const collapse = () => { expandedState.value = (props.expanded === undefined) ? initExpandedState : props.expanded; };

// getters
const getIcon = (template: boolean) => template ? "fluent:stack-20-filled" : "fluent:clover-20-regular";

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
  const fgCls = (styles.foregroundColor === undefined) ? "" : "fg";
  const fgHoverCls = (styles.foregroundColorHover === undefined) ? "" : "fgHover";
  const paddingCls = (styles.padding === undefined) ? "" : "padding";

  return [
    expandedCls,
    expandedCls,
    sizeCls,
    focusableCls,
    bgHoverCls,
    fgCls,
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
  @include flex-main(flex-start);

  .caption {
    overflow-x: hidden;
    transition: $def-transition;
    display: inline-block;
    white-space: nowrap;
  }
  
  gap: $space-medium;
  transition: $def-transition;
  background: var(--bg);
  color: var(--foreground);
  
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

  &.fg {
    color: var(--fg);
  }

  &.fgHover:hover, &.fgHover.enter {
    color: var(--fgHover);
  }

  &.padding {
    padding: var(--padding);
  }
}
</style>