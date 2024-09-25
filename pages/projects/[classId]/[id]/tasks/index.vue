<template>
  <div class="proj-page-root">
    <div class="actions">
      <div class="action-group">
        <div class="selected">
          <Button
            :caption="$t('projectView.tasks.allTasksView')"
            :styles="{colorPreset: 'accent-strong', size: 'small'}"
          />
        </div>
        <Button
          :caption="$t('projectView.tasks.kanbanView')"
          :styles="btnDefault"
          @click="navToKanban"
        />
        <Button
          :caption="$t('projectView.tasks.timelineView')"
          :styles="btnDefault"
          @click="navToTimeline"
        />
      </div>
      <div class="action-group">
        <!-- Filter -->
        <IconButton
          :styles="btnDefault"
          icon="fluent:filter-20-regular"
          :caption="$t('projectView.tasks.filter')"
        />
        <!-- Create task -->
        <IconButton
          :styles="btnDefault"
          icon="fluent:add-20-regular"
          :caption="$t('projectView.tasks.addTask')"
          @click="createTask"
        />
      </div>
      <div class="action-group">
        <!-- Edit mode enter -->
        <IconButton v-if="!editMode"
          :styles="btnDefault"
          icon="fluent:pen-20-regular"
          :caption="$t('projectView.tasks.edit')"
          @click="editEnter"
        />
        <!-- Edit mode exit -->
        <IconButton v-if="editMode"
          :styles="{colorPreset: 'accent-strong', size: 'small'}"
          icon="fluent:checkmark-20-regular"
          :caption="$t('projectView.tasks.editComplete')"
          @click="editExit"
        />
        <!-- delete -->
        <IconButton v-if="editMode"
          :styles="Object.keys(selectedTasks).length === 0 ? btnDisabled : btnDefault"
          icon="fluent:delete-20-regular"
          :caption="$t('projectView.tasks.deleteTask')"
          @click="() => deleteTasks(Object.values(selectedTasks).map(x => x.task))"
        />
        <!-- mark as done -->
        <IconButton v-if="editMode"
          :styles="Object.keys(selectedTasks).length === 0 ? btnDisabled : btnDefault"
          icon="fluent:checkmark-circle-20-regular"
          :caption="$t('projectView.tasks.markAllAsDone')"
        />
        <!-- edit -->
        <IconButton v-if="editMode"
          :styles="Object.keys(selectedTasks).length === 1 ? btnDefault : btnDisabled"
          icon="fluent:pen-20-regular"
          :caption="$t('projectView.tasks.modifyTaskDetails')"
          @click="() => editTask(Object.values(selectedTasks).map(x => x.task))"
        />
      </div>
    </div>
    <div v-if="loading" class="tasks">
      <TaskListSkeleton/>
      <TaskListSkeleton/>
    </div>
    <div v-else class="tasks">
      <TaskList 
        v-for="task in tasks"
        :task="task"
        :subtasks="multiSubtasks[task.id]"
        :selectable="editMode"
        :selected="task.id in selectedTasks"
        @click="(e) => onTaskSelect(task, multiSubtasks[task.id], e)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { setupProjectState } from '~/scripts/ProjectClassesFetches';
import { getSubtasks, getTasks, createTask as createTaskFetch, getTask, updateTask, deleteTask } from '~/scripts/TasksFetches';
import { findIndexInList } from '~/scripts/Utils';
import type { ButtonStyle } from '~/types/Button';
import { defaultClose, type Dialog, type DialogAction } from '~/types/Dialog';
import type { Subtask, Task } from '~/types/ProjectClass';

const state = useAppStateStore();
const dialogs = useDialogs();
const route = useRoute();
const {t} = useI18n();

// button styles
const btnDefault: ButtonStyle = {colorPreset: 'strong', backgroundColor: 'var(--layer-background)', size: 'small'};
const btnDisabled: ButtonStyle = {colorPreset: 'disabled', backgroundColor: 'var(--layer-background)', backgroundColorHover: 'var(--layer-background)', size: 'small'}

// data
// const now = new Date();
// const tasks: Ref<Task[]> = ref([
//   {id: 0, title: '1', description: '2', color: 'green'}
// ]);
// const multiSubtasks: Ref<{[key: number]: Subtask[]}> = ref({});
// multiSubtasks.value[0] = [
//   {assignment: [], description: "subtask desc 1", end: new Date(now.getTime() + 500), start: new Date(now.getTime() - 50), id: 1, priority: 'non-urgent', status: 'unassigned', task: tasks.value[0], title: "subtask 1!"},
//   {assignment: [], description: "subtask desc 2", end: new Date(now.getTime() + 500), start: new Date(now.getTime() - 50), id: 2, priority: 'non-urgent', status: 'unassigned', task: tasks.value[0], title: "subtask 2!"},
//   {assignment: [], description: "subtask desc urgent", end: new Date(now.getTime()), start: new Date(now.getTime() - 50), id: 3, priority: 'urgent', status: 'assigned', task: tasks.value[0], title: "subtask! urgent"}
// ];
const tasks: Ref<Task[]> = ref([]);
const multiSubtasks: Ref<{[key: number]: Subtask[]}> = ref({});
multiSubtasks.value[0] = [];

