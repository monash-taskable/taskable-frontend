<template>
  <div class="proj-page-root">
    <div class="controls">
      x
    </div>
  </div>
</template>

<script lang="ts" setup>

// update state
const state = useAppStateStore();
onMounted(()=>{
  state.setProjectPage("tasks");
});
</script>

<style lang="scss" scoped>

</style>