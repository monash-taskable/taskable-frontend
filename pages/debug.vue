<template>
  <div class="page-root">
    <Dropdown :styles="{colorPreset: 'accent-strong'}">
      <option value="0">hello</option>
      <option selected value="1">world</option>
    </Dropdown>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "empty",
})
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";

.page-root{
  @include flex-row;
  @include flex-main(center);
  @include flex-cross(center);
  
  height: 80vh;
  width: 100vw;
}
</style>