// loading
const loading = ref(true);

// modification flag
const editMode = ref(false);
const editEnter = () => editMode.value = true;
const editExit = () => {
  editMode.value = false;
  selectedTasks.value = {};
};
const selectedTasks: Ref<{[key: number]: {task: Task, subtasks: Subtask[]}}> = ref([]);
const onTaskSelect = (task: Task, subtasks: Subtask[], event: {toggle: boolean}) => {
  if (!event.toggle && task.id in selectedTasks.value)
    delete selectedTasks.value[task.id];
  else
    selectedTasks.value[task.id] = {task, subtasks};
}

// update state
onMounted(async ()=>{
  await setupProjectState(route.params.classId.toString(), route.params.id.toString());
  if (state.classId === undefined || state.projectId === undefined) return;

  
  const {classId, projectId: projId} = state;
  
  const _tasks = await getTasks(classId, projId);
  for (const task of _tasks){
    multiSubtasks.value[task.id] = await getSubtasks(classId, projId, task);
  }
  tasks.value = _tasks;
  
  loading.value = false;
  
  state.setProjectPage("tasks");
});

// create task
const createTask = () => !loading.value && dialogs.closeAllWithTypeThenOpen({
  dialogType: "editTask",
  payload: {
    color: 'blue',
    description: '',
    title: '',
    id: -1
  },
  title: t('projectView.tasks.addTask'),
  width: "400px",
  close: defaultClose,
  actionsRight: [{
    caption: t("projectView.tasks.addSubtask"),
    expanding: true,
    icon: 'fluent:add-20-regular',
    style: {colorPreset: 'accent-strong'},
    action: async (c, {description, title, color}) => {
      const {classId, projectId: projId} = state;
      const id = await createTaskFetch(classId!, projId!, title, description, color);

      if (!id) {
        dialogs.closeDialog(c.id);
        return;
      }
      
      const _task = await getTask(classId!, projId!, id);
      
      if (!_task) {
        dialogs.closeDialog(c.id);
        return;
      }
      
      multiSubtasks.value[id] = await getSubtasks(classId!, projId!, _task);
      tasks.value.push(_task);
      
      dialogs.closeDialog(c.id);
    }
  }]
})

// edit task
const editTask = (_tasks: Task[]) => {
  if (_tasks.length !== 1) return;

  dialogs.closeAllWithTypeThenOpen({
    dialogType: "editTask",
    payload: _tasks[0],
    title: t('projectView.tasks.addTask'),
    width: "400px",
    close: defaultClose,
    actionsRight: [{
      caption: t("projectView.tasks.modifyTaskDetails"),
      expanding: true,
      icon: 'fluent:checkmark-20-regular',
      style: {colorPreset: 'accent-strong'},
      action: async (c, data) => {
        const {classId, projectId: projId} = state;
        await updateTask(classId!, projId!, _tasks[0].id, data);
        editExit();
        const taskIdx = findIndexInList(tasks.value, t => t.id === _tasks[0].id);
        const newTask = await getTask(classId!, projId!, _tasks[0].id);
        if (taskIdx !== undefined && newTask !== undefined) {
          tasks.value[taskIdx] = newTask
        }
        dialogs.closeDialog(c.id);
      }
    }]
  })
}

// delete tasks
const deleteTasks = (_tasks: Task[]) => {
  if (_tasks.length === 0) return;

  dialogs.closeAllWithTypeThenOpen({
    dialogType: "optionsAlert",
    width: "400px",
    close: defaultClose,
    payload: {
      message:t("projectView.tasks.taskDeleteMessage"),
      actions: [<DialogAction>{
        caption: t("dialogCommon.cancel"),
        icon: "fluent:arrow-turn-up-left-20-regular",
        expanding: false,
        style: {colorPreset: 'strong', backgroundColor: 'var(--layer-background)'},
        action: (c: Dialog<any>, _: any) => dialogs.closeDialog(c.id)
      },{
        caption: t("projectView.tasks.deleteTask"),
        icon: "fluent:delete-20-regular",
        expanding: false,
        style: {colorPreset: 'dangerous-strong'},
        action: async (c: Dialog<any>, _: any) => {
          const {classId, projectId: projId} = state;
          for (const t of _tasks){
            await deleteTask(classId!, projId!, t.id); 
          }
          tasks.value = await getTasks(classId!, projId!);
          _tasks.forEach(t => delete multiSubtasks.value[t.id]);
          editExit();
          dialogs.closeDialog(c.id);
        }
      }]
    },
    title: t("projects.editTemplate.deleteTemplate")
  })
}

// tab nav
const navToKanban = () => navigateTo("tasks/kanban");
const navToTimeline = () => navigateTo("tasks/timeline");
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

.actions {
  @include flex-row;
  @include flex-main(flex-start);

  gap: $space-medium;
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
}
</style>