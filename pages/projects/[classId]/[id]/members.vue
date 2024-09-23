<template>
  <div class="proj-page-root">
    <div class="content">
      <div class="alert" v-if="status && status !== 'Mutable'">
        <AlertCard :title="$t('projectView.members.asGuest')" :content="$t('projectView.members.asGuestMessage')"/>
      </div>
      <!-- @vue-ignore -->
      <Table 
        action selectable
        :loading="loading"
        :title="$t('projectView.members')"
        :description="$t('projectView.members.desc')"
        :items="members"
        :serialize="(m: Member) => ({name: m.name, email: m.email, role: t(`role.${m.role.toLowerCase()}`)})"
        :identify="(m: Member, _) => m.id"
        :search="defaultSearch(searchBy)"
        :selected-actions="status === 'Mutable' ? selectedActions : []"
        :columns="[
          {key: 'name', label: t('projectView.members.name'),  order: 0, flex: 3},
          {key: 'email', label: t('projectView.members.email'),  order: 1, flex: 3},
          {key: 'role', label: t('projectView.members.role'),  order: 2, flex: 1},
        ]"
      >
        <template #actions>
          <IconButton v-if="status === 'Mutable'"
            :caption="$t('projectView.members.addMember')"
            icon="fluent:add-20-regular"
            @click="addMember"
            :styles="{colorPreset: 'accent-strong'}"/>
        </template>
      </Table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { addProjectMember, getProjectManagers, getProjectMembers, getProjectProfile, getProjectStatus, removeProjectMember } from '~/scripts/ProjectClassesFetches';
import { anyOf, listRemove, same } from '~/scripts/Utils';
import { defaultClose, quickError } from '~/types/Dialog';
import type { Optional } from '~/types/Optional';
import { checkPrecedence, type Member, type ProjectMembers, type ProjectStatus } from '~/types/ProjectClass';
import { defaultSearch, type SelectedAction } from '~/types/Table';

const {t} = useI18n();
const state = useAppStateStore();

// search button
const searchBy = (s: string) => (m: Member) => `${m.id}\n${m.email}\n${m.name}\n${m.role}\n${t(`role.${m.role.toLowerCase()}`)}`.includes(s);

// add member
const dialogs = useDialogs();
const addMember = async () => {
  dialogs.closeAllWithTypeThenOpen({
    dialogType: "batchMemberAdd",
    title: t("projectView.members.addMembers"),
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
        if (emails.length === 0) return;

        const invalids = await addProjectMember(state.projectId ?? -1, emails);
        dialogs.closeDialog(c.id);
        members.value = await getProjectManagers(state.projectId ?? -1);
        
        if (invalids.length === 0) return;
        quickError(invalids.map(x => `* ${x}`).join("\n"), t('dialogs.batchMemberAdd.invalidEmail'));
      },
    }]
  })
}

// data
const loading = ref(true);
const members: Ref<ProjectMembers> = ref([]);
const status: Ref<Optional<ProjectStatus>> = ref(undefined);
const managers: Ref<ProjectMembers> = ref([]);
const selfProfile: Ref<Optional<Member>> = ref(undefined);

// update state and prep data
onMounted(async ()=>{
  state.setProjectPage("members");

  members.value = await getProjectMembers(state.projectId ?? -1, state.classId ?? -1);
  status.value = await getProjectStatus(state.classId ?? -1);
  managers.value = await getProjectManagers(state.classId ?? -1);
  selfProfile.value = await getProjectProfile(state.classId ?? -1);

  loading.value = false;
});

// selected actions
const selectedActions: SelectedAction[] = [
  {
    button: {
      icon: "fluent:person-edit-20-regular",
      label: "",
      expanding: true,
      expanded: false,
      style: {colorPreset: "strong"}
    },
    action: (members: Member[]) => {
      const roles = members.map(m => m.role)

      if (!selfProfile.value) return;
      
      const selfRole = selfProfile.value.role;
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
        payload: { currRole, selfRole, members, classId: state.classId},
        close: {
          caption: t(`dialogCommon.confirm`),
          icon: "fluent:checkmark-20-regular",
          style: {colorPreset: "accent-strong"},
          expanding: true,
        }
      })
    },
  },
  {
    button: {
      icon: "fluent:delete-20-regular",
      label: "",
      expanding: true,
      expanded: false,
      style: {colorPreset: "strong"}
    },
    action: async (m: Member[]) => {
      await removeProjectMember(state.projectId ?? -1, m);
      members.value = await getProjectManagers(state.projectId ?? -1);
    },
  }
]

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

.proj-page-root {
  @include flex-row;
  @include flex-cross(flex-start);
  @include flex-main(flex-start);

  gap: $space-large;
}

.content {
  flex: 1;
  max-width: 1024px;
}

.alert {
  margin-bottom: $space-medium;
  max-width: 500px;
}
</style>