<template>
  <div class="page-root">
    <IconButton @click="debug" :styles="{colorPreset: 'layer'}" caption="debug"/>
    <IconButton @click="logout" :styles="{colorPreset: 'layer'}" caption="logout"/>
  </div>
</template>

<script lang="ts" setup>

const dialog = useDialogs();

const debug = async () => {
  const x = await useAppStateStore().validateSession();
  console.log(x);
}

const logout = async () => {
  useAppStateStore().signOut();
}
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