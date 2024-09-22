<template>
  <div class="dialog-body">
    <div v-if="changingRole" class="indicator overlay"/>
    <div v-if="changingRole" class="indicator">
      <Loading small/>
    </div>
    <div class="description"> {{ $t('projects.editClass.selectARole') }} </div>
    <Dropdown
      :selected="currRole"
      :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)'}"
      @change="onRoleChange"
    >
      <option v-for="role in roles" :value="role">{{ $t(`role.${role.toLowerCase()}`) }}</option>
    </Dropdown>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Dialog } from '~/types/Dialog';
import type { Optional } from '~/types/Optional';
import { checkPrecedence, ownershipRoles, type Member, type OwnershipRole } from '~/types/ProjectClass';


const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    currRole: Optional<OwnershipRole>,
    selfRole: OwnershipRole,
    members: Member[],
    classId: number,
  }>>, required: true},
});

const { currRole, members, classId, selfRole } = props.context.payload;

const roles = ownershipRoles.filter(r => !checkPrecedence(r, selfRole));

const projectClasses = useProjectClassStore();

const changingRole = ref(false);
const onRoleChange = async (role: OwnershipRole) => {
  if (!(classId in projectClasses.projectClasses)) return;
  changingRole.value = true;
  await projectClasses.updateClassMembersRole(classId, members, role);
  changingRole.value = false;
}


</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";


.dialog-body {
  @include flex-col;
  @include flex-cross(stretch);

  padding: $space-extra;
  height: var(--height);
  gap: $space-large;
}

.description {
  @include typemix-label;
}

.indicator {
  @include flex-col;
  @include flex-main(center);
  @include flex-cross(center);

  position: absolute;
  width: calc(100% - $space-extra);
  height: calc(100% - $space-extra - 1rem);
  transform: translate(calc(0px - calc($space-extra / 2)));

  &.overlay {
    background: var(--background);
    opacity: 0.7;
  }
}
</style>