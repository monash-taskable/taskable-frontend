<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>
import { setupProjectState } from '~/scripts/ProjectClassesFetches';

const route = useRoute();
const state = useAppStateStore();

// update state
onMounted(async ()=>{
  await setupProjectState(route.params.classId.toString(), route.params.id.toString());
  state.setProjectPage("sharedFiles");
});
</script>

<style>

</style>