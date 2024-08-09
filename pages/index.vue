<template>
  <div class="page-root">
    <div class="menu">
      <div class="greeting">
        {{ $t('home.welcomeBack') }} <span>{{ userName }}</span>
      </div>
      <div class="row">
        <TitleButton 
          :styles="buttonStyle"
          :description="$t('home.viewAllProjDesc')"
          :caption="$t('home.viewAllProj')"/>
        <TitleButton
          icon="fluent:settings-20-regular"
          :styles="buttonStyle"
          :description="$t('home.appSettingsDesc')"
          :caption="$t('home.appSettings')"/>
      </div>
      <div class="row">
        <TitleButton
          icon="fluent:add-square-20-regular"
          :styles="buttonStyle"
          :description="$t('home.newProjDesc')"
          :caption="$t('home.newProj')"/>
        <TitleButton
          icon="fluent:person-square-20-regular"
          :styles="buttonStyle"
          :description="$t('home.userProfileDesc')"
          :caption="$t('home.userProfile')"/>
      </div>
    </div>
    <div class="recent"></div>
  </div>
</template>

<script lang="ts" setup>
import type { ButtonStyle } from "~/types/ButtonStyle";

// placeholder values
const userName = "John Smith";

definePageMeta({
  layout: "default"
})

const t = useI18n();

// button style
const buttonStyle: ButtonStyle = {
  colorPreset: "strong",
  backgroundColor: "var(--layer-background)"
};

// hide title
useAppStateStore().hideTitle();
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";

.page-root, .menu{
  height: calc(100% - 70px);
}

.page-root {
  @include flex-col;
  @include flex-main(center);
  @include flex-cross(center);
}

.menu {
  @include flex-col;
  @include flex-main(center);
  @include flex-cross(flex-start);
  
  width: min-content;
}

.row {
  @include flex-row;

  min-width: 70vw;
  button { flex: 1 };
}

.row, .menu {
  gap: $space-medium;
}

.greeting {
  padding-bottom: $space-medium;
  @include typemix-title;

  span { color: var(--accent-strong); }
}
</style>
