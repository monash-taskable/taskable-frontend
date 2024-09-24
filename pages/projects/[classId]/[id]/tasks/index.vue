<template>
  <div class="proj-page-root">
    <div class="actions">
      <div class="action-group">
        <div class="selected">
          <Button
            :caption="$t('projectView.tasks.allTasksView')"
            :styles="{colorPreset: 'accent-strong', size: 'small'}"
          />
        </div>
        <Button
          :caption="$t('projectView.tasks.kanbanView')"
          :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)', size: 'small'}"
          @click="navToKanban"
        />
        <Button
          :caption="$t('projectView.tasks.timelineView')"
          :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)', size: 'small'}"
          @click="navToTimeline"
        />
      </div>
      <div class="action-group">
        <IconButton
          :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)', size: 'small'}"
          caption="hi"
        />
      </div>
    </div>
    <div class="tasks">
      <TaskList :task="task"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { setupProjectState } from '~/scripts/ProjectClassesFetches';
import type { Task } from '~/types/ProjectClass';

const state = useAppStateStore();
const route = useRoute();

// data
const tasks: Ref<Task[]> = ref([]);

const task: Task = {
  title: "Task112",
  description: "hello",
  id: 12,
  subtasks: [
    {id: 134, title: "Test Subtask", due: new Date(), priority: "", start: new Date(), description: "", status: ""},
    {id: 144, title: "Test Subtask", due: new Date(), priority: "", start: new Date(), description: "", status: ""},
  ],
}

// update state
onMounted(async ()=>{
  await setupProjectState(route.params.classId.toString(), route.params.id.toString());
  state.setProjectPage("tasks");
});

// tab nav
const navToKanban = () => navigateTo("tasks/kanban");
const navToTimeline = () => navigateTo("tasks/timeline");
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

.actions {
  @include flex-row;
  @include flex-main(flex-start);

  gap: $space-medium;
}

.action-group {
  @include flex-row;
  @include flex-main(flex-start);

  & button {
    border-bottom: 0;
    padding-bottom: $space-small !important;
  }
  
  &>.selected button {
    border-bottom: 2px solid var(--accent-strong);
    padding-bottom: calc($space-small - 2px) !important;
  }
}
</style>