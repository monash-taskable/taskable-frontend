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
      <div v-if="project && project.template">{{ sprintf($t('projectView.partOf'), project.template.name) }}</div>
      <div class="actions">
        <IconButton
          @click="deleteProject"
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
        <IconButton v-if="project && project.template"
          @click="detachProject"
          icon="fluent:plug-disconnected-20-regular"
          :caption="$t('projectView.detachTemplate')"
          :styles="{colorPreset: 'strong', backgroundColor:'var(--layer-background)'}"/>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sprintf } from 'sprintf-js';
import { getProject, getProjectStatus, updateProject, deleteProject as deleteProjectFetch, setupProjectState, detachProject as detachProjectFetch } from '~/scripts/ProjectClassesFetches';
import { defaultClose, type Dialog, type DialogAction } from '~/types/Dialog';
import type { Optional } from '~/types/Optional';
import type { Project, ProjectStatus } from '~/types/ProjectClass';

const state = useAppStateStore();
const dialogs = useDialogs();
const route = useRoute();
const {t} = useI18n();

const loading = ref(true);
const project: Ref<Optional<Project>> = ref(undefined);
const status: Ref<ProjectStatus> = ref("Immutable");

// update project name
const projName = ref("");
const projNameUpdating = ref(false);
const updateProjName = async (newName: string) => {
  projNameUpdating.value = true;
  await updateProject(state.classId ?? -1, state.projectId ?? -1, {name: newName});
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
const deleteProject = async () => {
  dialogs.closeAllWithTypeThenOpen({
    dialogType: "optionsAlert",
    width: "400px",
    close: defaultClose,
    payload: {
      message: sprintf(t("projectView.deleteConfirmMsg"), (project.value ?? {name: ''}).name),
      actions: [<DialogAction>{
        caption: t("dialogCommon.cancel"),
        icon: "fluent:arrow-turn-up-left-20-regular",
        expanding: false,
        style: {colorPreset: 'strong', backgroundColor: 'var(--layer-background)'},
        action: (c: Dialog<any>, _: any) => dialogs.closeDialog(c.id)
      },{
        caption: t("projectView.deleteProject"),
        icon: "fluent:delete-20-regular",
        expanding: false,
        style: {colorPreset: 'dangerous-strong'},
        action: async (c: Dialog<any>, _: any) => {
          await deleteProjectFetch(state.classId ?? -1, state.projectId ?? -1);
          location.href = "/projects";
        }
      }]
    },
    title: t("projectView.deleteConfirm")
  })
}
const detachProject = async () =>{
  await detachProjectFetch(state.classId ?? -1, state.projectId ?? -1);
  project.value = await getProject(state.classId ?? -1, state.projectId ?? -1);
}

// update state
onMounted(async () => {
  state.setProjectPage("options");

  await setupProjectState(route.params.classId.toString(), route.params.id.toString());

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