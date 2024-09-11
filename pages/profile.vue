<template>
  <div>
    {{ x.session.profile?.firstName }}
    {{ x.session.profile?.lastName }}
    {{ x.session.profile?.email }}
  </div>
</template>

<script lang="ts" setup>
const x = useAppStateStore();
</script>

<style>

</style>