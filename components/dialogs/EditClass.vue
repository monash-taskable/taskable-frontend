<template>
  <div class="body">
    <div class="group">
      <span>{{ $t('projects.editClass.nowEditing') }}</span>
      <span v-if="props.context.payload.projectClass.role !== 'OWNER'">{{ props.context.payload.projectClass.name }}</span>
      <EditableField v-else :loading="updating" :value="props.context.payload.projectClass.name" inline @change="updateClassName"/>
    </div>
    <div class="group">
      <h3>{{ $t('projects.editClass.members') }}</h3>
      <Table 
        action :search="searchBy" selectable 
        :columns="[
          {key: 'name', label: t('projects.editClass.memberName'), flex: 3, order: 0},
          {key: 'role', label: t('projects.editClass.memberRole'), flex: 1, order: 1},
        ]"
        :items="props.context.payload.projectClass.members"
        :serialize="(member: Member) => ({name: member.name, role: t(`role.${member.role.toLowerCase()}`)})"
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
import { sprintf } from 'sprintf-js';
import type { PropType } from 'vue';
import { anyOf, same } from '~/scripts/Utils';
import { defaultClose, quickError, type Dialog, type DialogAction } from '~/types/Dialog';
import { checkPrecedence, type Member, type ProjectClass } from '~/types/ProjectClass';
import { defaultSearch, type SelectedAction } from '~/types/Table';

const {t} = useI18n();

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
        quickError(t("projects.editClass.updateRoleNotAllowed"), t("dialogError.somethingWentWrong"));
        return;
      }

      dialogs.closeAllWithTypeThenOpen({
        dialogType: "updateMemberRole",
        title: t("projects.editClass.updateRole"),
        width: "350px",
        payload: { currRole, selfRole, members, classId},
        close: {
          caption: t(`dialogCommon.confirm`),
          icon: "fluent:checkmark-20-regular",
          style: {colorPreset: "accent-strong"},
          expanding: true,
        }
      })
    },
    button: {
      icon: "fluent:person-edit-20-regular",
      label: "",
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
    title: t("projects.editClass.searchAndAddUser"),
    width: "550px",
    payload: {},
    close: {
      ...defaultClose,
      caption: t("dialogCommon.cancel")
    },
    actionsRight: [{
      caption: t(`dialogCommon.confirm`),
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
        quickError(invalidEmails.map(x => `* ${x}`).join("\n"), t('dialogs.batchMemberAdd.invalidEmail'));
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
  dialogs.closeAllWithTypeThenOpen({
    dialogType: "optionsAlert",
    width: "400px",
    close: defaultClose,
    payload: {
      message: sprintf(t("projects.editClass.deleteConfirmMsg"), props.context.payload.projectClass.name),
      actions: [<DialogAction>{
        caption: t("dialogCommon.cancel"),
        icon: "fluent:arrow-turn-up-left-20-regular",
        expanding: false,
        style: {colorPreset: 'strong', backgroundColor: 'var(--layer-background)'},
        action: (c: Dialog<any>, _: any) => dialogs.closeDialog(c.id)
      },{
        caption: t("projects.editClass.deleteClass"),
        icon: "fluent:delete-20-regular",
        expanding: false,
        style: {colorPreset: 'dangerous-strong'},
        action: async (c: Dialog<any>, _: any) => {
          await classStore.deleteClass(classId);
          dialogs.closeAllDialogs();
        }
      }]
    },
    title: t("projects.editClass.deleteConfirm")
  })
}

// set archive
const archiveClass = async () => await classStore.updateClass(classId, undefined, true);
const unarchiveClass = async () => await classStore.updateClass(classId, undefined, false);

// updateClassName
const updating = ref(false);
const updateClassName = async (newName: string) => {
  updating.value = true;
  await classStore.updateClass(classId, newName);
  updating.value = false;
}

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
  h3, span {
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