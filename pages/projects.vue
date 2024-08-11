<template>
  <div class="container">
    <div class="section">
      <div class="section-title">
        <h3>
          <Icon name="fluent:people-community-20-regular" />
          Class X
        </h3>
        <div class="controls">
          <IconButton :styles="{...buttonStyle, size: 'small'}" expanding :caption="$t('projects.newProject')" icon="fluent:add-circle-20-regular"/>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <h3>{{ $t("projects.personal") }}</h3>
        <div class="controls">
          <IconButton :styles="{...buttonStyle, size: 'small'}" expanding :caption="$t('projects.newProject')" icon="fluent:add-circle-20-regular"/>
          <IconButton :styles="{...buttonStyle, size: 'small'}" expanding :caption="$t('projects.newTemplate')" icon="fluent:collections-add-20-regular"/>
        </div>
      </div>
    </div>
    <div class="new-section">
      <IconButton @click="openCreateClassForm" icon="fluent:people-community-add-20-regular" :caption="$t('projects.newClass')" :styles="{...buttonStyleAccent, size: 'small'}" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ButtonStyle } from '~/types/ButtonStyle';
import { defaultClose, quickAlert, type Dialog } from '~/types/Dialog';

const t = useI18n();

const buttonStyle: ButtonStyle = {colorPreset: "background"};
const buttonStyleStrong: ButtonStyle = {colorPreset: "strong"};
const buttonStyleAccent: ButtonStyle = {colorPreset: "accent"};

useAppStateStore().setTitle("projects.title", true, true);

const dialogControl = useDialogControlStore();

// create class
const openCreateClassForm = () => dialogControl.closeAllWithTypeThenOpen({
  x: 100,
  y: 100,
  width: "350px",
  height: "fit-content",
  title: "projects.newClass.title",
  titleI18n: true,
  dialogType: "createClass",
  close: {
    ...defaultClose,
    caption: "projects.newClass.cancel", 
    style: {colorPreset: "strong"}
  },
  actions: [
    {
      caption: "projects.newClass.confirm",
      captionI18n: true,
      icon: "fluent:checkmark-20-regular",
      style: {colorPreset: "accent-strong"},
      action: (_: Dialog<{}>, emt?: any) => emt && quickAlert(`Name: ${emt}`),
      expanding: false,
    }
  ],
  payload: {}
});

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Sizes.scss";

h3 {
  @include typemix-label;
  @include flex-row;
  @include flex-main(flex-start);

  gap: $space-medium;
  margin: 0;

  & span { font-size: $icon-size-medium; }
}

.section {
  background: var(--layer-background);
  padding: $space-medium;
  padding-left: $space-large;
  flex: 3;
  min-width: 300px;

  & .section-title {
    @include flex-row;
    @include flex-cross(center);
    @include flex-main(space-around);

    & .controls { @include flex-row; };
    & h3 { flex: 1; }
  }
}

.new-section {
  @include flex-col;
  @include flex-cross(stretch);
  
  border: 2px dashed var(--layer-background);
  padding: $space-medium;
  padding-left: $space-large;
  flex: 1;
  min-width: max-content;

  & .section-title {
    @include flex-row;
    @include flex-cross(center);
    @include flex-main(space-around);

    & .controls { @include flex-row; };
    & h3 { flex: 1; }
  }
}

.container {
  @include flex-row;
  @include flex-cross(flex-start);
  @include flex-main(flex-start);
  
  width: calc(100% - ($space-medium * 2));
  height: calc(calc(100% - 2.75rem) - calc($space-medium * 2));
  padding: $space-medium;
  gap: $space-large;
  overflow-x: auto;


  @media only screen and (max-width: 700px) {
    @include flex-col;
    @include flex-cross(stretch);
  }
}
</style>