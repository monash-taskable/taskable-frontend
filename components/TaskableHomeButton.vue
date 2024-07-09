<template>
  <button
      @mouseover="onHoverOn" @mouseleave="onHoverOff"
      @click="$emit('click')" @keyup="onEnter">
    <TaskableLogo v-if="!hovered"/>
    <TaskableLogo v-if="hovered" color="var(--hovered)"/>
    {{ $t("taskable") }}
  </button>
</template>

<script lang="ts" setup>
const t = useI18n();

const hovered = ref(false);
const onHoverOn = () => { hovered.value = true; };
const onHoverOff = () => { hovered.value = false; };
const emitClick = defineEmits(["click"]);
const onEnter = (event: KeyboardEvent) => (event.key === "enter" && emitClick("click")); 
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/DefaultStyles.scss";
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

button {
  @include typemix-label();
  @include defmix-box();
  @include defmix-boxpad();
  @include defmix-focusable();
  @include flex-row();

  gap: $space-medium;
  transition: $def-transition;
  
  #theme-provider.theme--light & {
    color: var(--accent-strong);
    --hovered: var(--background);
    &:hover {
      background: var(--accent-strong);
      color: var(--background);
    }
  }
}
</style>