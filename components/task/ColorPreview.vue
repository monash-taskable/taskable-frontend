<template>
  <button :style="getStyle()" @click="_onClick">
    <svg v-if="selected" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect class="fill" x="5" y="5" width="21" height="21" rx="4"/>
      <!-- <rect x="5" y="5" width="21" height="21" rx="4" stroke="#1671F4" stroke-width="2"/> -->
      <path class="check" d="M10.1992 15.6343C10.1287 15.555 10.0296 15.5069 9.92372 15.5006C9.8178 15.4943 9.71371 15.5303 9.63436 15.6007C9.55501 15.6712 9.50689 15.7703 9.50058 15.8762C9.49428 15.9821 9.53032 16.0862 9.60076 16.1655L12.8008 19.7655C12.8369 19.8064 12.8811 19.8394 12.9305 19.8626C12.98 19.8857 13.0336 19.8985 13.0882 19.9002C13.1427 19.9018 13.197 19.8923 13.2478 19.8722C13.2985 19.852 13.3446 19.8217 13.3832 19.7831L21.7832 11.3831C21.8583 11.3081 21.9005 11.2064 21.9006 11.1002C21.9007 10.9941 21.8586 10.8922 21.7836 10.8171C21.7086 10.742 21.6068 10.6998 21.5006 10.6997C21.3945 10.6996 21.2927 10.7417 21.2176 10.8167L13.116 18.9167L10.1984 15.6343H10.1992Z"/>
    </svg>
    <svg v-else width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle class="fill" cx="15.5" cy="15.5" r="10.5"/>
    </svg>
  </button>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { TaskColor } from '~/types/ProjectClass';

const emits = defineEmits(["click"]);
const props = defineProps({
  selected: {type: Boolean, default: false},
  color: {type: String as PropType<TaskColor>, required: true}
})

const getStyle = () => [
  `--tc-strong: var(--tc-${props.color}-strong)`,
  `--tc-weak: var(--tc-${props.color}-weak)`,
  `--tc-medium: var(--tc-${props.color}-medium)`,
].join("; ");

const _onClick = () => {
  emits("click", props.color);
}
</script>

<style lang="scss" scoped>
button {
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  height: 31px;

  &:hover {
    background: var(--layer-background);
  }
}

.fill {
  fill: var(--tc-medium);
}

.check {
  fill: var(--layer-background);
}
</style>