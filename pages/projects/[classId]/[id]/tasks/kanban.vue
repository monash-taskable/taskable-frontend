<template>
  <div class="proj-page-root">
    <div class="action-group">
      <Button
        :caption="$t('projectView.tasks.allTasksView')"
        :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)', size: 'small'}"
        @click="navToTasks"
      />
      <div class="selected">
        <Button
          :caption="$t('projectView.tasks.kanbanView')"
          :styles="{colorPreset: 'accent-strong', size: 'small'}"
          @click=""
        />
      </div>
      <Button
        :caption="$t('projectView.tasks.timelineView')"
        :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)', size: 'small'}"
        @click="navToTimeline"
      />
    </div>
    <div v-if="status === 'Immutable' && !loading" class="immutable">
      <AlertCard :title="$t('projectView.tasks.asGuest')" :content="$t('projectView.tasks.asGuestMessage')"/>
    </div>
    <div v-if="loading" class="tasks">
      <!-- <TaskListSkeleton v-for="_ in 4"/> -->
    </div>
    <div v-else class="tasks">
      <TaskKanbanColumn 
        v-for="status in taskStatuses"
        :tasks="Object.values(taskLookup)"
        :status="status"
        :subtasks="categorized[status]"
        @edit="editSubtaskEvent"
        @drop="(e) => _drop(e, status)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getProjectMembers, getProjectRole, setupProjectState } from '~/scripts/ProjectClassesFetches';
import { assignToSubtask, getSubtask, getSubtasksWithLookup, getTasks, unassignToSubtask, updateSubtask } from '~/scripts/TasksFetches';
import { findIndexInList, ident, listRemoveIdx } from '~/scripts/Utils';
import { defaultClose } from '~/types/Dialog';
import { taskStatuses, type DropSubtaskEvent, type ProjectStatus, type Subtask, type Task, type TaskStatus } from '~/types/ProjectClass';

const state = useAppStateStore();
const dialogs = useDialogs();
const route = useRoute();
const {t} = useI18n();

// data
const categorized: Ref<{[key: string]: Subtask[]}> = ref({"hold": [], "progress": [], "review": [], "done": []});
const taskLookup: Ref<{[key: string]: Task}> = ref({});
const status: Ref<ProjectStatus> = ref("Immutable");
const loading = ref(true);

// update state
onMounted(async ()=>{
  await setupProjectState(route.params.classId.toString(), route.params.id.toString());

  const {classId, projectId} = state;
  const tasks = await getTasks(classId!, projectId!);
  tasks.forEach(t => taskLookup.value[t.id] = t);
  const subtasks = await getSubtasksWithLookup(classId!, projectId!, taskLookup.value);
  for (const subtask of subtasks){
    categorized.value[subtask.status].push(subtask);
  }

  const role = await getProjectRole(classId!)!;
  if (role === 'TUTOR'){
    status.value = ((await getProjectMembers(projectId!, classId!))).map(x => x.id).includes(state.session.profile!.id) ? "Mutable" : "Immutable";
  }
  else{
    status.value = "Mutable";
  }

  loading.value = false;
  
  state.setProjectPage("tasks");
});

// edit subtask
const editSubtaskEvent = (x: {subtask: Subtask})=> {editSubtask(x.subtask, x.subtask.task)}
const editSubtask = (s: Subtask, task: Task) => dialogs.closeAllWithTypeThenOpen({
  dialogType: "editSubtask",
  payload: {
    subtask: {...s, assignment: [...s.assignment]},
    tasks: Object.values(taskLookup.value),
    deletable: true,
    deleteCallback: () => {
      const idx = findIndexInList(categorized.value[s.status], __s => __s.id === s.id);
      if (idx === undefined) return;
      listRemoveIdx(categorized.value[s.status], idx);
    }
  },
  title: "",
  width: "810px",
  close: defaultClose,
  actionsRight: [{
    caption: t("dialogCommon.confirm"),
    expanding: true,
    icon: 'fluent:checkmark-20-regular',
    style: {colorPreset: 'accent-strong'},
    action: async (c, _sUpdated: Subtask) => {
      const { classId, projectId } = state;
      await updateSubtask(classId!, projectId!, task.id, _sUpdated.id, {
        taskId: _sUpdated.task.id,
        end: _sUpdated.end,
        start: _sUpdated.start,
        description: _sUpdated.description,
        priority: _sUpdated.priority,
        status: _sUpdated.status,
        title: _sUpdated.title
      });

      const idx = findIndexInList(categorized.value[s.status], _s => _s.id === _sUpdated.id);

      if (idx === undefined) {
        dialogs.closeDialog(c.id);
        return;
      }

      if (s.assignment.length) {
        await unassignToSubtask(classId!, projectId!, _sUpdated.task.id, _sUpdated.id, s.assignment.map(x => x.id));
      }

      if (_sUpdated.assignment.length) {
        await assignToSubtask(classId!, projectId!, _sUpdated.task.id, _sUpdated.id, _sUpdated.assignment.map(x => x.id));
      }

      const newSubtask = await getSubtask(classId!, projectId!, _sUpdated.task, _sUpdated.id);

      if (newSubtask === undefined) {
        dialogs.closeDialog(c.id);
        return;
      }

      listRemoveIdx(categorized.value[s.status], idx);
      categorized.value[newSubtask.status].push(newSubtask);

      dialogs.closeDialog(c.id);
      return;
    },
  }]
})

// update status
const _drop = async ({sourceStatus, sourceTask, subtaskId}: DropSubtaskEvent, destStatus: TaskStatus) => {
  const {classId, projectId} = state;

  await updateSubtask(classId!, projectId!, sourceTask.id, subtaskId, {status: destStatus});

  const idx = findIndexInList(categorized.value[sourceStatus], s => s.id === subtaskId)!;
  const subtask = categorized.value[sourceStatus][idx];
  subtask.status = destStatus;
  listRemoveIdx(categorized.value[sourceStatus], idx);
  categorized.value[destStatus].push(subtask)
}

// tab nav
const navToTasks = () => navigateTo("../tasks");
const navToTimeline = () => navigateTo("timeline");
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

.immutable {
  margin-top: $space-large;
  max-width: 500px;
}

.action-group {
  @include flex-row;
  @include flex-main(flex-start);

  & button {
    border-bottom: 0;
    padding-bottom: $space-small !important;
  }
  
  &>.selected button {
    border-bottom: 2px solid var(--accent-strong);
    padding-bottom: calc($space-small - 2px) !important;
  }
}


.tasks {
  @include flex-row;
  @include flex-main(flex-start);
  @include flex-cross(flex-start);
  
  gap: $space-large;
  margin-top: $space-large;
  width: 100%;
  height: 100%;
  overflow-x: auto;
}

</style>