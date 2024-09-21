<template>
  <select :tabindex="tabindex"
      :class="getClass(enterFlag, focusFlag, props.styles)"
      :style="getStyle(props.styles)" :id="id"
      v-model="value"
      @focusout="onFocusOut" @keyup="onKeyUp" @keydown="()=>{}"
      @click="_onClick"
      @change="emitChange"
      >
      <!-- <option selected v-if="loading"/> -->
      <slot/>
  </select>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { buttonStyle, presets, type ButtonStyle } from '~/types/Button';

const props = defineProps({
  styles: {type: Object as PropType<ButtonStyle>, required: false},
  tabindex: {type: Number, required: false},
  id: {type: String, required:false, default: undefined},
  selected: {type: String, required: false, default: undefined},
})

// loading holder
const loading = ref(true);
onMounted(() => loading.value = false);

// interaction logic
const enterFlag = ref(false);
const focusFlag = ref(false);
const emitEvent = defineEmits(["click", "change"]);
const onKeyUp = () => { focusFlag.value = true; };
const onFocusOut = () => {
  enterFlag.value = false;
  focusFlag.value = false;
}
const _onClick = () => {
  emitEvent("click");
}

const value = ref(props.selected)
const emitChange = () => {
  emitEvent("change", value.value)
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
  const fgCls = (styles.foregroundColor === undefined) ? "" : "fg";
  const fgHoverCls = (styles.foregroundColorHover === undefined) ? "" : "fgHover";
  const paddingCls = (styles.padding === undefined) ? "" : "padding";

  return [
    sizeCls,
    focusableCls,
    bgHoverCls,
    fgCls,
    fgHoverCls,
    paddingCls,
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

select {
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
select {
  &.small {
    padding: $space-small;
  }
  
  &.medium {
    padding: $space-medium;
  }
  
  &.large {
    padding: $space-large;
  }
}

// style option rules
select {
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