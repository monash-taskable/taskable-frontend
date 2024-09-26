<template>
  <div class="announcement-page-root">
    {{ $t('projectView.announcements.notSelected') }}
  </div>
</template>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Typography.scss";

.announcement-page-root {
  @include flex-col;
  @include flex-cross(center);
  @include flex-main(center);
  @include typemix-title;

  width: 100%;
  height: 100%;
  flex: 1;
}
</style>