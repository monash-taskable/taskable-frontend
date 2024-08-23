<template>
  <div class="dialog-body">
    <div class="content">
      {{ $t('signin.error') }}
    </div>
    <div class="action">
      <IconButton @click="tryAgain" icon="fluent:arrow-counterclockwise-20-regular" :styles="retryStyle" :caption="$t('signin.retry')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { FetchResult } from '~/scripts/FetchTools';
import type { ButtonStyle } from '~/types/ButtonStyle';
import type { Dialog } from '~/types/Dialog';

const retryStyle: ButtonStyle = {colorPreset: 'accent-strong'};

const props = defineProps({
  context: {type: Object as PropType<Dialog<FetchResult<any> | string>>, required: true},
});

const tryAgain = () => {
  useDialogs().closeAllDialogs();
  navigateTo("/login");
}

const t = useI18n();

</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Flex.scss";

.dialog-body {
  @include flex-col;
  @include flex-cross(stretch);
}

.content {
  @include typemix-label;
  padding: $space-large;
}

.action {
  @include flex-row;
  @include flex-main(flex-end);
}
</style>