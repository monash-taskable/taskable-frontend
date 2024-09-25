<template>
  <div class="form-root">
    <div class="group">
      <div class="icon">
        <Icon name="fluent:slide-text-20-regular"/>
      </div>
      <div class="content">
        <TextInput
          focused
          :styles="{colorPreset: 'layer',size: 'small'}"
          :placeholder="$t('projectView.tasks.title')"
          @change="emitChange"
          v-model="dataRef.title"
          :value="_subtask.title"
        />
        <div></div>
      </div>
    </div>
    <div class="group">
      <div class="icon"/>
      <div class="content">
        <Multiline
          :styles="{colorPreset: 'layer',size: 'small', height: '130px'}"
          :placeholder="$t('projectView.tasks.description')"
          @change="emitChange"
          v-model="dataRef.description"
          :value="_subtask.description"
        />
      </div>
    </div>
    <div class="group">
      <div class="icon">
        <Icon name="fluent:app-folder-20-regular"/>
      </div>
      <div class="content">
        <Dropdown 
          :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)', foregroundColor: `var(--tc-${dataRef.task.color}-strong)`}"
          :selected="String(dataRef.task.id)"
          @change="taskChange"
        >
          <option v-for="t in tasks" :value="t.id">{{ t.title }}</option>
        </Dropdown>
      </div>
    </div>
    <div class="group">
      <div class="icon">
        <Icon name="fluent:calendar-20-regular"/>
      </div>
      <div class="content date">
        <input v-model="start" type="date" @input="updateStart"/>
        <input v-model="end" type="date" @input="updateEnd"/>
      </div>
    </div>
    <div class="group">
      <div class="icon">
        <Icon name="fluent:clock-20-regular"/>
      </div>
      <div class="content">
        <Dropdown 
          :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)'}"
          :selected="String(dataRef.priority)"
          @change="priorityChange"
        >
          <option v-for="p in priorities" :value="p">{{ $t(`priority.${p}`) }}</option>
        </Dropdown>
      </div>
    </div>
    <div class="group">
      <div class="icon">
        <Icon name="fluent:tag-20-regular"/>
      </div>
      <div class="content">
        <Dropdown 
          :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)'}"
          :selected="String(dataRef.status)"
          @change=""
        >
          <option v-for="p in taskStatuses" :value="p">{{ $t(`status.${p}`) }}</option>
        </Dropdown>
      </div>
    </div>
    <div class="group" v-if="props.context.payload.deletable">
      <div class="icon"/>
      <div class="content date">
        <div style="flex: 1;"></div>
        <IconButton
            :styles="{colorPreset: 'dangerous-strong', size: 'small'}"
            :caption="$t('projectView.subtasks.deleteSubtask')"
            :expanding="false"
            icon="fluent:delete-20-regular"
            @click="deleteSubtask"
          />
      </div>
    </div>
    <div class="group">
      <div class="icon">
        <Icon name="fluent:person-20-regular"/>
      </div>
      <div class="content stretched">
        <div class="header">
          <span class="label">{{ $t('projectView.subtasks.assignment') }}</span>
          <IconButton
            :styles="{colorPreset: 'accent-strong', size: 'small'}"
            :caption="$t('projectView.subtasks.assign')"
            icon="fluent:person-add-20-regular"
            @click="() => memberAdd(availableMembers)"
          />
        </div>
        <div class="member" v-for="member in dataRef.assignment">
          <div class="label">{{ member.name }}</div>
          <IconButton
            :styles="{colorPreset: 'strong', size: 'small'}"
            :expanded="false"
            expanding
            icon="fluent:subtract-20-regular"x
            @click="() => memberRemove(member)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sprintf } from 'sprintf-js';
import { dateToInput, inputToDate } from '~/scripts/Datetime';
import { getProjectMembers } from '~/scripts/ProjectClassesFetches';
import { deleteSubtask as deleteSubtaskFetch } from '~/scripts/TasksFetches';
import { findIndexInList, findInList, ident, listRemoveIdx } from '~/scripts/Utils';
import { defaultClose, type Dialog } from '~/types/Dialog';
import { isPriority, priorities, taskStatuses, type Member, type Subtask, type Task } from '~/types/ProjectClass';

const state = useAppStateStore();
const dialogs = useDialogs();
const {t} = useI18n();

const emits = defineEmits(["emit"]);
const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    subtask: Subtask,
    tasks: Task[],
    deletable: boolean,
    deleteCallback: () => any;
  }>>, required: true},
});

