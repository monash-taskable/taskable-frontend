<template>
  <div id="theme-provider" :class="classes(appConfigRef.theme.value, appConfigRef.accent.value)">
  </div>
</template>

<script setup lang="ts">
import type { AccentColor, Theme } from './types/Theming';

// app config and theme provider
const appConfig = useAppConfigStore();
const appConfigRef = storeToRefs(appConfig);
const classes = (theme: Theme, accent: AccentColor) => `theme--${theme} color--${accent}`;
</script>

<style>
body {
  padding: 0;
  margin: 0;
}
</style>