<template>
  <button 
    @click="_onClick" @keyup="onKeyUp" @focusout="onFocusOut"
    class="table-header-cell"
    :class="getClass(props.hoverable, focusFlag, props.toggle)">
    <div class="icon">
      <Icon name="fluent:checkbox-checked-20-filled" v-if="props.toggle === 'Checked'"/>
      <Icon name="fluent:checkbox-unchecked-20-regular" v-if="props.toggle === 'Empty'"/>
      <Icon name="fluent:checkbox-indeterminate-20-regular" v-if="props.toggle === 'Partial'"/>
    </div>
  </button>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import {cycleToggle, type TableToggleChangeEvent, type TableToggleType } from '~/types/Table';

const props = defineProps({
  toggle: {type: String as PropType<TableToggleType>, required: true},
  hoverable: {type: Boolean, default: false},
});

const getClass = (hoverable: boolean, focused: boolean, toggle: TableToggleType) => [
  hoverable ? "hoverable" : "",
  focused ? "focused" : "",
  toggle !== "Empty" ? "checked" : ""
].join(" ");

// interaction logic
const enterFlag = ref(false);
const focusFlag = ref(false);
const emitClick = defineEmits(["toggleChange"]);
const onKeyUp = () => { focusFlag.value = true; };
const onFocusOut = () => {
  enterFlag.value = false;
  focusFlag.value = false;
}
const _onClick = () => {
  emitClick("toggleChange", {
    toggle: cycleToggle(props.toggle),
  } as TableToggleChangeEvent);
}
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/DefaultStyles.scss";
@import "/assets/styles/constants/Flex.scss";

.table-header-cell {
  @include defmix-focusable;
  @include flex-row;
  @include flex-main(space-between);
  @include flex-cross(center);

  padding: calc($space-medium - 2px);
  border: 1px solid transparent;
  background: transparent;
  transition: $def-transition;
  
  &.hoverable {
    background: var(--background);
    border: 1px solid var(--background);

    &:hover {
      background: var(--background-interaction-strong);
    }
  }

}

.icon {
  color: var(--foreground);
  width: $icon-size-medium;
  height: $icon-size-medium;
  
  span {
    font-size: $icon-size-medium;
  }
}

.checked {
  .icon {
    color: var(--accent-strong);
  }
}
</style>