<template>
  <div :style="getStyle(task)" :class="getClass()" class="task-list" @click="_onClick">
    <div class="title">
      {{ task.title }}
    </div>
    <div class="description" v-if="task.description.trim()">
      {{ task.description.trim() }}
    </div>
    <div class="subtasks content">
      <TaskListEntry v-for="subtask in subtasks.filter(x => x.priority === 'urgent')" :subtask="subtask"/>
      <TaskListEntry v-for="subtask in subtasks.filter(x => x.priority === 'non-urgent')" :subtask="subtask"/>
    </div>
    <div class="actions content" v-if="!props.selectable">
      <IconButton
        :styles="{foregroundColor: 'var(--tc-strong)', backgroundColorHover: 'var(--tc-weak)'}"
        :caption="$t('projectView.tasks.addSubtask')"
        icon="fluent:add-20-regular"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Subtask, Task } from '~/types/ProjectClass';

const emits = defineEmits(["click"]);
const props = defineProps({
  task: {type: Object as PropType<Task>, required: true},
  subtasks: {type: Object as PropType<Subtask[]>, required: true},
  selectable: {type: Boolean, default: false},
  selected: {type: Boolean, default: false},
});

const getClass = () => [
  props.selectable ? "selectable" : "",
  props.selected ? "selected" : "",
].join(" ");

const getStyle = (task: Task) => {
  return [
    `--tc-weak: var(--tc-${task.color}-weak)`,
    `--tc-medium: var(--tc-${task.color}-medium)`,
    `--tc-strong: var(--tc-${task.color}-strong)`,
  ].join("; ");
}

const _onClick = () => {
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

  &:hover {
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