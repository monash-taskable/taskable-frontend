<template>
  <div class="body">
    <div class="instruction">{{ $t('dialogs.batchMemberAdd.instruction') }}</div>
    <Multiline focused @change="() => emitValue(value)" v-model="value" :styles="{colorPreset: 'layer', height: '200px'}"/>
  </div>
</template>

<script lang="ts" setup>

const value = ref("");

const emit = defineEmits(["emit"]);
const emitValue = (v: string) => {
  emit("emit", v);
};
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";

.body {
  @include flex-col;
  @include flex-cross(stretch);

  padding: $space-extra;
  height: var(--height);
  gap: $space-medium;
}

.group {
  h3 {
    @include typemix-label;
    margin: 0;
    margin-bottom: $space-small;
  }
}

.instruction {
  @include typemix-label;
}
</style>