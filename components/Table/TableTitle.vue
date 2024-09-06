<template>
  <div class="table-title">
    <h4 v-show="props.title" class="title">
      {{ title }}
    </h4>
    {{ description }}
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {type: String, required: false},
  description: {type: String, required: false},
});
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Flex.scss";

.table-title {
  @include typemix-label(var(--foreground-weak));
  @include flex-col;
  @include flex-cross(flex-start);

  gap: $space-extra-small;
  padding: $space-large;
}

h4 {
  @include typemix-header;
  margin: 0;
}
</style>