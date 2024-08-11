<template>
  <div class="body">
    <div class="instruction">
      {{ $t("projects.newClass.instruction") }}
    </div>

    <TextInput
      :placeholder="$t('projects.newClass.name')"
      :styles="{colorPreset: 'layer', width: '100%'}"
      @change="emitValue" :error="error" :error-messages="$t('projects.newClass.cannotBeEmpty')"/>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Dialog } from '~/types/Dialog';

const t = useI18n();

const props = defineProps({
  context: {type: Object as PropType<Dialog<{name: string}>>, required: true},
});

// val check
const error = ref(false);
const checkInput = (val: string): boolean  => {
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

.body {
  padding: $space-extra;
  height: var(--height);
}

.instruction {
  @include typemix-label;

  margin-bottom: $space-large;
}
</style>