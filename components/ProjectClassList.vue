<template>
  <div>
    <div class="section">
      <div class="section-title">
        <h3>
          <Icon name="fluent:people-community-20-regular" />
          {{ props.personal ? $t("projects.personal") : props.projectClass.name }}
        </h3>
        <div class="controls">
          <IconButton :styles="{...buttonStyle, size: 'small'}" expanding :caption="$t('projects.newTemplate')" icon="fluent:collections-add-20-regular"/>
          <IconButton :styles="{...buttonStyle, size: 'small'}" expanding :caption="$t('projects.newProject')" icon="fluent:add-circle-20-regular"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { ButtonStyle } from '~/types/ButtonStyle';
import type { ProjectClass } from '~/types/ProjectClass';

const props = defineProps({
  projectClass: {type: Object as PropType<ProjectClass>, required: true},
  personal: {type: Boolean, default: false},
});

const buttonStyle: ButtonStyle = {colorPreset: "background"};
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


h3 {
  @include typemix-label;
  @include flex-row;
  @include flex-main(flex-start);

  gap: $space-medium;
  margin: 0;

  & span { font-size: $icon-size-medium; }
}
</style>