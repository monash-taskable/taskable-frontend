<template>
  <div></div>
</template>

<script lang="ts" setup>
import { getAndDecode, postAndDecode } from '~/scripts/FetchTools';
import { ReqAuth, ResAuth } from '~/types/proto/Auth';
import { User } from '~/types/proto/User';


const route = useRoute();
const code = route.query.code as string;


onMounted(async () => {
  const session = await postAndDecode("http://192.168.198.45:8080/api/auth/token", ReqAuth.encode, {authorizationCode: code}, ResAuth.decode);
  console.log(await getAndDecode("http://192.168.198.45:8080/api/get-user", User.decode));
}) 

</script>

<style>

</style>