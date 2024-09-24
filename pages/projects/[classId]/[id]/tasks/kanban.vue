<template>
  <div class="proj-page-root">
    <div class="action-group">
      <Button
        :caption="$t('projectView.tasks.allTasksView')"
        :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)', size: 'small'}"
        @click="navToTasks"
      />
      <div class="selected">
        <Button
          :caption="$t('projectView.tasks.kanbanView')"
          :styles="{colorPreset: 'accent-strong', size: 'small'}"
          @click=""
        />
      </div>
      <Button
        :caption="$t('projectView.tasks.timelineView')"
        :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)', size: 'small'}"
        @click="navToTimeline"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { setupProjectState } from '~/scripts/ProjectClassesFetches';

const state = useAppStateStore();
const route = useRoute();

// update state
onMounted(async ()=>{
  await setupProjectState(route.params.classId.toString(), route.params.id.toString());
  state.setProjectPage("tasks");
});

// tab nav
const navToTasks = () => navigateTo("../tasks");
const navToTimeline = () => navigateTo("timeline");
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

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