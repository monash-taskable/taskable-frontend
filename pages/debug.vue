<template>
  <div class="page-root">
    <div>
      <span>1</span>
      <EditableField inline v-model="x" value="hi" @change="chg"/>
      <span>2</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "empty",
})

const x = ref("hola");
const chg = () => console.log(x.value);

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";

.page-root{
  @include flex-col;
  @include flex-main(center);
  @include flex-cross(center);

  height: 80vh;
  width: 100vw;
}
</style>