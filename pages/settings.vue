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
      <div class="option row">
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
  </div>
</template>

<script lang="ts" setup>
const t = useI18n();

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
  }

  .row .options {
    @include flex-row;
    gap: $space-small;
  }
}
</style>