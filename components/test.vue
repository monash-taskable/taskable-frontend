<template>
  <div>
    <button @click="changeTheme">awa</button>
  </div>
</template>

<script lang="ts" setup>

const appConfig = useAppConfigStore();
const changeTheme = () => { appConfig.setTheme("dark"); };

</script>

<style scoped lang="scss">
button {
  background: var(--background);
  color: var(--foreground);
  border: 0px;
}
</style>