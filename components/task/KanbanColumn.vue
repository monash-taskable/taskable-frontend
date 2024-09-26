<template>
  <div 
    :class="getClass(outlined)" 
    class="kanban-column"
    @dragover="_dragOver"
    @dragexit="_dragEnd"
    @dragend="_dragEnd"
    @drop="_drop"
  >
    <div class="title">{{ $t(`status.${props.status}`) }}</div>
    <div class="list">
      <ListEntry v-for="subtask in subtasks" 
        :subtask="subtask"
        :readonly="props.readonly"
        @click="() => editSubtask(subtask)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { isTaskStatus, type Subtask, type Task, type TaskStatus } from '~/types/ProjectClass';
import ListEntry from './ListEntry.vue';
import { findInList, ident } from '~/scripts/Utils';

const emits = defineEmits(["edit", "drop"]);
const props = defineProps({
  tasks: {type: Object as PropType<Task[]>, required: true},
  subtasks: {type: Object as PropType<Subtask[]>, required: true},
  status: {type: String as PropType<TaskStatus>, required: true},
  readonly: {type: Boolean, default: false},
});

const outlined = ref(false);

const _dragOver = (e: DragEvent) => {
  
  if (props.readonly) return;
  e.preventDefault();
  
  const statusTxt = e.dataTransfer?.getData("sourceStatus");
  outlined.value = statusTxt !== props.status;
}
const _dragEnd = () => {
  if (props.readonly) return;

  outlined.value = false;
}
const _drop = (e: DragEvent) => {
  if (props.readonly) return;

  _dragEnd();

  const statusTxt = e.dataTransfer?.getData("sourceStatus");
  const status: TaskStatus = isTaskStatus(statusTxt) ? statusTxt : 'progress';
  const subtaskId = Number(e.dataTransfer?.getData("subtaskId"));
  const taskId = Number(e.dataTransfer?.getData("sourceTaskId"));
  if (status === props.status) return;

  emits("drop", {
    subtaskId: subtaskId,
    sourceTask: findInList(props.tasks, t => t.id === taskId, ident),
    sourceStatus: status
  })
}

const editSubtask = (subtask: Subtask) => {
  if (props.readonly) return;
  emits("edit", {subtask});
}

const getClass = (outlined: boolean) => {
  return outlined?"outlined":"";
}
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";

.kanban-column {
  @include flex-col;
  @include flex-cross(stretch);
  @include flex-main(flex-start);
  
  outline: 2px solid transparent;
  background: var(--layer-background);
  min-width: 400px;
}

.title {
  @include typemix-header();
  background: var(--accent-weak);
  color: var(--accent-strong);
  padding: $space-medium-large $space-large;
}

.list {
  @include flex-col;
  @include flex-cross(stretch);
  @include flex-main(flex-start);
  
  padding: 0 $space-medium;
  gap: $space-medium;
  margin: $space-medium 0;
  height: 500px;
  overflow-y: auto;
}

.outlined {
  background: var(--accent-weak);
  outline: 2px solid var(--accent-strong);

  .list {
    opacity: 0.4;
    pointer-events: none;
  }
}
</style>