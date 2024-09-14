<template>
  <div class="page-root">
    <Dropdown selected="world2" @change="_change" v-model="val" :styles="{colorPreset: 'accent-strong'}">
      <option value="hello1">hello</option>
      <option value="world2">world</option>
    </Dropdown>

    <button @click="debug">Debug</button>
  </div>
</template>

<script lang="ts" setup>
import { FetchRequest } from '~/scripts/FetchTools';

definePageMeta({
  layout: "empty",
})

const debug = async () =>{
  await useAppStateStore().initSessionAndCsrf();
  await FetchRequest.protectedAPI("/classes/12345").commit();
}

const val = ref("");
const _change = () => console.log(val.value);

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