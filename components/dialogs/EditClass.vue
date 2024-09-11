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
            @click="addMember"
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
import { FetchRequest } from '~/scripts/FetchTools';
import type { Dialog } from '~/types/Dialog';
import type { Member, ProjectClass } from '~/types/ProjectClass';
import { AddMemberRequest, UpdateMemberRoleRequest } from '~/types/proto/ProjectClass';
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
  { // edit role
    action: (members: Member[]) => {
      const projectClass = useProjectClassStore();
      const classId = props.context.payload.projectClass.classId;
      if (!(classId in projectClass.projectClasses)){
        return;
      }
      // const mids = members.filter(_m => _m.role !== "OWNER").map(m => m.id);
      const mids = members.map(m => m.id);
      mids.forEach(id => {
        FetchRequest.protectedAPI(`/classes/${classId}/members/${id}/update-role`).payload(
          UpdateMemberRoleRequest.encode,
          {
            role: prompt() ?? "STUDENT"
          }
        ).post().commit();
      })
    },
    button: {
      icon: "fluent:person-edit-20-regular",
      label: "",
      labelI18n: false,
      expanding: true,
      expanded: false,
      style: {colorPreset: "strong"}
    }
  },
  { // delete user
    action: (members: Member[]) => {
      const projectClass = useProjectClassStore();
      const classId = props.context.payload.projectClass.classId;
      if (!(classId in projectClass.projectClasses)){
        return;
      }
      const mids = members.filter(_m => _m.role !== "OWNER").map(m => m.id);
      mids.forEach(id => {
        console.log(`/classes/${classId}/members/${id}/delete`);
        FetchRequest.protectedAPI(`/classes/${classId}/members/${id}/delete`).delete().commit();
      })
      projectClass.projectClasses[classId].members = projectClass.projectClasses[classId].members.filter(
        (_m: Member) => !mids.includes(_m.id)
      )
    },
    button: {
      icon: "fluent:delete-20-regular",
      label: "",
      labelI18n: false,
      expanding: true,
      expanded: false,
      style: {colorPreset: "strong"}
    }
  },
];

const projectClass = useProjectClassStore();

// add member button
const classId = props.context.payload.projectClass.classId;
const addMember = async () => {
  const addMemReq = await FetchRequest.protectedAPI(`/classes/${classId}/members/add`).post().payload(AddMemberRequest.encode, {
    memberId: parseInt(prompt() ?? "0"),
  }).commit();
  if (!addMemReq.isError()){
    projectClass.loadMembers(classId);
  }
}

// update members
onMounted(() => {
  projectClass.loadMembers(props.context.payload.projectClass.classId);
})
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