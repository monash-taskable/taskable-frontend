<template>
  <div class="page-root">
    <IconButton @click="debug" :styles="{colorPreset: 'layer'}" caption="debug"/>
  </div>
</template>

<script lang="ts" setup>
import { getAndDecode, postAndDecode } from '~/scripts/FetchTools';
import { quickError, type DialogInit } from '~/types/Dialog';
import { ReqAuth, ResAuth } from '~/types/proto/Auth';
import { User } from '~/types/proto/User';

const dialog = useDialogs();

ReqAuth.encode

const debug = async () => {
  console.log("pressed");
  const shit = await postAndDecode("http://192.168.198.45:8080/api/auth/token", ReqAuth.encode, {authorizationCode: "hi"}, ResAuth.decode)
  console.log(shit);
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