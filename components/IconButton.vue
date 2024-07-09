<template>
  <button :tabindex="tabindex"
      :class="getClass(expandedState, props.expanding, enterFlag, props.styles)"
      :style="getStyle(props.styles)"
      @mouseover="expand" @mouseleave="collapse"
      @focusin="expand" @focusout="onFocusOut"
      @click="$emit('click')" @keyup="onEnter"
      >
    <Icon :name="icon"/>
    <span class="caption">
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
  tabindex: {type: Number, required: false}
})

// interaction logic
const enterFlag = ref(false);
const emitClick = defineEmits(["click"]);
const onEnter = (event: KeyboardEvent) => {
  if (event.key === "Enter"){
    enterFlag.value = true;
    emitClick("click");
  }
};
const onFocusOut = () => {
  enterFlag.value = false;
  collapse();
}

// expandable logic
const initExpandedState = (props.expanded === undefined) ? !props.expanding : props.expanded;
const expandedState = ref(initExpandedState);
const expand = () => { expandedState.value = (props.expanded === undefined) ? true : props.expanded; };
const collapse = () => { expandedState.value = (props.expanded === undefined) ? false : props.expanded; };

// getters
const getClass = (
  expanded: boolean, expanding: boolean,
  enter: boolean, styles?: ButtonStyle): string => {

  const expandedCls = expanded ? "expanded" : "";
  const expandingCls = expanding ? "expanding" : "";
  const enterCls = enter ? "enter" : "";
  
  styles = <ButtonStyle>((styles === undefined) ? presets.get("background") : styles);
  styles = buttonStyle(styles);
  const sizeCls = (styles.size === undefined) ? "medium" : styles.size;
  const focusableCls = (styles.focusable === undefined || styles.focusable) ? "focusable" : "non-focusable";
  const bgHoverCls = (styles.backgroundColorHover === undefined) ? "" : "bgHover";
  const fgHoverCls = (styles.foregroundColorHover === undefined) ? "" : "fgHover";
  const paddingCls = (styles.padding === undefined) ? "" : "padding";


  return `${expandedCls} ${expandingCls} ${sizeCls} ${focusableCls} ${bgHoverCls} ${fgHoverCls} ${paddingCls} ${enterCls}`;
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