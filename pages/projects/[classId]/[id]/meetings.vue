<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>
import { setupProjectState } from '~/scripts/ProjectClassesFetches';

// update state
const state = useAppStateStore();
const route = useRoute();

onMounted(async ()=>{
  await setupProjectState(route.params.classId.toString(), route.params.id.toString());
  state.setProjectPage("meetings");
});
</script>

<style>

</style>