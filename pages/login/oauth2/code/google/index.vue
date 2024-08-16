<template>
  <div>
    {{ route.query.code }}
  </div>
</template>

<script lang="ts" setup>

const route = useRoute();
console.log(route.query.code);

</script>

<style>

</style>