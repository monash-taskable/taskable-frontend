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
          maintain-click
          :styles="navBtnStyle"
          icon="fluent:alert-20-regular"
          :caption="(notificationCount === 0) ?
            $t('header.btn.noNotifications') :
            sprintf($t('header.btn.notifications'), notificationCount)"/>

        <IconButton
          expanding
          maintain-click
          :styles="navBtnStyle"
          icon="fluent:settings-20-regular"
          :caption="$t('header.btn.settings')"/>

        <IconButton
          :id="_userMenuId"
          @click="_showUserMenu"
          :styles="navBtnStyle"
          icon="fluent:person-20-regular"
          caption="John Smith"/>
        <TitleDropdown :id="_userMenuId" :button="_userMenu" click-away :show="_userMenuRef" @hide="_hideUserMenu">
          <template #tab>
            <IconButton
              @click="_hideUserMenu"
              :styles="{...navBtnStyle, backgroundColor: 'var(--layer-background)'}"
              icon="fluent:person-20-regular"
              caption="John Smith"
              />
          </template>
          <div class="user-menu">
            <IconButton :caption="$t('header.btn.profile')"/>
            <IconButton :caption="$t('header.btn.about')"/>
            <IconButton :caption="$t('header.btn.signOut')" :styles="{colorPreset: 'dangerous'}"/>
          </div>
        </TitleDropdown>
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

// menu methods
const _constructDropdown = (show: globalThis.Ref<boolean>, id: string) => { return {
  hideDropdown: () => { show.value = false; },
  showDropdown: () => { show.value = true; },
  ref: show,
  id,
  elem: getCurrentInstance()?.proxy?.$el
}; };

// user menu
const { 
  hideDropdown: _hideUserMenu,
  showDropdown: _showUserMenu,
  ref: _userMenuRef,
  elem: _userMenu,
  id: _userMenuId
} = _constructDropdown(ref(false), "navbtn-usermenu");


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

div.user-menu {
  @include flex-col;
  @include flex-cross(stretch);

  background: var(--layer-background);
  margin-right: 2rem;
}
</style>