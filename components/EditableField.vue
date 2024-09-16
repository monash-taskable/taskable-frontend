<template>
  <!-- Field -->
  <span @focusout="editDone"
    tabindex="-1" class="fieldEdit"
    :class="getFieldEditClass(editing)">
    <input
      :class="getFieldClass(size, inline)"
      :tabindex="editing ? 0 : -1"
      :style="getFieldStyle(editing)"
      ref="field"
      v-model="fieldValue"
      @keyup="fieldKeyUp"
      @input="updateModel"
      />
  </span>
  <!-- Tag -->
  <span @keyup="tagKeyUp" @focusout="unfocus" @click="edit"
    v-show="!editing" tabindex="0" class="tag" :class="getTagClass(focused, loading, size, inline)">
    <span class="textbox">
      <span>{{ fieldValue }}</span>
      <span v-if="loading">
        <Loading v-if="size === 'label'" label/>
        <Loading v-if="size === 'title'" small/>
      </span>
      <Icon v-else name="fluent:pen-24-regular"/>
    </span>
  </span>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { max, min } from '~/scripts/Utils';

const props = defineProps({
  value: {type: String, default: ""},
  loading: {type: Boolean, required: false, default: false},
  inline: {type: Boolean, required: false, default: false},
  size: {type: String as PropType<"label" | "title">, default: "label"},
});

// interaction flag
const emits = defineEmits(["change"])
const fieldValue = ref("");
const backup = ref("");
const model = defineModel({type: String});
const editing = ref(false);
const focused = ref(false);
const field = ref(null);
const tagKeyUp = ({key}: KeyboardEvent) => {
  focused.value = true;
  if (key === "Enter") edit();
}
const fieldKeyUp = ({key}: KeyboardEvent) => {
  if (key === "Escape"){
    editAbort();
  }
  
  if (key === "Enter" && editing.value){
    editDone();
  }
}
const unfocus = () => {
  focused.value = false;
};
const edit = () => {
  if (props.loading) return;

  backup.value = fieldValue.value;

  editing.value = true;
  // @ts-ignore
  field.value.focus();
  // @ts-ignore
  field.value.select();
}
const editDone = () => {
  if (fieldValue.value.length === 0) editAbort();

  editing.value = false;
  focused.value = false;
  emits("change", fieldValue.value);
}
const editAbort = () => {
  editing.value = false;
  focused.value = false;
  fieldValue.value = backup.value;
}
const updateModel = () => {
  model.value = fieldValue.value;
}

// getters
const getTagClass = (focused: boolean, loading: boolean, size: string, inline: boolean) => [
  focused ? "focused" : "",
  loading ? "loading" : "",
  inline ? "inline" : "",
  size,
].join(" ");
const getFieldClass = (size: string, inline: boolean) => [
  focused ? "focused" : "",
  inline ? "inline" : "",
  size,
].join(" ");

const getFieldStyle = (editing: boolean) => editing ? `width: ${min([max([fieldValue.value.length, 1]), 20])}ch; height: auto;` : "";

const getFieldEditClass = (editing: boolean) => editing ? "editing" : "";

// default value
onMounted(() => {
  fieldValue.value = props.value;
})

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/DefaultStyles.scss";
@import "/assets/styles/constants/Flex.scss";

.tag {
  @include typemix-label(var(--accent-strong));
  @include defmix-focusable;
  
  display: inline-block;
  text-decoration: underline 1px var(--accent-intermediate) dashed;
  user-select: none;
  cursor: pointer;
  
  &:not(.loading):hover {
    background: var(--accent-weak);
  }

  &.loading {
    cursor: default;
  }
  
  .textbox {
    @include flex-row;
    @include flex-cross(center);

    gap: $space-extra-small;
  }
}

input {
  font-size: calc($typesize-default - 0.15rem);
  color: var(--accent-strong);
  font-family: 'IBM Plex Mono', monospace;
  background: transparent;
  border: 0;
  outline: none;
  width: 0px;
  height: 0px;
  margin: 0;
  border: 0;
  z-index: 2051;
  position: relative;
}

.fieldEdit {
  font-family: 'IBM Plex Mono', monospace;
  z-index: 2050;
  display: inline-block;
  position: relative;
  width: 0;
  height: 0;
  
  &.editing {
    width: auto;
    height: auto;
    margin-right: 2px;

    &::before {
      z-index: 2040;
      left: -2px;
      top: -2px;
      position: absolute;
      content: '';
      background: var(--accent-weak);
      width: 100%;
      height: 100%;
      padding: 2px 0;
      border: 1px dotted var(--accent-strong);

    }
    &:has(.inline)::before { 
      width: calc(100% - $space-extra-small);
      left: 2px;
    }
  }

}


.title {
  & input, & {
    @include typemix-title(var(--accent-strong));
  }
}

.inline {
  & input, & {
    margin: 0 $space-extra-small;
  }
}

</style>