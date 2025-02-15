<template>
  <div :draggable="props.readonly ? 'false' : 'true'" @dragstart="_onDrag" @click="_onClick" class="list-entry" :class="getClass(subtask)" :style="getStyle(subtask)">
    <div class="label" draggable="false">
      <div class="icon-holder"><Icon name="fluent:re-order-dots-vertical-20-regular"/></div>
      <div class="title">{{ subtask.title }}</div>
      <div class="indicator">
        <Icon name="fluent:checkmark-circle-16-regular" v-if="subtask.status === 'done'"/>
        <Icon name="fluent:timer-16-regular" v-else-if="subtask.priority === 'urgent' && !overdue(subtask)"/>
        <Icon class="red" name="fluent:person-warning-16-regular" v-if="subtask.assignment.length === 0 && subtask.status !== 'done'"/>
        <Icon class="red" name="fluent:warning-16-regular" v-if="overdue(subtask) && subtask.status !== 'done'"/>
      </div>
    </div>
    <div class="progress-bar" v-if="subtask.status !== 'done' && !overdue(subtask)"/>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { getDatePercentage } from '~/scripts/Datetime';
import type { Subtask } from '~/types/ProjectClass';

const props = defineProps({
  subtask: {type: Object as PropType<Subtask>, required: true},
  readonly: {type: Boolean, default: false},
  highlighted: {type: Boolean, default: false}
})

const now = new Date();
const percent = (subtask: Subtask) => getDatePercentage(subtask.start, subtask.end, now);
const overdue = (subtask: Subtask) => subtask.status !== 'done' && getDatePercentage(subtask.start, subtask.end, now) === 1;

const _onDrag = (event: DragEvent) => {
  
  event.dataTransfer?.setData("subtaskId", String(props.subtask.id));
  event.dataTransfer?.setData("sourceTaskId", String(props.subtask.task.id));
  event.dataTransfer?.setData("sourceStatus", String(props.subtask.status));
}

const getClass = (subtask: Subtask) => {
  const p = percent(props.subtask);
  const done = props.subtask.status === 'done';
  const overdue = !done && p === 1;
  const due = !done && !overdue && p >= 0.8;
  return [
    props.readonly ? "readonly" : "",
    props.highlighted ? "highlighted" : "",
    subtask.status,
    overdue ? "overdue" : "",
    due ? "due" : "",
  ].join(" ");
};
const getStyle = (subtask: Subtask) => {
  return [
    `--task-percent: ${Math.floor(percent(subtask) * 100)}%`,
    `--tc-strong: var(--tc-${subtask.task.color}-strong)`,
    `--tc-weak: var(--tc-${subtask.task.color}-weak)`,
    `--tc-medium: var(--tc-${subtask.task.color}-medium)`,
  ].join("; ");
}

const emits = defineEmits(["click"]);
const _onClick = () => emits("click");
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Typography.scss";

.list-entry {
  @include flex-col;
  @include flex-main(flex-start);
  @include flex-cross(stretch);

  background: var(--background);

  &.overdue {
    background: var(--dangerous-weak);
    .label {color: var(--dangerous-strong)}

    &:hover .icon-holder{
      background: transparent;
      span {color: var(--dangerous-strong)}
    }
  }
}

.indicator {
  @include flex-row;
  @include flex-cross(center);

  gap: $space-small;

  span {
    height: $icon-size-small;
    width: $icon-size-small;
    color: var(--foreground-weak);
  }

  .red {
    color: var(--dangerous-strong)
  }
}

.label {
  @include flex-row;
  @include flex-main(flex-start);
  @include flex-cross(center);
  @include typemix-label;
  
  padding-right: $space-medium;
  user-select: none;
  gap: $space-small;
  
  &:not(.readonly) {
    cursor: pointer;
    .icon-holder { cursor: grab; }
  };

  .title {flex: 1};
}

.icon-holder {
  padding: $space-medium;
  padding-right: $space-small;
  height: $icon-size-small;
  width: $icon-size-small;
  
  span {
    height: $icon-size-small;
    width: $icon-size-small;
    color: var(--foreground-weak);
  }

  .list-entry:hover &, .list-entry.highlighted & {
    background: var(--tc-weak);
    span {color: var(--tc-strong);}
  }
}

.progress-bar {
  height: 3px;
  display: block;

  &::after {
    display: block;
    content: '';
    position: relative;
    top: 0;
    left: 0;
    height: 3px;
    width: var(--task-percent);
    background: var(--tc-medium);
  }
}

</style>