<template>
  <button 
    @click="_onClick" @keyup="onKeyUp" @focusout="onFocusOut"
    class="table-header-cell" 
    :style="getStyle(props.column.flex ?? 1)" 
    :class="getClass(props.sorted !== 'Default', focusFlag)">
    <div class="label">
      {{ props.column.labelI18n ? $t(props.column.label) : props.column.label }}
    </div>
    <div class="icon">
      <Icon v-show="props.sorted === 'Ascending'" name="fluent:arrow-sort-down-lines-20-regular"/>
      <Icon v-show="props.sorted === 'Descending'" name="fluent:arrow-sort-up-lines-20-regular"/>
    </div>
  </button>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { cycleSort, type TableColumn, type TableSortChangeEvent, type TableSortDirection } from '~/types/Table';


const props = defineProps({
  column: {type: Object as PropType<TableColumn>, required: true},
  sorted: {type: String as PropType<TableSortDirection>, required: false, default: "Default"}
});

const getClass = (sorted: boolean, focused: boolean) => [
  sorted ? "sorted" : "",
  focused ? "focused" : "",
].join(" ");

const getStyle = (flex: number) => `flex: ${flex};`;

// interaction logic
const enterFlag = ref(false);
const focusFlag = ref(false);
const emitClick = defineEmits(["switchOrder"]);
const onKeyUp = () => { focusFlag.value = true; };
const onFocusOut = () => {
  enterFlag.value = false;
  focusFlag.value = false;
}
const _onClick = () => {
  emitClick("switchOrder", {
    direction: cycleSort(props.sorted),
    field: props.column.key
  } as TableSortChangeEvent);
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

  background: var(--background);
  padding: calc($space-medium - 2px);
  border: 1px solid var(--background);
  transition: $def-transition;

  &:hover {
    background: var(--background-interaction-strong);
  }
}

.icon {
  width: $icon-size-medium;
  height: $icon-size-medium;

  span {
    font-size: $icon-size-medium;
  }
}

.label {
  @include typemix-label;

}

.sorted {
  .icon {
    color: var(--accent-strong);
  }
  
  .label {
    color: var(--accent-strong);
    font-weight: $typeweight-medium;
  }

  border: 1px solid var(--accent-strong);
}
</style>