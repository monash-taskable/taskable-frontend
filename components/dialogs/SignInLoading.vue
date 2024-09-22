<template>
  <div class="dialog-body">
    {{ $t("signin.loading") }}
    <Loading small/>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Dialog } from '~/types/Dialog';

const props = defineProps({
  context: {type: Object as PropType<Dialog<undefined>>, required: true},
});

</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Flex.scss";

.dialog-body {
  @include typemix-label;
  @include flex-col;
  @include flex-cross(center);

  gap: $space-large;
  padding: 2rem $space-small;
  height: var(--height);
}
</style>