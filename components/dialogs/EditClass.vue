<template>
  <div class="body">
    <div class="group">
      <h3>{{ $t('projects.editClass.className') }}</h3>
      <div class="text-input">
        <TextInput
        v-model="nameVal"
        :value="props.context.payload.projectClass.name"
        :styles="{colorPreset: 'layer', width: '100%'}"
        @change="emitValue" :error-messages="$t('projects.editClass.cannotBeEmpty')"/>
      </div>
    </div>
    <div class="group">
      <h3>{{ $t('projects.editClass.members') }}</h3>
      <Table 
        action :search="searchBy" selectable 
        :columns="[
          {key: 'name', label: 'projects.editClass.memberName', labelI18n: true, flex: 3, order: 0},
          {key: 'role', label: 'projects.editClass.memberRole', labelI18n: true, flex: 1, order: 1},
        ]"
        :items="props.context.payload.projectClass.members"
        :serialize="(member: Member) => ({name: member.name, role: member.role})"
        :identify="(member: Member) => member.id"
        :selected-actions="selectedActions"
      >
        <template v-slot:actions>
          <IconButton
            icon="fluent:add-20-regular"
            :caption="$t('projects.editClass.addMember')"
            :styles="{colorPreset: 'accent-strong'}" />
        </template>
      </Table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Dialog } from '~/types/Dialog';
import type { Member, ProjectClass } from '~/types/ProjectClass';
import { defaultSearch, type SelectedAction } from '~/types/Table';

const t = useI18n();

const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    projectClass: ProjectClass,
  }>>, required: true},
});

const searchBy = defaultSearch((search: string) => (member: any): boolean => {
  const tMember = member as Member;
  const searchString = [String(tMember.id), tMember.name, tMember.role].join("\n");
  return searchString.includes(search);
})

const nameVal = ref("");

// emit
const emit = defineEmits(["emit"]);
const emitValue = (v: string) => {
  emit("emit", v);
};

// list selected actions
const selectedActions: SelectedAction[] = [
  {
    action: console.log,
    button: {
      icon: "fluent:delete-20-regular",
      label: "",
      labelI18n: false,
      expanding: true,
      expanded: false,
      style: {colorPreset: 'dangerous'},
    }
  }
];
</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";

.body {
  @include flex-col;
  @include flex-cross(stretch);

  padding: $space-extra;
  height: var(--height);
  gap: $space-large;
}

.group {
  h3 {
    @include typemix-label;
    margin: 0;
    margin-bottom: $space-small;
  }
}

.text-input {
  width: 60%;
}

</style>