<template>
  <div class="proj-layout-root">
    <ProjectNavigation :project-id="stateRef.projectId.value ?? 0" :selected="appState.projectPage"/>
    <div class="proj-layout-content"><slot /></div>
  </div>
</template>

<script lang="ts" setup>
import { isNumericString } from '~/scripts/Utils';

const appState = useAppStateStore();
const stateRef = storeToRefs(appState);

onMounted(() => {
  const route = useRoute();
  const id = route.params.id.toString().trim();
  if (id === '' || !isNumericString(id)) {
    useDialogs().closeAllWithTypeThenOpen({
      title: "dialogError.somethingWentWrong",
      icon: "fluent:error-circle-20-regular",
      dialogType: "projectError",
      width: "400px",
      payload: undefined,
      style: {
        titleBackground: "var(--dangerous-weak)",
        titleColor: "var(--dangerous-strong)",
      },
    }, false);
    return;
  }

  appState.setProject(Number(id));
  appState.setProjectTitle("Debug");
})
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

.proj-layout-content {
  padding-left: calc(
    calc(
      calc($space-medium-large * 2) + $icon-size-medium
    ) + $space-large
  );
  padding-top: $space-medium;
}
</style>