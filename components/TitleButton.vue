<template>
  <button :tabindex="tabindex"
      :class="getClass(enterFlag, focusFlag, props.styles)"
      :style="getStyle(props.styles)" :id="id"
      @focusout="onFocusOut" @click="onClick()" @keyup="onKeyUp"
      >
    <div class="title">
      <Icon :name="icon"/>
      <span tabindex="-1" @click="onClick" class="caption">
        {{ caption }}
      </span>
    </div>
    <div class="description"> {{ description }} </div>
  </button>
</template>

<script lang="ts" setup>
import { buttonStyle, presets, type ButtonStyle } from '~/types/ButtonStyle';

// @ts-ignore
const props = defineProps({
  icon: {type: String, default: "fluent:clover-20-regular"},
  caption: {type: String},
  description: {type: String},
  styles: {type: Object, required: false},
  tabindex: {type: Number, required: false},
  maintainClick: {type: Boolean, default: false},
  id: {type: String, required:false, default: undefined},
})

// interaction logic
const enterFlag = ref(false);
const focusFlag = ref(false);
// @ts-ignore
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
}
const onClick = () => {
  enterFlag.value = props.maintainClick;
  emitClick("click");
}

// getters
const getClass = (
  enter: boolean, focus: boolean, 
  styles?: ButtonStyle): string => {

  const enterCls = enter ? "enter" : "";
  const focusCls = focus ? "focused" : "";

  styles = <ButtonStyle>((styles === undefined) ? presets.get("background") : styles);
  styles = buttonStyle(styles);
  const sizeCls = (styles.size === undefined) ? "medium" : styles.size;
  const focusableCls = (styles.focusable === undefined || styles.focusable) ? "focusable" : "non-focusable";
  const bgHoverCls = (styles.backgroundColorHover === undefined) ? "" : "bgHover";
  const fgHoverCls = (styles.foregroundColorHover === undefined) ? "" : "fgHover";
  const fgCls = (styles.foregroundColor === undefined) ? "" : "fg";
  const paddingCls = (styles.padding === undefined) ? "" : "padding";

  return [
    sizeCls,
    focusableCls,
    bgHoverCls,
    fgHoverCls,
    paddingCls,
    fgCls,
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

  @include flex-col;
  @include flex-cross(flex-start);

  .caption {
    overflow-x: hidden;
    transition: $def-transition;
    display: inline-block;
    white-space: nowrap;
  }

  .title {
    @include flex-row;
    @include flex-cross(center);
    gap: $space-medium;
  }

  .description {
    @include typemix-label();
    color: var(--foreground-weak);
  }
  
  gap: $space-small;
  transition: $def-transition;
  background: var(--bg);
  color: var(--foreground);
  
  & span:not(.caption) {
    font-size: $icon-size-medium;
    width: $icon-size-medium;
    height: $icon-size-medium;
  }
}

// sizes
button {
  &.small { padding: $space-small $space-medium $space-small $space-small; }
  
  &.medium { padding: $space-medium $space-large $space-medium $space-medium; }
  
  &.large { padding: $space-large $space-extra $space-large $space-large; }
}

// style option rules
button {
  &.focusable {
    @include defmix-focusable();
  }

  &.non-focusable {
    @include defmix-focusable(2px transparent solid);
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