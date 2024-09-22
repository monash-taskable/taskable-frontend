<template>
  <div>
    {{ x.session.profile?.firstName }}
    {{ x.session.profile?.lastName }}
    {{ x.session.profile?.email }}
  </div>
</template>

<script lang="ts" setup>
const x = useAppStateStore();
useAppStateStore().setTitle("profile.title", true, true, "fluent:person-square-20-regular");
</script>

<style>

</style>