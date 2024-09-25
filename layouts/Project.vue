<template>
  <div class="proj-layout-root">
    <ProjectNavigation :project-id="stateRef.projectId.value ?? 0" :selected="appState.projectPage"/>
    <div class="proj-layout-content"><slot /></div>
  </div>
</template>

<script lang="ts" setup>
const appState = useAppStateStore();
const stateRef = storeToRefs(appState);

const {t} = useI18n();
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

.proj-layout-root {
  height: 80%;
}

.proj-layout-content {
  padding-left: calc(
    calc(
      calc($space-medium-large * 2) + $icon-size-medium
    ) + calc($space-large * 2)
  );
  padding-top: $space-medium;
  padding-right: $space-large;

  height: 100%;
}
</style>