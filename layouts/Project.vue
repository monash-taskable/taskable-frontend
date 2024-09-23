<template>
  <div class="proj-layout-root">
    <ProjectNavigation :project-id="stateRef.projectId.value ?? 0" :selected="appState.projectPage"/>
    <div class="proj-layout-content"><slot /></div>
  </div>
</template>

<script lang="ts" setup>
import { loadClassIfNotExist } from '~/scripts/ProjectClassesFetches';
import { isNumericString } from '~/scripts/Utils';

const appState = useAppStateStore();
const stateRef = storeToRefs(appState);

const {t} = useI18n();

onMounted(() => {
  const route = useRoute();
  const id = route.params.id.toString().trim();
  const classId = route.params.classId.toString().trim();
  if (
    id === '' ||
    !isNumericString(id) ||
    (!isNumericString(classId) && classId !== "-1")
  ) {
    useDialogs().closeAllWithTypeThenOpen({
      title: t("dialogError.somethingWentWrong"),
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
  appState.setClass(Number(classId));
  loadClassIfNotExist(Number(classId));
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
    ) + calc($space-large * 2)
  );
  padding-top: $space-medium;
  padding-right: $space-large;
}
</style>