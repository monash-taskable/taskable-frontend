<template>
  <div>
    <header>
      <nav>
        <TaskableHomeButton/>
        <IconButton :styles="navBtnStyle" caption="Hello world!"/>
      </nav>
      <nav>
        <IconButton
          expanding
          :styles="navBtnStyle"
          icon="fluent:alert-20-regular"
          :caption="(notificationCount === 0) ?
            $t('header.btn.noNotifications') :
            sprintf($t('header.btn.notifications'), notificationCount)"/>
        <IconButton
          expanding
          :styles="navBtnStyle"
          icon="fluent:settings-20-regular"
          :caption="$t('header.btn.settings')"/>
        <IconButton
          :styles="navBtnStyle"
          icon="fluent:person-20-regular"
          caption="John Smith"/>
      </nav>
    </header>
    <slot/>
  </div>
</template>

<script lang="ts" setup>
import { sprintf } from 'sprintf-js';
import { buttonStyle } from '~/types/ButtonStyle';

const t = useI18n();
const notificationCount = ref(30);
const navBtnStyle = buttonStyle({colorPreset: 'layer'});
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";

header {
  @include flex-row;
  @include flex-main(space-between);
}

nav {
  @include flex-row;
}
</style>