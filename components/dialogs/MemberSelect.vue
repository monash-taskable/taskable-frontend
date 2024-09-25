<template>
  <div class="member-select-root">
    {{ $t('projectView.subtasks.selectAMember') }}

    <div class="members">
      <Button
        v-for="member in members"
        :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)'}"
        :caption="member.name"
        @click="() => action(member, props.context.id)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Dialog } from '~/types/Dialog';
import type { Member } from '~/types/ProjectClass';

const emits = defineEmits(["emit"]);
const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    members: Member[],
    action: (m: Member, ctxId: string) => void
  }>>, required: true}
})


const {members, action} = props.context.payload;
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Flex.scss";

.member-select-root {
  @include flex-col;
  @include flex-cross(flex-start);
  @include flex-main(stretch);
  
  gap: $space-medium;
  padding: $space-large;
}

.members {
  width: 100%;
  
  &:deep(button) {
    width: 100%;
  }
}
</style>