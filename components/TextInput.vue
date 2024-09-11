<template>
  <div>
    <div
      class="field" 
      :class="getClass(props.styles, focusFlag, value, props.error, props.icon !== '')"
      :style="getStyle(props.styles)">
      <div class="placeholder">
        <Icon v-if="props.icon !== undefined" :name="props.icon"/>
        {{ placeholder }}
      </div>
      <input 
        :id="`input_${id}`"
        @change="updateText"
        v-model="value" 
        @focusout="unfocus"
        @focusin="focus"
        />
    </div>
    <div v-show="props.error" :style="getStyle(props.styles)" class="error-msg">
      {{ errorMessages }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { v7 } from 'uuid';
import type { PropType } from 'vue';
import { inputStyle, presets, type InputStyle } from '~/types/InputStyle';
import type { Optional } from '~/types/Optional';

const props = defineProps({
  styles: {type: Object as PropType<InputStyle>, default: presets.get("background")},
  error: {type: Boolean, default: false, required: false},
  errorMessages: {type: String, default: "", required: false},
  icon: {type: String, required: false, default: ""},
  placeholder: {type: String, default: ""},
  focused: {type: Boolean, default: false},
  value: {type: String, default: ""},
});

// autofocus
const id = ref(v7());
onMounted(()=>{
  if (props.focused) {
    document.getElementById(`input_${id.value}`)?.focus();
  }
  value.value = props.value;
})

// focus and filled logic
const emitChange = defineEmits(["change", "focusin", "focusout"]);

const focusFlag = ref(props.focused);
const focus = () => {
  focusFlag.value = true;
  emitChange("focusin");
}
const unfocus = () => {
  focusFlag.value = false;
  emitChange("focusout");
};

const value = ref("");
const clsSwitcher = (test: Optional<any>, val: string): string => {
  if (test !== undefined) return val;
  return "";
};

const styleSwitcher = (test: Optional<any>, varName: string): string => {
  if (test !== undefined) return `--${varName}: ${test};`;
  return "";
};

const model = defineModel({type: String});

const updateText = () => {
  emitChange("change", value.value)
  model.value = value.value;
}


// getters
const getClass = (style: InputStyle, focused: boolean, value: string, error: boolean, hasIcon: boolean) => [
  focused ? "focused" : "",
  value === "" ? "" : "filled",
  error ? "error" : "",
  hasIcon ? "" : "no-icon",
  style.size ?? "medium",
  clsSwitcher(style.foregroundColorInteract, "fg-itr"),
  clsSwitcher(style.placeholderColor, "placeholder-color"),
  clsSwitcher(style.iconColor, "icon-color"),
  clsSwitcher(style.iconColor, "icon-itr-color"),
  clsSwitcher(style.padding, "padding"),
  clsSwitcher(style.width, "width"),
  clsSwitcher(style.height, "height"),
].filter(Boolean).join(" ");


const getStyle = (style: InputStyle) => {
  style = inputStyle(style);
  
  return [
    `--bg: ${style.backgroundColor};`,
    `--bgItr: ${style.backgroundColorInteract};`,
    `--fg: ${style.foregroundColor};`,
    styleSwitcher(style.foregroundColorInteract, `fg-itr`),
    styleSwitcher(style.placeholderColor, `placeholder-color`),
    styleSwitcher(style.iconColor, `icon-color`),
    styleSwitcher(style.iconColorInteract, `icon-itr-color`),
    styleSwitcher(style.padding, `padding`),
    styleSwitcher(style.width, `width`),
    styleSwitcher(style.height, `height`),
  ].join("");
}
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/DefaultStyles.scss";
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";

// stacking
.field {
  @include defmix-focusable;

  position: relative;
  display: inline-block;

  .placeholder{
    @include flex-row;
    @include flex-cross(center);
    @include typemix-label;
    
    z-index: 2010;
    position: absolute;
    pointer-events: none;
  }
    
  input {
    @include typemix-label;
    z-index: 2005;
    position: relative;
  }
}

// styles
.field {
  background: var(--bg);
  
  input {
    background: transparent;
    border: 0;
    border-radius: 0;
    outline: none;

    color: var(--fg);
  }

  .placeholder {
    color: var(--foreground-weak)
  }

  &.no-icon {&.small, &.medium, &.large { .placeholder {
    gap: 0;
  }}}

  &.error {
    outline: $def-tabsel-outline;
    outline-color: var(--dangerous-intermediate);

  }

  &:focus, &.focused { background: var(--bgItr); }
  &.filled { .placeholder { opacity: 0; } }
}
.error-msg {
  color: var(--dangerous-intermediate);
}


// sizes
.field {
  &.small {
    input, .placeholder { padding: $space-small; }
    .placeholder { gap: $space-small; }
  }

  &.medium {
    input, .placeholder { padding: $space-medium; }
    .placeholder { gap: $space-small; }
  }

  &.large {
    input, .placeholder { padding: $space-large; }
    .placeholder { gap: $space-medium; }
  }
}

// dynamic styles
.field {
  &.fgItr:focus, &.fg-itr.focused 
  { background: var(--fg-itr); }

  &.icon-color span 
  { color: var(--icon-color); }

  &.icon-itr-color:focus span, 
  &.icon-itr-color.focused span 
  { color: var(--icon-color); }

  &.placeholder-color .placeholder { color: var(--placeholder-color) }

  &.padding input
  { padding: var(--padding); }

  &.width {
    width: var(--width);

    &.small input { width: calc(var(--width) - ($space-small * 2)); }
    &.medium input { width: calc(var(--width) - ($space-medium * 2)); }
    &.large input { width: calc(var(--width) - ($space-large * 2)); }
  }

  &.height {
    height: var(--height);

    &.small input { height: (var(--width) - ($space-small * 2)); }
    &.medium input { height: (var(--width) - ($space-medium * 2)); }
    &.large input { height: (var(--width) - ($space-large * 2)); }
  }
}
</style>