<template>
  <div class="task-list">
    <div class="content">
      <Skeleton fill />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { randRange } from '~/scripts/Utils';

const getLength = () => `${randRange(100, 280)}px`;
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";

.task-list {
  @include flex-col;
  @include flex-cross(stretch);
  @include flex-main(flex-start);
  
  outline: 2px solid transparent;
  background: var(--layer-background);
  min-width: 400px;
}
.content {
  padding: 0 $space-large;
  margin: $space-medium 0;
  height: 300px;
}
</style>