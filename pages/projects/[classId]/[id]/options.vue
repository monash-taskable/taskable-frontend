<template>
  <div class="page-root">
    <h2>
      {{ $t('projectView.options') }}
      <Skeleton size="title" v-if="loading"/>
      <EditableField
        size="title"
        :value="projName"
        @change="updateProjName" 
        :loading="projNameUpdating" 
        v-else-if="status === 'Mutable'" />
      <span v-else> {{ projName }} </span>
    </h2>
    <div class="group">
      <div class="actions">
        <IconButton
          @click=""
          icon="fluent:delete-20-regular"
          :caption="$t('projectView.deleteProject')"
          :styles="{colorPreset: 'dangerous-strong'}"/>
        <IconButton v-if="project && project.archived"
          icon="fluent:archive-arrow-back-20-regular"
          :caption="$t('projectView.unarchiveProject')"
          :styles="{colorPreset: 'strong', backgroundColor:'var(--layer-background)'}"
          @click="unarchive"/>
        <IconButton v-else-if="project && !project.archived"
          icon="fluent:archive-20-regular"
          :caption="$t('projectView.archiveProject')"
          :styles="{colorPreset: 'strong', backgroundColor:'var(--layer-background)'}"
          @click="archive"/>
        <IconButton v-else
          icon="fluent:archive-20-regular"
          :styles="{colorPreset: 'strong', backgroundColor:'var(--layer-background)'}"
        ><Skeleton/></IconButton>
        <IconButton
          @click=""
          icon="fluent:plug-disconnected-20-regular"
          :caption="$t('projectView.detachTemplate')"
          :styles="{colorPreset: 'strong', backgroundColor:'var(--layer-background)'}"/>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getProject, getProjectStatus, updateProject } from '~/scripts/ProjectClassesFetches';
import type { Optional } from '~/types/Optional';
import type { Project, ProjectStatus } from '~/types/ProjectClass';

const state = useAppStateStore();

const loading = ref(true);
const project: Ref<Optional<Project>> = ref(undefined);
const status: Ref<ProjectStatus> = ref("Immutable");

// update project name
const projName = ref("");
const projNameUpdating = ref(false);
const updateProjName = async () => {
  projNameUpdating.value = true;
  await updateProject(state.classId ?? -1, state.projectId ?? -1, {name: projName.value});
  project.value = await getProject(state.classId ?? -1, state.projectId ?? -1);
  projName.value = project.value!.name;
  projNameUpdating.value = false;
}

// actions
const archive = async () => {
  project.value = undefined;
  await updateProject(state.classId ?? -1, state.projectId ?? -1, {archived: true});
  project.value = await getProject(state.classId ?? -1, state.projectId ?? -1);
}
const unarchive = async () => {
  project.value = undefined;
  await updateProject(state.classId ?? -1, state.projectId ?? -1, {archived: false});
  project.value = await getProject(state.classId ?? -1, state.projectId ?? -1);
}

// update state
onMounted(async () => {
  state.setProjectPage("options");

  project.value = await getProject(state.classId ?? -1, state.projectId ?? -1);
  status.value = await getProjectStatus(state.classId ?? -1);
  projName.value = project.value!.name;
  
  loading.value = false;
});
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

.page-root {
  @include flex-col;
  @include flex-cross(flex-start);
  @include flex-main(flex-start);

  gap: $space-large;
}


h2 {
  @include typemix-title;
  @include flex-row;
  @include flex-cross(center);
  @include flex-main(flex-start);
  
  margin: 0;
  gap: $space-medium;
}

h3 {
  @include typemix-label;
  margin: 0;
}

.group {
  @include flex-col;
  @include flex-cross(flex-start);
  @include flex-main(flex-start);
  
  gap: $space-medium;
}

.actions {
  @include flex-row;
  @include flex-main(flex-start);
  gap: $space-medium;
  
}

</style>