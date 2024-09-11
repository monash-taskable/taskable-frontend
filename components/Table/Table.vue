<template>
  <div class="table-container">
    <TableTitle 
      v-if="props.title || props.description"
      :title="props.title" :description="props.description" />
    <div class="actions">
      <div v-show="checked.length" class="left">
        <div class="left-action-list">
          <IconButton
            v-for="action in props.selectedActions"
            :caption="action.button.labelI18n ? 
              $t(action.button.label) : action.button.label"
            :expanded="action.button.expanded"
            :expanding="action.button.expanding"
            :icon="action.button.icon"
            :styles="action.button.style"
            @click="() => action.action(props.items.filter((i, idx) => checked.includes(props.identify(i, idx))))"
            />
        </div>
        <div class="selection-indication">
          {{ sprintf($t('tableCommon.selected'), String(checked.length)) }}
        </div>
      </div>
      <div class="spring"/>
      <div v-show="props.action" class="right">
        <IconButton
          v-if="props.search && !searchFlag"
          @click="searchOn"
          :caption="props.search.button.labelI18n 
            ? $t(props.search.button.label) : props.search.button.label"
          :styles="props.search.button.style"
          :expanded="props.search.button.expanded"
          :expanding="props.search.button.expanding"
          :icon="props.search.button.icon"/>
        <div v-if="props.search && searchFlag" class="input-container">
          <TextInput
            focused
            :styles="{backgroundColor: 'var(--background)', backgroundColorInteract: 'var(--background)'}"
            :icon="props.search.button.inputIcon"
            @focusout="searchOff"
            v-model="searchVal"
              :placeholder="props.search.button.labelI18n
              ? $t(props.search.button.label) : props.search.button.label"/>
        </div>
        <slot name="actions"/>
      </div>
    </div>
    <div class="content">
      <div class="table-header">
        <TableToggle hoverable
          v-if="props.selectable"
          :toggle="getAllSelectState(checked)"
          @toggle-change="updateAllSelected"/>
        <TableHeader 
          v-for="column in sortColumns(props.columns)" 
          :column="column" 
          :sorted="currSortedField === column.key ? 
            currSortedDirection : 'Default'"
          @switch-order="switchSort"/>
      </div>
      <div class="table-row" v-for="row in sort(
          currSortedDirection,
          currSortedField ?? '', 
          mapToRows(filter(props.items, searchVal), props.serialize, props.identify))">
        <TableToggle
          @toggle-change="({toggle}) => updateSelected(row.id, toggle)"
          v-if="props.selectable" 
          :toggle="checked.includes(row.id) ? 'Checked' : 'Empty'"/>
        <div :style="getCellStyle(cell.flex)" class="table-cell" v-for="cell in row.cells">{{ cell.value }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sprintf } from 'sprintf-js';
import type { PropType } from 'vue';
import { findInList, listRemove } from '~/scripts/Utils';
import type { Optional } from '~/types/Optional';
import type { SearchProp, SelectedAction, TableCell, TableColumn, TableRow, TableSortChangeEvent, TableSortDirection, TableToggleChangeEvent, TableToggleType } from '~/types/Table';

const props = defineProps({
  action: {type: Boolean, required: false, default: false},
  search: {type: Object as PropType<SearchProp>, required: false},
  columns: {type: Object as PropType<TableColumn[]>, required: true},
  selectable: {type: Boolean, required: false, default: false},
  title: {type: String, required: false},
  description: {type: String, required: false},
  items: {type: Array as PropType<Object[]>, required: true},
  serialize: {type: Function as PropType<(item: any) => {[key: string]: string}>, required: true},
  identify: {type: Function as PropType<(item: any, index: number) => number>, required: true},
  selectedActions: {type: Array as PropType<SelectedAction[]>, required: false, default: []},
});

const mapToRows = <T>(items: T[], serialize: (t: T) => {[k: string]: string}, identify: (t: T, i: number) => number) => 
  items.map(getRow(serialize, identify));

// search logic
const searchFlag = ref(false);
const searchVal = ref("");
const searchOn = () => searchFlag.value = true;
const searchOff = () => { if (searchVal.value === "") searchFlag.value = false; };
const filter = <T>(rows: T[], search: string): T[] => {
  if (props.search === undefined ) return rows;
  if (search.trim() === "") return rows;
  return rows.filter(props.search.by(search));
}

// sort logic
const currSortedField: Ref<Optional<string>> = ref(undefined);
const currSortedDirection: Ref<TableSortDirection> = ref("Default");
const switchSort = ({field, direction}: TableSortChangeEvent) => {
  currSortedDirection.value = direction;
  currSortedField.value = direction === "Default" ? undefined : field;
}
const sort = <T>(mode: TableSortDirection, field: string, rows: TableRow<T>[]): TableRow<T>[] => {
  const val = (r: TableRow<T>) => findInList(r.cells, c => c.key === field, c => c.value) ?? "";

  if (mode === "Ascending") {
    return rows.sort((x, y) => val(x) < val(y) ? -1 : 1)
  }

  else if (mode === "Descending") {
    return rows.sort((x, y) => val(x) > val(y) ? -1 : 1)
  }

  return rows;
}


// toggle logic
const checked: Ref<number[]> = ref([]);
const updateSelected = (id: number, toggle: TableToggleType) => {
  const state = toggle === "Checked";
  
  if (state && !checked.value.includes(id)) {
    checked.value.push(id);
  }
  else if (!state && checked.value.includes(id)){
    listRemove(checked.value, id);
  }
}
const updateAllSelected = ({toggle}: TableToggleChangeEvent) => {
  if (toggle === "Checked") {
    checked.value = props.items.map(props.identify);
  }
  else {
    checked.value = [];
  }
}

// getters
const sortColumns = (labels: TableColumn[]) => {
  return labels.sort((x, y) => x.order < y.order ? -1 : 1);
}

const getCellStyle = (flex: number) => `flex: ${flex};`;

const getRow = <T>(serialize: (t: T) => {[key: string]: string}, identify: (t: T, i: number) => number) =>
  (item: T, index: number): TableRow<T> => {
    const serialized = Object.entries(serialize(item));

    const row: TableRow<T> = {
      id: identify(item, index),
      object: item,
      cells: serialized.map(([key, value]: [string, string]): TableCell => ({
        flex: findInList(props.columns, c => c.key === key, c => c.flex) ?? 1,
        key, value,
        valueI18n: false,
        order: findInList(props.columns, c => c.key === key, c => c.order) ?? 0,
      })).sort((x, y) => x.order < y.order ? -1 : 1)
    }

    return row;
}

const getAllSelectState = (selected: number[]): TableToggleType => {
  if (selected.length === props.items.length) return "Checked";
  if (selected.length === 0) return "Empty";
  return "Partial";
} 

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/DefaultStyles.scss";
@import "/assets/styles/constants/Typography.scss";

.table-container {
  background: var(--layer-background);
  padding: $space-small;
}

.actions {
  @include flex-row;

  .spring { flex: 1; };

  .right, .left {
    @include flex-row;
    @include flex-cross(center);
  }

  .input-container { 
    background: var(--background);
  }

  .theme--dark & {
    background: var(--background);
  }
}

.table-header, .table-row, .left-action-list {
  @include flex-row;
  @include flex-main(flex-start);
}

.table-row {
  @include typemix-label;

  transition: $def-transition;

  &:hover {background: var(--background-interaction-strong)}
}

.table-cell {
  padding: $space-medium;
}

.selection-indication {
  @include typemix-label(var(--foreground-weak));
  padding: $space-small;
}

</style>