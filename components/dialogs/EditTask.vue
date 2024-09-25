<template>
  <div class="form-root">
    <div class="group">
      <div class="icon">
        <Icon name="fluent:slide-text-20-regular"/>
      </div>
      <div class="content">
        <TextInput
          focused
          :styles="{colorPreset: 'layer',size: 'small'}"
          :placeholder="$t('projectView.tasks.title')"
          @change="emitChange"
          v-model="title"
          :value="task.title"
        />
      </div>
    </div>
    <div class="group">
      <div class="icon"/>
      <div class="content">
        <Multiline
          :styles="{colorPreset: 'layer',size: 'small', height: '130px'}"
          :placeholder="$t('projectView.tasks.description')"
          @change="emitChange"
          v-model="description"
          :value="task.description"
        />
      </div>
    </div>
    <div class="group">
      <div class="icon no-pad">
        <Icon name="fluent:color-20-regular"/>
      </div>
      <div class="content color-picker">
        <TaskColorPreview 
          v-for="_color in taskColors" 
          :selected="_color === color"
          :color="_color" 
          @click="colorChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Dialog } from '~/types/Dialog';
import { taskColors, type Task, type TaskColor } from '~/types/ProjectClass';

const emits = defineEmits(["emit"]);
const props = defineProps({
  context: {type: Object as PropType<Dialog<Task>>, required: true},
});

const task = props.context.payload;

const title = ref(task.title);
const description = ref(task.description);
const color: Ref<TaskColor> = ref(task.color);

const colorChange = (_color: TaskColor) => {
  color.value = _color;
  emits("emit", {
    title: title.value,
    description: description.value,
    color: color.value}
  )
}

onMounted(() => {
  emits("emit", {
    title: title.value,
    description: description.value,
    color: color.value}
  )
})

const emitChange = () => {
  emits("emit", {
    title: title.value,
    description: description.value,
    color: color.value}
  )
}

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Flex.scss";

.form-root {
  @include flex-col;
  @include flex-cross(stretch);

  padding: $space-medium-large;
  gap: $space-medium;
}

.group {
  @include flex-row;
  @include flex-cross(flex-start);
  
  gap: $space-medium;
  
  &:has(.no-pad) {
    @include flex-cross(center);
  }

  .icon {
    padding-top: $space-small;
    color: var(--foreground);
    
    &.no-pad {
      padding-top: 0;
    }

    &, span {
      width: $icon-size-medium;
      height: $icon-size-medium;
    }
  }

  .content {
    flex: 1;
    ::v-deep .field { width: 100% }
  }
}

.color-picker {
  @include flex-row;
  @include flex-cross(center);
  @include flex-main(flex-start);
}
</style>