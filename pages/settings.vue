<template>
  <div class="centered">

    <!-- Appearence -->
    <div class="section">
      <h3>{{ $t("settings.appearance") }}</h3>
      <!-- Theme -->
      <div class="option row">
        <h4> {{ $t("settings.colorTheme") }} </h4>
        <div class="options">
          <ThemePreview/>
          <ThemePreview theme="dark"/>
        </div>
      </div>
      <!-- color -->
      <div class="option row row-center">
        <h4> {{ $t("settings.accentColor") }} </h4>
        <div class="options">
          <ColorPreview color="orange"/>
          <ColorPreview color="green"/>
          <ColorPreview color="blue"/>
          <ColorPreview color="purple"/>
          <ColorPreview color="magenta"/>
        </div>
      </div>
    </div>

    <!-- General -->
    <div class="section">
      <h3>{{ $t("settings.general") }}</h3>
      <!-- Theme -->
      <div class="option row row-center">
        <h4> {{ $t("settings.locale") }} </h4>
        <div>
          <Dropdown @change="updateLocale" :selected="locale">
            <option v-for="[langCode, langName] in Object.entries(languageNames)" :value="langCode">{{ langName }}</option>
          </Dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FetchRequest } from '~/scripts/FetchTools';
import { UpdateProfileRequest } from '~/types/proto/Profile';

const { locale, setLocale, t } = useI18n();
useAppStateStore().setTitle(t("settings.title"), true, "fluent:settings-20-regular");

const updateLocale = (language: string) => {
  setLocale(language);
  
  const state = useAppStateStore();
  if (state.session.profile)
  FetchRequest
  .protectedAPI(`/users/update`)
  .post()
  .payload(UpdateProfileRequest.encode, {language})
  .commit();
}

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Sizes.scss";

.test {
  color: var(--accent-strong);
  background: var(--layer-background);
}

.centered {
  @include flex-col;
  @include flex-cross(center);
  @include flex-main(center);

  height: calc(100% - 100px);
  padding: 0 4rem;
  gap: $space-large;
}

.section{
  @include flex-col;
  @include flex-cross(flex-start);

  gap: $space-medium;
  width: 100%;
  max-width: 45rem;
  min-width: fit-content;


  h3, h4 {
    @include typemix-label;
    margin: 0;
  }

  h3 { padding-left: $space-medium; }
  h4 { width: max-content; }

  .option {
    @include flex-row;
    @include flex-main(space-between);

    background: var(--layer-background);
    padding: $space-medium;
    width: calc(100% - ($space-medium * 2));

    &.row-center { @include flex-cross(center); };
  }

  .row .options {
    @include flex-row;
    gap: $space-small;
  }
}
</style>