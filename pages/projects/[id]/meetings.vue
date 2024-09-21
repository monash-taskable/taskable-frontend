<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>
// update state
const state = useAppStateStore();
onMounted(()=>{
  state.setProjectPage("meetings");
});
</script>

<style>

</style>