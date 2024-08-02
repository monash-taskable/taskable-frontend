<template>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.95041 8.13223C5.95041 7.69406 6.30563 7.33884 6.7438 7.33884H16.2645C16.7026 7.33884 17.0579 7.69406 17.0579 8.13223C17.0579 8.57041 16.7026 8.92562 16.2645 8.92562H6.7438C6.30563 8.92562 5.95041 8.57041 5.95041 8.13223Z" :fill="getColor('url(#paint0_linear_726_1965)', appConfig.theme.value,  $props.color)"/>
    <path d="M9.32231 12.0992C9.32231 11.661 9.67753 11.3058 10.1157 11.3058H20.8264C21.2646 11.3058 21.6198 11.661 21.6198 12.0992C21.6198 12.5373 21.2646 12.8926 20.8264 12.8926H10.1157C9.67753 12.8926 9.32231 12.5373 9.32231 12.0992Z" :fill="getColor('url(#paint1_linear_726_1965)', appConfig.theme.value,  $props.color)"/>
    <path d="M4.76033 15.6694C4.76033 15.2312 5.11554 14.876 5.55372 14.876H12.2975C12.7357 14.876 13.0909 15.2312 13.0909 15.6694C13.0909 16.1076 12.7357 16.4628 12.2975 16.4628H5.55372C5.11554 16.4628 4.76033 16.1076 4.76033 15.6694Z" :fill="getColor('url(#paint2_linear_726_1965)', appConfig.theme.value,  $props.color)"/>
    <defs>
      <linearGradient id="paint0_linear_726_1965" x1="5.6107" y1="14.876" x2="5.99476" y2="17.4096" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00507D"/>
        <stop offset="1" stop-color="#00B3B3"/>
      </linearGradient>
      <linearGradient id="paint1_linear_726_1965" x1="5.6107" y1="14.876" x2="5.99476" y2="17.4096" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00507D"/>
        <stop offset="1" stop-color="#00B3B3"/>
      </linearGradient>
      <linearGradient id="paint2_linear_726_1965" x1="5.6107" y1="14.876" x2="5.99476" y2="17.4096" gradientUnits="userSpaceOnUse">
        <stop stop-color="#00507D"/>
        <stop offset="1" stop-color="#00B3B3"/>
      </linearGradient>
      <slot/>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
import type { Theme } from '~/types/Theming';

const props = defineProps({
  color: {type: String, required: false}
});

const appConfig = storeToRefs(useAppConfigStore());
const getColor = (fallback: string, theme: Theme, color?: string): string => {
  if (color === undefined) {
    return (theme === "dark") ? "var(--foreground)" : fallback;
  };
  return color;
}

</script>