<template>
  <div class="body">
    <div class="group">
      <span>{{ $t('projects.editTemplate.nowViewing') }}</span>
      <EditableField :loading="updatingTemplateName" :value="(template ?? {name: ''}).name" inline @change="updateTemplateName"/>
    </div>

    <div class="group">
      <h3>{{ $t('projects.editTemplate.createProjectFromTemplate') }}</h3>
      <div class="actions">
        <IconButton
          @click="createSingleProject"
          icon="fluent:add-square-20-regular"
          :caption="$t('projects.editTemplate.createSingleProject')"
          :styles="{colorPreset: 'strong', backgroundColor:'var(--layer-background)', size: 'small'}"/>
        <IconButton
          @click=""
          icon="fluent:add-square-multiple-20-regular"
          :caption="$t('projects.editTemplate.batchProjectCreation')"
          :styles="{colorPreset: 'strong', backgroundColor:'var(--layer-background)', size: 'small'}"/>
      </div>
    </div>

    <div v-if="projectClass.role === 'OWNER'" class="group">
      <h3>{{ $t('projects.editClass.actions') }}</h3>
      <div class="actions">
        <IconButton
          @click="deleteTemplate"
          icon="fluent:delete-20-regular"
          :caption="$t('projects.editTemplate.deleteTemplate')"
          :styles="{colorPreset: 'dangerous-strong', size: 'small'}"/>
        <IconButton v-if="(template ?? {archived : false}).archived"
          icon="fluent:archive-arrow-back-20-regular"
          :caption="$t('projects.editTemplate.unarchiveTemplate')"
          :styles="{colorPreset: 'strong', backgroundColor:'var(--layer-background)', size: 'small'}"
          @click="unarchiveTemplate"/>
        <IconButton v-else
          icon="fluent:archive-20-regular"
          :caption="$t('projects.editTemplate.archiveTemplate')"
          :styles="{colorPreset: 'strong', backgroundColor:'var(--layer-background)', size: 'small'}"
          @click="archiveTemplate"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sprintf } from 'sprintf-js';
import type { PropType } from 'vue';
import { findInList, ident } from '~/scripts/Utils';
import { defaultClose, type Dialog, type DialogAction } from '~/types/Dialog';

const projectClasses = useProjectClassStore();
const dialogs = useDialogs();
const {t} = useI18n();

const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    templateId: number,
    projectClassId: number,
  }>>, required: true},
});

const { projectClassId, templateId } = props.context.payload;
const projectClass = projectClasses.projectClasses[projectClassId];
const template = findInList(projectClass.templates, t => t.templateId === templateId, ident);

// update template name
const updatingTemplateName = ref(false);
const updateTemplateName = async (name: string) => {
  updatingTemplateName.value = true;

  const _template = template;
  
  if (_template){
    await projectClasses.updateTemplate(projectClass.classId, _template.templateId, name);
    await projectClasses.loadTemplate(projectClass.classId, _template.templateId);
  }
  
  updatingTemplateName.value = false;
}

// template actions
const archiveTemplate = async () => {
  await projectClasses.updateTemplate(projectClassId, templateId, undefined, undefined, true);
}
const unarchiveTemplate = async () => {
  await projectClasses.updateTemplate(projectClassId, templateId, undefined, undefined, false);
}
const deleteTemplate = async () => {
  dialogs.closeAllWithTypeThenOpen({
    dialogType: "optionsAlert",
    width: "400px",
    close: defaultClose,
    payload: {
      message: sprintf(t("projects.editTemplate.deleteConfirmMsg"), (template ?? {name: ''}).name),
      actions: [<DialogAction>{
        caption: t("dialogCommon.cancel"),
        icon: "fluent:arrow-turn-up-left-20-regular",
        expanding: false,
        style: {colorPreset: 'strong', backgroundColor: 'var(--layer-background)'},
        action: (c: Dialog<any>, _: any) => dialogs.closeDialog(c.id)
      },{
        caption: t("projects.editTemplate.deleteTemplate"),
        icon: "fluent:delete-20-regular",
        expanding: false,
        style: {colorPreset: 'dangerous-strong'},
        action: async (c: Dialog<any>, _: any) => {
          await projectClasses.deleteTemplate(projectClassId, templateId);
          dialogs.closeAllDialogs();
        }
      }]
    },
    title: t("projects.editTemplate.deleteTemplate")
  })
}

// project creation
const createSingleProject = async () => dialogs.closeAllWithTypeThenOpen({
  close: defaultClose,
  dialogType: "createProjectTemplate",
  title: t("projects.editTemplate.createSingleProjectFromTemplate"),
  payload: {
    template: true,
    personal: false,
    classId: projectClassId,
  },
  width: "500px",
  actionsRight: [
    {
      caption: t(`dialogCommon.confirm`),
      icon: "fluent:checkmark-20-regular",
      style: {colorPreset: "accent-strong"},
      expanding: false,
      action: async (_, name: string) => {
        
        name = name.trim();
        if (name === "") return;
        
        const projId = await useProjectClassStore().createSingleProjectFromTemplate(projectClassId, templateId, name);
        
        dialogs.closeAllDialogs();
        if (projId !== undefined) navigateTo(`/projects/${projectClassId}/${projId}`);
      },
    }
  ]
})
</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";

.body {
  @include flex-col;
  @include flex-cross(stretch);

  padding: $space-extra;
  height: var(--height);
  gap: $space-large;
}

.group {
  h3, span {
    @include typemix-label;
    margin: 0;
    margin-bottom: $space-small;
  }
}

.text-input {
  width: 60%;
}

.actions {
  @include flex-row;
  @include flex-main(flex-start);

  gap: $space-small;
}

</style>