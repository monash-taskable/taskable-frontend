<template>
  <button :class="getClass(appConfig.theme.value === theme, enterFlag, focusFlag)" @focusout="onFocusOut" @click="onClick()" @keyup="onKeyUp">
    <svg :class="getOverride(theme, appConfig.accent.value)" width="140" height="80" viewBox="0 0 140 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_899_1474)">
        <rect class="container" width="140" height="80" fill="#F5F5F5"/>
        <rect class="accent-strong" width="30" height="15" transform="translate(10 10)" fill="#0B5174"/>
        <rect class="accent-weak" width="30" height="15" transform="translate(10 25)" fill="#EDF6F8"/>
        <rect class="background-strong" width="30" height="15" transform="translate(10 40)" fill="#E0E0E0"/>
        <rect class="background-weak" width="30" height="15" transform="translate(10 55)" fill="white"/>
        <path class="foreground" d="M82.92 66L78.44 52.816H60.392L55.912 66H50.472L66.088 21.328H72.936L88.552 66H82.92ZM69.544 26.32H69.224L61.672 48.08H77.096L69.544 26.32ZM119.628 66C117.708 66 116.321 65.488 115.468 64.464C114.657 63.44 114.145 62.16 113.932 60.624H113.612C112.886 62.672 111.692 64.208 110.028 65.232C108.364 66.256 106.38 66.768 104.076 66.768C100.577 66.768 97.8462 65.872 95.8835 64.08C93.9635 62.288 93.0035 59.856 93.0035 56.784C93.0035 53.6693 94.1342 51.28 96.3955 49.616C98.6995 47.952 102.262 47.12 107.083 47.12H113.612V43.856C113.612 41.5093 112.972 39.7173 111.692 38.48C110.412 37.2427 108.449 36.624 105.804 36.624C103.798 36.624 102.113 37.072 100.748 37.968C99.4248 38.864 98.3155 40.0587 97.4195 41.552L94.3475 38.672C95.2435 36.88 96.6728 35.3653 98.6355 34.128C100.598 32.848 103.073 32.208 106.06 32.208C110.07 32.208 113.185 33.1893 115.404 35.152C117.622 37.1147 118.732 39.8453 118.732 43.344V61.52H122.507V66H119.628ZM104.908 62.416C106.188 62.416 107.361 62.2667 108.428 61.968C109.494 61.6693 110.412 61.2427 111.18 60.688C111.948 60.1333 112.545 59.4933 112.972 58.768C113.398 58.0427 113.612 57.2533 113.612 56.4V50.96H106.828C103.884 50.96 101.729 51.3867 100.364 52.24C99.0408 53.0933 98.3795 54.3307 98.3795 55.952V57.296C98.3795 58.9173 98.9555 60.176 100.108 61.072C101.302 61.968 102.902 62.416 104.908 62.416Z" fill="#393939"/>
        <rect class="select-indicator frame" x="1" y="1" width="138" height="78" fill-opacity="0.7"/>
        <rect class="select-indicator stroke" x="1" y="1" width="138" height="78" stroke="#0B5174" stroke-width="2"/>
        <rect class="select-indicator icon-holder" width="34" height="34" transform="translate(106 46)" fill="#0B5174"/>
        <path class="select-indicator icon" d="M115.049 63.4019C114.943 63.2829 114.795 63.2107 114.636 63.2013C114.477 63.1918 114.321 63.2459 114.202 63.3515C114.083 63.4572 114.011 63.6058 114.001 63.7647C113.992 63.9236 114.046 64.0797 114.151 64.1987L118.951 69.5987C119.006 69.66 119.072 69.7096 119.146 69.7443C119.22 69.779 119.301 69.7982 119.382 69.8007C119.464 69.8032 119.546 69.7889 119.622 69.7587C119.698 69.7285 119.767 69.683 119.825 69.6251L132.425 57.0251C132.538 56.9126 132.601 56.76 132.601 56.6008C132.601 56.4415 132.538 56.2888 132.426 56.1761C132.313 56.0635 132.16 56.0001 132.001 56C131.842 55.9999 131.689 56.063 131.577 56.1755L119.424 68.3255L115.048 63.4019H115.049Z" fill="#F8FCFC"/>
      </g>
      <defs>
        <clipPath id="clip0_899_1474">
        <rect width="140" height="80" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  </button>
</template>

<script lang="ts" setup>
import { isTheme, type Theme } from '~/types/Theming';

const props = defineProps({
  theme: {type: String, default: "light"}
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
  const theme: Theme = isTheme(props.theme) ? props.theme : "light";
  appConfigStore.setTheme(theme);
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
const getOverride = (theme: string, color: string): string => {
  return `theme-override theme--${theme} color--${color}`;
}
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/DefaultStyles.scss";

button {
  @include defmix-focusable;

  padding: 0;
  border-radius: 0;
  border: 0;
  height: 80px;
}

.select-indicator{
  opacity: 0;
  .selected & { opacity: 1; }
}

.container { fill: var(--background); }
.accent-strong { fill: var(--accent-strong); }
.accent-weak { fill: var(--accent-weak); }
.background-strong { fill: var(--background-interaction-strong); }
.background-weak { fill: var(--layer-background); }
.foreground { fill: var(--foreground); }
.frame { fill: var(--background); }
.stroke { stroke: var(--foreground); }
.icon-holder { fill: var(--foreground); }
.icon { fill: var(--background); }
</style>