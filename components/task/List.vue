<template>
  <div class="task-list">
    <div></div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Task } from '~/types/ProjectClass';

const props = defineProps({
  task: {type: Object as PropType<Task>, required: true},
  classId: {type: Number, required: true},
  projectId: {type: Number, required: true},
});
</script>

<style>

</style>