<template>
  <div id="theme-provider" :class="classes(appConfigRef.theme.value, appConfigRef.accent.value)">
    <DialogManager/>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
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
  overflow-x: hidden;
}

* {
  font-family: "IBM Plex Sans", sans-serif;
}
</style>

<style lang="scss" scoped>
.icon-test{
  color: green;
  font-size: 40px;
}

#theme-provider {
  width: 100vw;
  height: 100vh;
  background: var(--background);
}
</style>