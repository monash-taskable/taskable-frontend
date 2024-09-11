<template>
  <div class="page-root">
    <IconButton @click="debug" :styles="{colorPreset: 'layer'}" caption="debug"/>
    <IconButton @click="logout" :styles="{colorPreset: 'layer'}" caption="logout"/>
  </div>
</template>

<script lang="ts" setup>
import { FetchRequest } from '~/scripts/FetchTools';

definePageMeta({layout:"empty"});

const dialog = useDialogs();

const debug = async () => {
  const x = await FetchRequest.api("/auth/test").overrideCsrf("b04f01ab-8748-48ba-abb4-d068df4ff").post().commit();
  console.log(x._response?.text());
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