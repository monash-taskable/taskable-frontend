<template>
  <div>
    View Proj!
  </div>
</template>

<script lang="ts" setup>

// update state
const state = useAppStateStore();
onMounted(()=>{
  state.setProjectPage("overview");
});
</script>

<style>

</style>