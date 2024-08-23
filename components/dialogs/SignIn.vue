<template>
  <div class="dialog-body">
    <div class="welcome">
      {{ $t('signin.welcome') }}
    </div>
    <div class="options">
      <div class="description">
        {{ $t('signin.description') }}
      </div>
      <IconButton @click="oAuthGoogle" :caption="$t('signin.google')" icon="ion:logo-google" :styles="signinStyle"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { ButtonStyle } from '~/types/ButtonStyle';
import type { Dialog } from '~/types/Dialog';

const t = useI18n();
const props = defineProps({
  context: {type: Object as PropType<Dialog<undefined>>, required: true},
});
  
const signinStyle: ButtonStyle = {colorPreset: "accent"}

const config = useRuntimeConfig();

// signin with google
const oAuthGoogle = () => {
  location.href = config.public.oAuthLinkGoogle;
}

</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Typography.scss";

.dialog-body {
  @include flex-col;
  @include flex-cross(center);

  gap: $space-large;
  padding: 2rem $space-small;
  height: var(--height);
}

.welcome {
  @include typemix-title-small(var(--accent-strong));
}

.options {
  @include flex-col;
  @include flex-cross(center);
  
  gap: $space-small;
  
  .description {
    @include typemix-label(var(--foreground-weak));
  }
}

</style>