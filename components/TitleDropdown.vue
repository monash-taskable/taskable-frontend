<template>
  <div class="overlay" v-if="show" @click="_clickAway" :style="getStyle(button, renderedWidth)">
    <div class="container" @click="_clickAway">
      <div class="tab-container">
        <slot name="tab"/>
      </div>
      <div class="content">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// @ts-ignore
const props = defineProps({
  show: {type: Boolean, default: false},
  clickAway: {type: Boolean, default: false},
  id: {type: String},
  button: {type: Object, required: true},
});

// showing and hiding
// @ts-ignore
const emitEvents = defineEmits(["show", "hide"]);
const _hide = () => {emitEvents("hide");};
const _clickAway = (event: MouseEvent) => {
  if (props.clickAway && event.target === event.currentTarget)
  _hide();
};

// rendering stuff
const renderedWidth = ref(0);
const getStyle = (parent: HTMLElement, width: number): string => {

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  
  const btn = parent.querySelector(`#${props.id}`) as HTMLElement;
  const x = btn.getBoundingClientRect().left;

  let modelX = x;
  let tabTranslateX = 0;

  if (modelX + width > vw) {
    modelX = vw - width - 32;
    tabTranslateX = x + width - vw + 32;
  }

  return `--x: ${modelX}px; --tab: ${tabTranslateX}px`;
};

// model showed listener
onUpdated(() => {
  const element = getCurrentInstance()?.proxy?.$el as HTMLElement;

  // skip update when model is hidden (when found node is comment (i.e. type 8))
  // see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  if (element.nodeType === 8) return;

  const model = element.querySelector(".container");
  const modelBound = model!.getBoundingClientRect();
  if (renderedWidth.value === modelBound.width) return;
  renderedWidth.value = modelBound.width;
})
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/DefaultStyles.scss";

.overlay {
  z-index: 1000;
  position: absolute;
  height: 100vh;
  width: 100vw;
  top: 0px;
  left: 0px;
  background: var(--popup-overlay);
}

.container {
  width: min-content;
  filter: $def-float;
  transform: translate(var(--x), 0);
}

.tab-container {
  width: min-content;
  transform: translate(var(--tab), 0);
}

.content {
  background: var(--background);
}
</style>