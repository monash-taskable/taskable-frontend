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
    <div v-if="props.context.payload.projectClass.role === 'OWNER'" class="group">
      <h3>{{ $t('projects.editClass.actions') }}</h3>
      <div class="actions">
        <IconButton
          @click="deleteClass"
          icon="fluent:delete-20-regular"
          :caption="$t('projects.editClass.deleteClass')" 
          :styles="{colorPreset: 'dangerous-strong'}"/>
        <IconButton v-if="props.context.payload.projectClass.archived" 
          icon="fluent:archive-arrow-back-20-regular" 
          :caption="$t('projects.editClass.unarchive')" 
          :styles="{colorPreset: 'strong', backgroundColor:'var(--layer-background)'}"
          @click="unarchiveClass"/>
        <IconButton v-else
          icon="fluent:archive-20-regular" 
          :caption="$t('projects.editClass.archiveClass')" 
          :styles="{colorPreset: 'strong', backgroundColor:'var(--layer-background)'}"
          @click="archiveClass"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { anyOf, same } from '~/scripts/Utils';
import { defaultClose, quickError, type Dialog } from '~/types/Dialog';
import { checkPrecedence, type Member, type ProjectClass } from '~/types/ProjectClass';
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

const dialogs = useDialogs();
const classStore = useProjectClassStore();


// list selected actions
const selectedActions: SelectedAction[] = [
  { // edit role
    action: (members: Member[]) => {
      const classId = props.context.payload.projectClass.classId;
      if (!useRuntimeConfig().public.debug && !(classId in classStore.projectClasses)) return;
      if (members.length < 1) return;

      const roles = members.map(m => m.role)

      const selfRole = props.context.payload.projectClass.role;
      const currRole = same(roles) ? members[0].role : "MULTI";

      const precedenceErr = anyOf(roles, r => checkPrecedence(r, selfRole));

      if (precedenceErr){
        quickError("projects.editClass.updateRoleNotAllowed", undefined, undefined, true, true);
        return;
      }

      dialogs.closeAllWithTypeThenOpen({
        dialogType: "updateMemberRole",
        title: "projects.editClass.updateRole",
        titleI18n: true,
        width: "350px",
        payload: { currRole, selfRole, members, classId},
        close: {
          caption: `dialogCommon.confirm`,
          captionI18n: true,
          icon: "fluent:checkmark-20-regular",
          style: {colorPreset: "accent-strong"},
          expanding: true,
        }
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
      const classId = props.context.payload.projectClass.classId;
      if (!(classId in classStore.projectClasses)){
        return;
      }
      classStore.deleteMembersFromClass(classId, members);
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


// add member button
const classId = props.context.payload.projectClass.classId;
const addMember = async () => {
  dialogs.closeAllWithTypeThenOpen({
    dialogType: "batchMemberAdd",
    title: "projects.editClass.searchAndAddUser",
    titleI18n: true,
    width: "550px",
    payload: {},
    close: {
      ...defaultClose,
      caption: "dialogCommon.cancel"
    },
    actionsRight: [{
      caption: `dialogCommon.confirm`,
      captionI18n: true,
      icon: "fluent:checkmark-20-regular",
      style: {colorPreset: "accent-strong"},
      expanding: true,
      action: async (c, s: string) => {
        const emails = s.split("\n").filter(Boolean).map(x => x.trim());
        
        if (emails.length === 0) {
          dialogs.closeDialog(c.id);
          return;
        }

        const invalidEmails = await classStore.addMembersToClass(classId, emails);

        dialogs.closeDialog(c.id);
        
        if (invalidEmails.length === 0) return;
        quickError(invalidEmails.map(x => `* ${x}`).join("\n"), 'dialogs.batchMemberAdd.invalidEmail');
      }
    }]
  })
  
}

// load members
onMounted(() => {
  classStore.loadMembers(props.context.payload.projectClass.classId);
})

// delete class
const deleteClass = async () => {
  await classStore.deleteClass(classId);
  dialogs.closeDialog(props.context.id);
}

// set archive
const archiveClass = async () => await classStore.updateClass(classId, "", true);
const unarchiveClass = async () => await classStore.updateClass(classId, "", false);

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

.actions {
  @include flex-row;
  @include flex-main(flex-start);

  gap: $space-small;
}

</style>