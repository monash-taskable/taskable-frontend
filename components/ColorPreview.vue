<template>
  <button :class="getClass(appConfig.accent.value === color, enterFlag, focusFlag)" @focusout="onFocusOut" @click="onClick()" @keyup="onKeyUp">
    <svg :class="getOverride()" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_936_1456)">
        <rect class="frame" width="30" height="30" />
        <path class="highlight" d="M0 0L0.576923 0.576923L30 30H0V0Z"/>
        <rect class="select-indicator cover" x="1" y="1" width="28" height="28"/>
        <rect class="select-indicator stroke" x="1" y="1" width="28" height="28" stroke-width="2"/>
        <path class="select-indicator icon" d="M7.95356 15.729C7.85751 15.6208 7.7224 15.5552 7.57796 15.5466C7.43353 15.538 7.29159 15.5872 7.18338 15.6832C7.07517 15.7793 7.00956 15.9144 7.00096 16.0588C6.99237 16.2033 7.04151 16.3452 7.13756 16.4534L11.5012 21.3625C11.5505 21.4182 11.6108 21.4632 11.6782 21.4948C11.7456 21.5264 11.8187 21.5439 11.8931 21.5461C11.9675 21.5484 12.0416 21.5354 12.1108 21.5079C12.1799 21.4804 12.2428 21.4391 12.2954 21.3865L23.7499 9.93194C23.8523 9.82966 23.9099 9.69089 23.91 9.54614C23.9102 9.4014 23.8527 9.26254 23.7505 9.16012C23.6482 9.0577 23.5094 9.0001 23.3647 9C23.2199 8.9999 23.0811 9.0573 22.9787 9.15958L11.931 20.205L7.95247 15.729H7.95356Z" fill="#0D6E6E"/>
      </g>
      <defs>
        <clipPath id="clip0_936_1456">
          <rect width="30" height="30" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  </button>
</template>

<script lang="ts" setup>
import { isAccentColor, type Theme } from '~/types/Theming';

const props = defineProps({
  "color": {type: String, default: "blue"}
});

const appConfigStore = useAppConfigStore();
const appConfig = storeToRefs(appConfigStore);

// interaction logic
const enterFlag = ref(false);
const focusFlag = ref(false);
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
  const color = isAccentColor(props.color) ? props.color : "blue";
  appConfigStore.setAccent(color);
}

// getters
const getClass = (selected: boolean, enter: boolean, focus: boolean, ): string => {
  const selectedCls = selected ? "selected": "";
  const enterCls = enter ? "enter" : "";
  const focusCls = focus ? "focused" : "";
  
  return [
    selectedCls,
    enterCls,
    focusCls,
  ].map(x => x + " ").join("");
};

const getOverride = (): string => {
  const color = isAccentColor(props.color) ? props.color : "blue";

  return `theme-override color--${color}`;
}

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/DefaultStyles.scss";

button {
  @include defmix-focusable;
  border: 0;
  padding: 0;
  height: 30px;
  width: 30px;
  background: transparent;
}

.select-indicator { 
  opacity: 0;
  .selected & { opacity: 1; }
}

.frame { fill: var(--accent-strong); }
.highlight { fill: var(--accent-intermediate); }
.cover { fill: var(--accent-weak); }
.stroke { stroke: var(--foreground); }
.icon { fill: var(--foreground); }

</style>