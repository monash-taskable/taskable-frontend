<template>
  <div class="nav" tabindex="-1">
    <div class="nav-panel" tabindex="-1">
      <div class="nav-link-group">
        <button class="nav-link" :class="isSelected('overview')" @click="() => navTo('')">
          <Icon :name="getIcon('fluent:clover-20-', !!isSelected('overview'))"/>
          {{ $t('projectView.page.overview') }}
        </button>
        <button class="nav-link" :class="isSelected('members')" @click="() => navTo('members')">
          <Icon :name="getIcon('fluent:people-team-20-', !!isSelected('members'))"/>
          {{ $t('projectView.page.members') }}
        </button>
      </div>
      <hr/>
      <div class="nav-link-group">
        <button class="nav-link" :class="isSelected('tasks')" @click="() => navTo('tasks')">
          <Icon :name="getIcon('fluent:clipboard-task-list-20-', !!isSelected('tasks'))"/>
          {{ $t('projectView.page.tasks') }}
        </button>
        <button class="nav-link" :class="isSelected('announcements')" @click="() => navTo('announcements/list')">
          <Icon :name="getIcon('fluent:megaphone-20-', !!isSelected('announcements'))"/>
          {{ $t('projectView.page.announcements') }}
        </button>
        <button class="nav-link" :class="isSelected('meetings')" @click="() => navTo('meetings')">
          <Icon :name="getIcon('fluent:chat-video-20-', !!isSelected('meetings'))"/>
          {{ $t('projectView.page.meetings') }}
        </button>
        <button class="nav-link" :class="isSelected('sharedFiles')" @click="() => navTo('sharedFiles')">
          <Icon :name="getIcon('fluent:folder-20-', !!isSelected('sharedFiles'))"/>
          {{ $t('projectView.page.sharedFiles') }}
        </button>
      </div>
      <hr/>
      <div class="nav-link-group">
        <button class="nav-link" :class="isSelected('options')" @click="() => navTo('options')">
          <Icon :name="getIcon('fluent:settings-20-', !!isSelected('options'))"/>
          {{ $t('projectView.page.options') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import urlJoin from 'url-join';

const getIcon = (icon: string, selected: boolean) => icon + (selected ? "filled" : "regular");

const props = defineProps({
  projectId: {type: Number, required: true},
  selected: {type: String, default: ""},
});

const isSelected = (key: string) => props.selected === key ? "selected" : "";

const route = useRoute();
const state = useAppStateStore();
const classId = route.params.classId.toString();
const navTo = (dest: string) => navigateTo(urlJoin("/", "projects", classId, String(state.projectId), dest));
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/DefaultStyles.scss";

.nav {
  position: absolute;
  top: calc($icon-size-medium + calc($space-large + $space-medium));
  left: $space-large;
  width: auto;
  max-width: calc(calc($space-medium-large * 2) + $icon-size-medium);
  overflow-x: hidden;
  transition: $def-transition;
  z-index: 999;

  &:hover {
    max-width: 50vw;
    filter: $def-float;
  }
}

.nav-panel {
  @include flex-col;
  @include flex-cross(flex-start);
  
  gap: $space-extra-small;
  background: var(--layer-background);
  padding: $space-extra-small 0;
  width: max-content;
}

hr {
  border: none;
  border: 1px var(--background) solid;
  width: 100%;
  margin: 0;
}

.nav-link-group {
  @include flex-col;
  @include flex-cross(stretch);

  width: 100%;
}

.nav-link {
  @include flex-row;
  @include flex-main(flex-start);
  @include typemix-label;

  gap: $space-medium-large;
  padding: $space-medium-large;
  padding-right: $space-large;
  cursor: pointer;
  user-select: none;
  background: transparent;
  border: 0;
  border-radius: 0;

  &:hover {
    background: var(--background-interaction-strong);
  }

  & span {
    height: $icon-size-medium;
    width: $icon-size-medium;
  }

  &.selected {
    color: var(--accent-strong);
    background: var(--accent-weak);
    border-left: 2px solid var(--accent-strong);
    padding-left: calc($space-medium-large - 2px);
    
    &:hover {background: var(--accent-interact)}
  }
}

</style>