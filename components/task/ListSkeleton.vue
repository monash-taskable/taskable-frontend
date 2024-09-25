<template>
  <div class="task-list">
    <div class="title">
      <Skeleton fill :width="getLength()"/>
    </div>
    <div class="content">
      <Skeleton :width="getLength()" v-for="_ in randRange(3, 10)"/>
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

.title {
  @include flex-col;
  @include flex-cross(stretch);
  @include flex-main(flex-start);

  padding: $space-medium-large $space-large;
  height: $typesize-large;
  margin-bottom: $space-medium;
}

.content {
  @include flex-col;
  @include flex-cross(stretch);
  
  padding: 0 $space-large;
  gap: $space-large;
  margin-bottom: $space-medium;
}
</style>