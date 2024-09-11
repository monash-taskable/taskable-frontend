<template>
  <div class="alert-body">
    {{ props.context.payload }}
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Dialog } from '~/types/Dialog';


const props = defineProps({
  context: {type: Object as PropType<Dialog<string>>, required: true},
});

</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Sizes.scss";

.alert-body {
  @include typemix-label;
  padding: $space-small;
  height: var(--height);
}
</style>