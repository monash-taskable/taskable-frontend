<template>
  <div class="alert-card-body">
    <div class="title">
      <Icon :name="icon"/>
      {{ title }}
    </div>
    {{ content }}
    <slot/>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  icon: {type: String, default: "fluent:info-16-regular"},
  title: {type: String, required: true},
  content: {type: String, required: true},
});
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Typography.scss";

.alert-card-body {
  @include flex-col;
  @include flex-cross(flex-start);
  @include typemix-label;
  
  background: var(--layer-background);
  border-left: 2px solid var(--accent-strong);
  padding: $space-medium $space-extra $space-medium $space-large;
  gap: $space-extra-small;
}

.title {
  @include flex-row;
  @include flex-cross(center);
  @include flex-main(flex-start);
  @include typemix-label(var(--accent-strong));
  
  gap: $space-medium;

  & span {
    height: $icon-size-small;
    width: $icon-size-small;
  }
}
</style>