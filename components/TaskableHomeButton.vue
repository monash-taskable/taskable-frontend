<template>
  <button :tabindex="tabindex" :class="getClass(enterFlag)"
      @mouseover="onHoverOn" @mouseleave="onHoverOff"
      @click="$emit('click')" @keyup="onEnter"
      @focusout="onFocusOut"
      >
    <TaskableLogo v-if="!hovered"/>
    <TaskableLogo v-if="hovered" color="var(--hovered)"/>
    {{ $t("taskable") }}
  </button>
</template>

<script lang="ts" setup>
const t = useI18n();
const props = defineProps({tabindex: {type: Number, required: false}});

const getClass = (enter: boolean): string => enter ? "enter" : "";

const hovered = ref(false);
const enterFlag = ref(false);
const onHoverOn = () => { hovered.value = true; };
const onHoverOff = () => { hovered.value = false; };
const emitClick = defineEmits(["click"]);
const onEnter = (event: KeyboardEvent) => {
  if (event.key === "Enter"){
    enterFlag.value = true;
    hovered.value = true;
    emitClick("click");
  }
};
const onFocusOut = () => {
  hovered.value = false;
  enterFlag.value = false;
}

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
    &:hover, &.enter{
      background: var(--accent-strong);
      color: var(--background);
    }
  }
}
</style>