<template>
  <div class="body">
    <div class="instruction">
      {{ props.context.payload.template ? $t("projects.newTemplate.instruction") : $t("projects.newProject.instruction") }}
    </div>

    <div class="input-group">
      <TextInput
        :placeholder="props.context.payload.template ? $t('projects.newTemplate.name') : $t('projects.newProject.name')"
        :styles="{colorPreset: 'layer', width: '100%'}"
        @change="emitValue" :error="error" :error-messages="props.context.payload.template ? $t('projects.newTemplate.cannotBeEmpty') : $t('projects.newProject.cannotBeEmpty')"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Dialog } from '~/types/Dialog';

const t = useI18n();

const props = defineProps({
  context: {type: Object as PropType<Dialog<{template: boolean}>>, required: true},
});

// val check
const error = ref(false);
const checkInput = (val: string): boolean => {
  error.value = val === "";
  return val !== "";
}

// emit class name
const emit = defineEmits(["emit"]);
const emitValue = (v: string) => {
  checkInput(v);
  emit("emit", v);
};
</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";

.body {
  padding: $space-extra;
  height: var(--height);
}

.instruction {
  @include typemix-label;

  margin-bottom: $space-large;
}

.input-group {
  @include flex-col;
}
</style>