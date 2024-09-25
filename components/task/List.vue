<template>
  <div
    :style="getStyle(task)" 
    :class="getClass(dragHovered)" 
    class="task-list" 
    @click="_onClick"
    @dragover="_dragOver"
    @dragexit="_dragEnd"
    @dragend="_dragEnd"
    @drop="_drop"
  >
    <div class="title">
      {{ task.title }}
    </div>
    <div class="description" v-if="task.description.trim()">
      {{ task.description.trim() }}
    </div>
    <div class="subtasks content">
      <TaskListEntry :readonly="props.readonly" @click="() => editSubtask(subtask)" v-for="subtask in subtasksRef.filter(x => x.priority === 'urgent')" :subtask="subtask"/>
      <TaskListEntry :readonly="props.readonly" @click="() => editSubtask(subtask)" v-for="subtask in subtasksRef.filter(x => x.priority === 'non-urgent')" :subtask="subtask"/>
    </div>
    <div class="actions content" v-if="!props.selectable && !props.readonly">
      <IconButton
        :styles="{foregroundColor: 'var(--tc-strong)', backgroundColorHover: 'var(--tc-weak)'}"
        :caption="$t('projectView.tasks.addSubtask')"
        icon="fluent:add-20-regular"
        @click="createSubtask"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { findInList, ident } from '~/scripts/Utils';
import { isTaskStatus, type DropSubtaskEvent, type Subtask, type Task, type TaskStatus } from '~/types/ProjectClass';

const emits = defineEmits(["click", "create", "edit", "drop"]);
const props = defineProps({
  tasks: {type: Object as PropType<Task[]>, required: true},
  task: {type: Object as PropType<Task>, required: true},
  subtasks: {type: Object as PropType<Subtask[]>, required: true},
  selectable: {type: Boolean, default: false},
  selected: {type: Boolean, default: false},
  readonly: {type: Boolean, default: false}
});

const dragHovered = ref(false);

const createSubtask = () => emits("create");
const editSubtask = (subtask: Subtask) => {
  if (props.readonly) return;

  emits("edit", {subtask})
};

const _dragOver = (e: DragEvent) => {
  if (props.readonly) return;
  
  e.preventDefault();

  const taskId = Number(e.dataTransfer?.getData("sourceTaskId"));

  dragHovered.value = props.task.id !== taskId;
}
const _dragEnd = () => {
  if (props.readonly) return;

  dragHovered.value = false;
}
const _drop = (e: DragEvent) => {
  if (props.readonly) return;

  _dragEnd();

  const taskId = Number(e.dataTransfer?.getData("sourceTaskId"));
  const statusTxt = e.dataTransfer?.getData("status");
  const status: TaskStatus = isTaskStatus(statusTxt) ? statusTxt : 'progress';
  const subtaskId = Number(e.dataTransfer?.getData("subtaskId"));
  if (taskId === props.task.id) return;

  emits("drop", <DropSubtaskEvent>{
    subtaskId: subtaskId,
    sourceTask: findInList(props.tasks, t => t.id === taskId, ident)!,
    sourceStatus: status
  })
}

const {task, tasks, subtasks} = props;

const subtasksRef = ref(subtasks);

const getClass = (dragHover: boolean) => [
  props.selectable ? "selectable" : "",
  props.selected ? "selected" : "",
  dragHover ? "selectable selected hovered" : "",
].join(" ");

const getStyle = (task: Task) => {
  return [
    `--tc-weak: var(--tc-${task.color}-weak)`,
    `--tc-medium: var(--tc-${task.color}-medium)`,
    `--tc-strong: var(--tc-${task.color}-strong)`,
  ].join("; ");
}

const _onClick = () => {
  if (props.readonly) return;

  if (props.selectable) emits("click", {
    toggle: !props.selected
  });
}

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";

.task-list {
  @include flex-col;
  @include flex-cross(stretch);
  @include flex-main(flex-start);
  
  outline: 2px solid transparent;
  background: var(--layer-background);
  min-width: 400px;
}

.title {
  @include typemix-header(var(--tc-strong));

  padding: $space-medium-large $space-large;
}

.description {
  @include typemix-label(var(--foreground-weak));

  padding: 0 $space-large $space-medium-large $space-large;
}

.content {
  @include flex-col;
  @include flex-cross(stretch);
  
  padding: 0 $space-medium;
  gap: $space-medium;
  margin-bottom: $space-medium;
}

.selectable {

  &:hover, &.hovered {
    background: var(--accent-weak);
  }
  
  &.selected{
    outline: 2px solid var(--accent-strong);
  }

  .content {
    opacity: 0.4;
    pointer-events: none;
  }
}
</style>