<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>
const {t} = useI18n();
useAppStateStore().setTitle(t("about.title"), true, "fluent:info-20-regular");
</script>

<style>

</style>