const {subtask: _subtask, tasks} = props.context.payload;
const dataRef: Ref<Subtask> = ref(_subtask);

const taskChange = (id: String) => {
  dataRef.value.task = findInList(tasks, t => t.id === Number(id), ident)!;
  emits("emit", dataRef.value);
}

onMounted(async () => {
  emits("emit", dataRef.value);
  const {classId, projectId} = state;
  availableMembers.value = await getProjectMembers(projectId!, classId!)!;
})

const emitChange = () => {
  emits("emit", dataRef.value);
}

// date
const end = ref(dateToInput(dataRef.value.end));
const start = ref(dateToInput(dataRef.value.start));
const updateEnd = () => {
  dataRef.value.end = inputToDate(end.value);
  emits("emit", dataRef.value);
}
const updateStart = () => {
  dataRef.value.start = inputToDate(start.value);
  emits("emit", dataRef.value);
}

// priorities
const priorityChange = (priority: string) => {
  if (isPriority(priority)) dataRef.value.priority = priority;
  emits("emit", dataRef.value);
}

// member add
const availableMembers: Ref<Member[]> = ref([]);
const memberAdd = (members: Member[]) => {
  dialogs.closeAllWithTypeThenOpen({
    dialogType: "memberSelect",
    payload: {
      members: members.filter(m => !dataRef.value.assignment.map(_m => _m.id).includes(m.id)),
      action: (m: Member, ctxId: string) => {
        dataRef.value.assignment.push(m);
        emitChange()
        dialogs.closeDialog(ctxId);
      }
    },
    title: t('projectView.subtasks.assignMember'),
    width: "500px",
    close: defaultClose
  })
}

// member remove
const memberRemove = (member: Member) => {
  const idx = findIndexInList(dataRef.value.assignment, m => m.id === member.id);
  if (idx === undefined) return;
  listRemoveIdx(dataRef.value.assignment, idx);
  emitChange();
}

// delete task
const deleteSubtask = async () => {
  dialogs.closeAllWithTypeThenOpen({
    dialogType: "optionsAlert",
    width: "400px",
    close: defaultClose,
    payload: {
      message: sprintf(t("projects.editTemplate.deleteConfirmMsg"), _subtask.title),
      actions: [{
        caption: t("dialogCommon.cancel"),
        icon: "fluent:arrow-turn-up-left-20-regular",
        expanding: false,
        style: {colorPreset: 'strong', backgroundColor: 'var(--layer-background)'},
        action: (c: Dialog<any>, _: any) => dialogs.closeDialog(c.id)
      },{
        caption: t("projectView.subtasks.deleteSubtask"),
        icon: "fluent:delete-20-regular",
        expanding: false,
        style: {colorPreset: 'dangerous-strong'},
        action: async (c: Dialog<any>, _: any) => {
          const {classId, projectId} = state;
          
          await deleteSubtaskFetch(classId!, projectId!, _subtask.task.id, _subtask.id);
          props.context.payload.deleteCallback()
          dialogs.closeAllDialogs();
        }
      }]
    },
    title: t("projects.editTemplate.deleteTemplate")
  })
}

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/DefaultStyles.scss";

.form-root {
  @include flex-col;
  @include flex-cross(stretch);

  padding: $space-medium-large;
  gap: $space-medium;
}

.group {
  @include flex-row;
  @include flex-cross(flex-start);
  
  gap: $space-medium;
  
  &:has(.no-pad) {
    @include flex-cross(center);
  }

  .icon {
    padding-top: $space-small;
    color: var(--foreground);
    
    &.no-pad {
      padding-top: 0;
    }

    &, span {
      width: $icon-size-medium;
      height: $icon-size-medium;
    }
  }

  .content {
    @include flex-col;
    @include flex-cross(stretch);
    
    flex: 1;
    &:deep(.field) { width: 100% }
  }
  
  .date {
    @include flex-row;
    @include flex-cross(stretch);
    
    gap: $space-medium;

    input {
      @include typemix-label;

      border: 0;
      margin: 0;
      border-radius: 0;
      background: var(--layer-background);
      padding: $space-small;
      flex: 1;

      &:focus-visible {
        outline: $def-tabsel-outline;
      }
    }
  }

  .stretched{
    .member {
      background: var(--layer-background);
      padding-left: $space-medium;
    }
    &>div{
      @include flex-row;
      @include flex-cross(center);
      .label {
        @include typemix-label;
        flex: 1;
      };

    }
  }
}

.color-picker {
  @include flex-row;
  @include flex-cross(center);
  @include flex-main(flex-start);
}
</style>