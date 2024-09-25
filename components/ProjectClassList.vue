<template>
  <div>
    <div class="section">
      <div class="section-title">
        <h3>
          <Icon name="fluent:people-community-20-regular" />
          {{ props.personal ? $t("projects.personal") : props.projectClass.name }}
        </h3>
        <div class="controls">
          <IconButton 
            v-if="actionIsUsable('edit', props.projectClass.role)" 
            :styles="{...buttonStyle, size: 'small'}" 
            @click="viewAnnouncements"
            expanding :expanded="false" 
            icon="fluent:megaphone-20-regular"/>
          <IconButton 
            v-if="actionIsUsable('edit', props.projectClass.role)" 
            :styles="{...buttonStyle, size: 'small'}" 
            @click="openEditClass(props.projectClass)"
            expanding :expanded="false" 
            icon="fluent:edit-20-regular"/>
          <IconButton 
            v-if="actionIsUsable('template-add', props.projectClass.role)" 
            :styles="{...buttonStyle, size: 'small'}" 
            expanding :expanded="false" 
            @click="openCreateProject('Template', props.personal, props.projectClass.classId)"
            icon="fluent:stack-add-20-regular"/>
          <IconButton 
            v-if="actionIsUsable('add', props.projectClass.role)"
            :styles="{...buttonStyle, size: 'small'}"
            expanding :expanded="false"
            @click="openCreateProject('Project', props.personal, props.projectClass.classId)"
            icon="fluent:add-circle-20-regular"/>
        </div>
      </div>
    </div>
    <div class="project-list">
      <ProjectButton 
        v-for="template in props.projectClass.templates" 
        template :caption="template.name"
        @click="viewTemplate(template.templateId, template)"/>
      <ProjectButton 
        v-for="project in props.projectClass.projects" 
        :caption="project.name"
        @click="navToProj(project.projectId, props.projectClass.classId)"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { ButtonStyle } from '~/types/Button';
import { defaultClose } from '~/types/Dialog';
import type { OwnershipRole, ProjectClass, Template } from '~/types/ProjectClass';

const {t} = useI18n();

const props = defineProps({
  projectClass: {type: Object as PropType<ProjectClass>, required: true},
  personal: {type: Boolean, default: false},
});

const actionIsUsable = (action: string, role: OwnershipRole) => {
  if (role === "OWNER") return true;
  if (role === "ADMIN") return true;

  if (role === "STUDENT"){
    if (action === "add") return true;
    return false;
  }

  if (role === "TUTOR"){
    if (action === "template-add") return true;
    if (action === "edit") return true;
  }
  
  return false;
}

const buttonStyle: ButtonStyle = {colorPreset: "accent"};

// New Project Template
const dialogControl = useDialogs();
const openCreateProject = (template: string, personal: boolean, classId: number) => dialogControl.closeAllWithTypeThenOpen({
  width: "450px",
  height: t("fit-content"),
  title: t(`projects.new${template}.title`),
  dialogType: "createProjectTemplate",
  close: {
    ...defaultClose,
    caption: t(`dialogCommon.cancel`), 
    style: {colorPreset: "strong"}
  },
  actionsRight: [
    {
      caption: t(`dialogCommon.confirm`),
      icon: "fluent:checkmark-20-regular",
      style: {colorPreset: "accent-strong"},
      action: async (ctx, name: string) => {
        const projectClasses = useProjectClassStore();
        
        name = name.trim();

        if (name === "") {
          const projId = await projectClasses.createProject(classId, name);
          dialogControl.closeAllDialogs();
          if (projId !== undefined) navigateTo(`/projects/${props.projectClass.classId}/${projId}`);
        }

        if (template === "Template"){
          await projectClasses.addTemplate(classId, name);
        }

        dialogControl.closeDialog(ctx.id);
      },
      expanding: false,
    }
  ],
  payload: {
    personal, 
    template: template === "Template",
    classId,
  }
});

// edit class
const openEditClass = (projectClass: ProjectClass) => dialogControl.closeAllWithTypeThenOpen({
  width: "650px",
  height: "fit-content",
  title: t(`projects.editClass.title`),
  dialogType: "editClass",
  close: {
    caption: t(`dialogCommon.confirm`),
    icon: "fluent:checkmark-20-regular",
    style: {colorPreset: "accent-strong"},
    expanding: true,
  },
  payload: { projectClass }
});

// nav
const navToProj = (id: number, classId: number) => navigateTo(`/projects/${classId}/${id}`);

// template
const viewTemplate = (id: number, template: Template) => {
  
  dialogControl.closeAllWithTypeThenOpen({
    dialogType: "editTemplate",
    width: "650px",
    title: template.name,
    close: {
      caption: t(`dialogCommon.confirm`),
      icon: "fluent:checkmark-20-regular",
      style: {colorPreset: "accent-strong"},
      expanding: true,
    },
    payload: {
      templateId: id,
      projectClassId: props.projectClass.classId,
    }
  });
};

// announcements
const viewAnnouncements = () => {
  dialogControl.closeAllWithTypeThenOpen({
    dialogType: "listAnnouncements",
    payload: {
      projectClass: props.projectClass,
    },
    width: "900px",
    close: defaultClose,
    title: t('projects.announcements')
  })
}
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";

.section {
  background: var(--layer-background);
  padding: $space-medium;
  padding-left: $space-large;
  flex: 3;
  min-width: 500px;

  & .section-title {
    @include flex-row;
    @include flex-cross(center);
    @include flex-main(space-around);

    & .controls { @include flex-row; };
    & h3 { flex: 1; }
  }
}

.project-list {
  @include flex-col;
  @include flex-cross(stretch);

  background: var(--layer-background);
  padding: $space-medium;
  padding-top: 0;
}


h3 {
  @include typemix-label(var(--accent-strong));
  @include flex-row;
  @include flex-main(flex-start);

  gap: $space-medium;
  margin: 0;

  & span { font-size: $icon-size-medium; }
}
</style>