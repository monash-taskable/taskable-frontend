<template>
  <div class="page-root">
    <div class="menu">
      <div class="greeting">
        {{ $t('home.welcomeBack') }} 
        <span>{{ getName(appState) }}</span>
        <Skeleton width="15rem" v-show="appState.sessionLoading" size="title"/>
      </div>
      <div class="row">
        <TitleButton 
          @click="navToProjects"
          :styles="buttonStyle"
          :description="$t('home.viewAllProjDesc')"
          :caption="$t('home.viewAllProj')"/>
        <TitleButton
          @click="navToSettings"
          icon="fluent:settings-20-regular"
          :styles="buttonStyle"
          :description="$t('home.appSettingsDesc')"
          :caption="$t('home.appSettings')"/>
      </div>
      <div class="row">
        <TitleButton
          icon="fluent:add-square-20-regular"
          :styles="buttonStyle"
          :description="$t('home.newProjDesc')"
          @click="openCreateProject"
          :caption="$t('home.newProj')"/>
        <TitleButton
          icon="fluent:person-square-20-regular"
          :styles="buttonStyle"
          :description="$t('home.userProfileDesc')"
          :caption="$t('home.userProfile')"/>
      </div>
    </div>
    <div class="recent"></div>
  </div>
</template>

<script lang="ts" setup>
import type { ButtonStyle } from "~/types/Button";
import { defaultClose, quickAlert } from "~/types/Dialog";

definePageMeta({
  layout: "default"
})

const t = useI18n();
const appState = useAppStateStore();

// name
const getName = (state: AppState) => {
  if (state.session.profile === undefined){
    return "";
  }
  
  const {firstName, lastName} = state.session.profile;

  return [firstName, lastName].join(" ").trim();
}

// button style
const buttonStyle: ButtonStyle = {
  colorPreset: "strong",
  backgroundColor: "var(--layer-background)"
};

// hide title
useAppStateStore().hideTitle();

// static links
const navTo = (path: string) => async () => await navigateTo(path);
const navToSettings = navTo("/settings");
const navToProjects = navTo("/projects");

// create personal project
const dialogControl = useDialogs();
const openCreateProject = () => dialogControl.closeAllWithTypeThenOpen({
  width: "450px",
  height: "fit-content",
  title: `projects.newProject.title`,
  titleI18n: true,
  dialogType: "createProjectTemplate",
  close: {
    ...defaultClose,
    caption: `dialogCommon.cancel`, 
    style: {colorPreset: "strong"}
  },
  actionsRight: [
    {
      caption: `dialogCommon.confirm`,
      captionI18n: true,
      icon: "fluent:checkmark-20-regular",
      style: {colorPreset: "accent-strong"},
      action: (_, x) => quickAlert(x),
      expanding: false,
    }
  ],
  payload: {
    template: false,
    personal: true,
    classId: "",
  }
});

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";

.page-root, .menu{
  height: calc(100% - 70px);
}

.page-root {
  @include flex-col;
  @include flex-main(center);
  @include flex-cross(center);
}

.menu {
  @include flex-col;
  @include flex-main(center);
  @include flex-cross(flex-start);
  
  width: min-content;
}

.row {
  @include flex-row;

  min-width: 70vw;
  button { flex: 1 };
}

.row, .menu {
  gap: $space-medium;
}

.greeting {
  @include typemix-title;
  @include flex-cross(center);

  display: inline-flex;
  padding-bottom: $space-medium;
  gap: $space-extra-small;
  span { color: var(--accent-strong); }
}
</style>
