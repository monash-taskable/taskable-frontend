<template>
  <div class="dialog-root">
    <Multiline :value="value" focused @change="updateData" v-model="model" :placeholder="placeholder" :styles="{colorPreset: 'layer', height: '300px'}"/>
  </div>
</template>

<script lang="ts" setup>
import type { Dialog } from '~/types/Dialog';
import type { Optional } from '~/types/Optional';

const emits = defineEmits(["emit"]);
const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    placeholder: Optional<string>,
    value: Optional<string>,
  }>>, required: true}
})

const {value: _value} = props.context.payload;
const value = _value === undefined ? "" : _value;

const model = ref(value);
const updateData = () => {
  emits("emit", model.value);
}

onMounted(() => {
  updateData();
})

const {placeholder} = props.context.payload;
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";

.dialog-root {
  padding: $space-large;
}
</style>