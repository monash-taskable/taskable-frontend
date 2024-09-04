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
            expanding :expanded="false" 
            icon="fluent:edit-20-regular"/>
          <IconButton 
            v-if="actionIsUsable('template-add', props.projectClass.role)" 
            :styles="{...buttonStyle, size: 'small'}" 
            expanding :expanded="false" 
            @click="openCreateProject('Template')"
            icon="fluent:stack-add-20-regular"/>
          <IconButton 
            v-if="actionIsUsable('add', props.projectClass.role)" 
            :styles="{...buttonStyle, size: 'small'}" 
            expanding :expanded="false"
            @click="openCreateProject('Project')"
            icon="fluent:add-circle-20-regular"/>
        </div>
      </div>
    </div>
    <div class="project-list">
      <ProjectButton template caption="hello world"/>
      <ProjectButton template caption="hello world"/>
      <ProjectButton caption="hello world"/>
      <ProjectButton caption="hello world"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { ButtonStyle } from '~/types/ButtonStyle';
import { defaultClose, quickAlert } from '~/types/Dialog';
import type { OwnershipRole, ProjectClass } from '~/types/ProjectClass';

const props = defineProps({
  projectClass: {type: Object as PropType<ProjectClass>, required: true},
  personal: {type: Boolean, default: false},
});

const actionIsUsable = (action: string, role: OwnershipRole) => {
  if (role === "Owner") return true;
  if (role === "Admin") return true;

  if (role === "Student"){
    if (action === "add") return true;
    return false;
  }

  if (role === "Tutor"){
    if (action === "template-add") return true;
    if (action === "edit") return true;
  }
  
  return false;
}

const buttonStyle: ButtonStyle = {colorPreset: "accent"};

// New Project Template
const dialogControl = useDialogs();
const openCreateProject = (template: string) => dialogControl.closeAllWithTypeThenOpen({
  width: "450px",
  height: "fit-content",
  title: `projects.new${template}.title`,
  titleI18n: true,
  dialogType: "createProjectTemplate",
  close: {
    ...defaultClose,
    caption: `projects.new${template}.cancel`, 
    style: {colorPreset: "strong"}
  },
  actionsRight: [
    {
      caption: `projects.new${template}.confirm`,
      captionI18n: true,
      icon: "fluent:checkmark-20-regular",
      style: {colorPreset: "accent-strong"},
      action: (_, x) => quickAlert(x),
      expanding: false,
    }
  ],
  payload: {
    template: template === "Template"
  }
});
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