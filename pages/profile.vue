<template>
  <div>
    {{ x.session.profile?.firstName }}
    {{ x.session.profile?.lastName }}
    {{ x.session.profile?.email }}
  </div>
</template>

<script lang="ts" setup>
const {t} = useI18n();
const x = useAppStateStore();
useAppStateStore().setTitle(t("profile.title"), true, "fluent:person-square-20-regular");
</script>

<style>

</style>