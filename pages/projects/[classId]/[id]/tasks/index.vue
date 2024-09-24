<template>
  <div class="proj-page-root">
    <div class="tabs">
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
  </div>
</template>

<script lang="ts" setup>

// update state
const state = useAppStateStore();
onMounted(()=>{
  state.setProjectPage("tasks");
});

// tab nav
const navToKanban = () => navigateTo("tasks/kanban");
const navToTimeline = () => navigateTo("tasks/timeline");
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

.tabs {
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