<template>
  <button :tabindex="tabindex" :class="getClass(enterFlag, focusFlag)" @mouseover="onHoverOn" @mouseleave="onHoverOff"
    @click="onClick" @keyup="onKeyUp" @focusout="onFocusOut">
    <TaskableLogo v-if="!hovered" />
    <TaskableLogo v-if="hovered" color="var(--hovered)" />
    {{ $t("taskable") }}
  </button>
</template>

<script lang="ts" setup>
const t = useI18n();
const props = defineProps({ tabindex: { type: Number, required: false } });

const getClass = (enter: boolean, focus: boolean): string => {
  const enterCls = enter ? "enter" : "";
  const focusCls = focus ? "focused" : "";

  return [focusCls, enterCls].join(" ");
}

const hovered = ref(false);
const enterFlag = ref(false);
const focusFlag = ref(false);
const onHoverOn = () => { hovered.value = true; };
const onHoverOff = () => { hovered.value = enterFlag.value; };
const emitClick = defineEmits(["click"]);
const onKeyUp = (event: KeyboardEvent) => {
  focusFlag.value = true;
  if (event.key === "Enter") {
    onClick();
    hovered.value = true;
    enterFlag.value = true;
  }
};
const onFocusOut = () => {
  focusFlag.value = false;
  hovered.value = false;
  enterFlag.value = false;
}

const onClick = () => {
  emitClick("click");
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

    &:hover,
    &.enter {
      background: var(--accent-strong);
      color: var(--background);
    }
  }
}
</style>