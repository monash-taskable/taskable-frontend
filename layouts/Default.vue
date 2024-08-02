<template>
  <div class="layout-root">
    <header>
      <nav>
        <TaskableHomeButton @click="navToHome" :tabindex="1001" />

        <IconButton :tabindex="1002" :styles="navBtnStyle" caption="Hello world!" />
      </nav>
      <nav>
        <!-- Notification Menu -->
        <IconButton :tabindex="1003" expanding maintain-click :styles="navBtnStyle" icon="fluent:alert-20-regular"
          :id="_notiMenuId" :expanded="_notiExpanded" @click="_showNotiMenu" :caption="(notificationCount === 0) ?
            $t('header.btn.noNotifications') :
            sprintf($t('header.btn.notifications'), notificationCount)" />
        <TitleDropdown :id="_notiMenuId" :button="_notiMenu" click-away :show="_notiMenuRef" @hide="_hideNotiMenu">
          <template #tab>
            <IconButton :tabindex="1003.1" maintain-click
              :styles="{ ...navBtnStyle, backgroundColor: 'var(--layer-background)' }" icon="fluent:alert-20-regular"
              :id="_notiMenuId" @click="_hideNotiMenu" :caption="(notificationCount === 0) ?
                $t('header.btn.noNotifications') :
                sprintf($t('header.btn.notifications'), notificationCount)" />
          </template>
          <div class="dropdown-content noti-menu">
            <div class="noti-label new">
              {{ sprintf($t('header.noti.newNotification'), notificationCount) }}
            </div>
            <NotificationPopupEntry new-entry title="Hello" source="world" :timestamp="new Date(Date.now().toString())"
              :tabindex="1003.2" />
            <div class="noti-label">
              {{ sprintf($t('header.noti.newNotification'), notificationCount) }}
            </div>
            <NotificationPopupEntry title="Lorem Ipsum" source="Test notification" icon="fluent:animal-cat-20-regular"
              :timestamp="new Date(Date.now().toString())" :tabindex="1003.3" />
          </div>
        </TitleDropdown>

        <!-- Settings Link -->
        <IconButton :tabindex="1004" expanding :styles="navBtnStyle" icon="fluent:settings-20-regular"
          :caption="$t('header.btn.settings')" @click="navToSettings" />

        <!-- User Menu -->
        <IconButton :tabindex="1005" :id="_userMenuId" @click="_showUserMenu" :styles="navBtnStyle"
          icon="fluent:person-20-regular" caption="John Smith" />
        <TitleDropdown :id="_userMenuId" :button="_userMenu" click-away :show="_userMenuRef" @hide="_hideUserMenu">
          <template #tab>
            <IconButton :tabindex="1005.1" @click="_hideUserMenu"
              :styles="{ ...navBtnStyle, backgroundColor: 'var(--layer-background)' }" icon="fluent:person-20-regular"
              caption="John Smith" />
          </template>
          <div class="dropdown-content user-menu">
            <IconButton :tabindex="1005.2" @click="navToProfile" :caption="$t('header.btn.profile')"
              icon="fluent:person-square-20-regular" />
            <IconButton :tabindex="1005.3" @click="navToAbout" :caption="$t('header.btn.about')"
              icon="fluent:info-20-regular" />
            <IconButton :tabindex="1005.4" :caption="$t('header.btn.signOut')" :styles="{ colorPreset: 'dangerous' }"
              icon="fluent:arrow-exit-20-filled" />
          </div>
        </TitleDropdown>
      </nav>
    </header>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { sprintf } from 'sprintf-js';
import { buttonStyle } from '~/types/ButtonStyle';
import type { Optional } from '~/types/Optional';

const t = useI18n();
const notificationCount = ref(30);
const navBtnStyle = buttonStyle({ colorPreset: 'layer' });

// menu methods
const _constructDropdown = (show: globalThis.Ref<boolean>, id: string) => {
  return {
    hideDropdown: () => { show.value = false; },
    showDropdown: () => { show.value = true; },
    ref: show,
    id,
    elem: getCurrentInstance()?.proxy?.$el
  };
};

const _constructExpandingDropdown = (
  show: globalThis.Ref<boolean>, expanded: globalThis.Ref<Optional<boolean>>,
  id: string) => {
  return {
    hideDropdown: () => { show.value = false; expanded.value = undefined },
    showDropdown: () => { show.value = true; expanded.value = true },
    expandedRef: expanded,
    ref: show,
    id,
    elem: getCurrentInstance()?.proxy?.$el
  }
}

// user menu
const {
  hideDropdown: _hideUserMenu,
  showDropdown: _showUserMenu,
  ref: _userMenuRef,
  elem: _userMenu,
  id: _userMenuId
} = _constructDropdown(ref(false), "navbtn-usermenu");

// notification menu
const {
  hideDropdown: _hideNotiMenu,
  showDropdown: _showNotiMenu,
  expandedRef: _notiExpanded,
  ref: _notiMenuRef,
  elem: _notiMenu,
  id: _notiMenuId
} = _constructExpandingDropdown(ref(false), ref(undefined), "navbtn-notimenu");

// static nav links
const navTo = (path: string) => async () => {
  await navigateTo(path);
}

const navToHome = navTo("/");
const navToAbout = navTo("/about");
const navToSettings = navTo("/settings");
const navToProfile = navTo("/profile");

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";

.layout-root {
  height: 100%;
}

header {
  @include flex-row;
  @include flex-main(space-between);
}

nav {
  @include flex-row;
}

div.dropdown-content {
  @include flex-col;
  @include flex-cross(stretch);

  &.user-menu {
    background: var(--layer-background);
  }

  &.noti-menu {
    width: 25rem;
  }
}

.noti-menu {
  .noti-label {
    @include typemix-label(var(--foreground-weak));

    padding: $space-medium-large;
    padding-bottom: $space-small;

    &.new {
      background: var(--accent-weak);
      color: var(--accent-strong);
    }

    &:nth-child(1) {
      padding-top: $space-medium;
    }
  }
}
</style>