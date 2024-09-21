<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>
// update state
const state = useAppStateStore();
onMounted(()=>{
  state.setProjectPage("discussions");
});
</script>

<style>

</style>