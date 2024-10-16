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
        <IconButton v-if="status === 'Mutable'"
          :styles="btnDefault"
          icon="fluent:add-20-regular"
          :caption="$t('projectView.tasks.addTask')"
          @click="createTask"
        />
      </div>
      <div class="action-group">
        <!-- Edit mode enter -->
        <IconButton v-if="!editMode && status === 'Mutable'"
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
          :styles="Object.keys(selectedTasks).length === 0 ? btnDisabled : {colorPreset: 'dangerous', size:'small', backgroundColor: 'var(--layer-background)'}"
          icon="fluent:delete-20-regular"
          :caption="$t('projectView.tasks.deleteTask')"
          @click="() => deleteTasks(Object.values(selectedTasks).map(x => x.task))"
        />
        <!-- mark as done -->
        <IconButton v-if="editMode"
          :styles="Object.keys(selectedTasks).length === 0 ? btnDisabled : btnDefault"
          icon="fluent:checkmark-circle-20-regular"
          :caption="$t('projectView.tasks.markAllAsDone')"
          @click="markAll"
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
    <div v-if="status === 'Immutable' && !loading" class="immutable">
      <AlertCard :title="$t('projectView.tasks.asGuest')" :content="$t('projectView.tasks.asGuestMessage')"/>
    </div>
    <div v-if="loading" class="tasks">
      <TaskListSkeleton v-for="_ in tasksCountInit"/>
    </div>
    <div v-else class="tasks">
      <TaskList 
        v-for="task in tasks"
        :tasks="tasks"
        :task="task"
        :subtasks="multiSubtasks[task.id]"
        :selectable="editMode"
        :selected="task.id in selectedTasks"
        :readonly="status === 'Immutable'"
        @click="(e) => onTaskSelect(task, multiSubtasks[task.id], e)"
        @create="() => createSubtask(task)"
        @edit="({subtask: Subtask}) => editSubtask(Subtask, task)"
        @drop="(e) => _drop(task, e)"
      />
      <div v-if="tasks.length === 0 && status === 'Mutable'" class="no-tasks">{{ $t('projectView.tasks.noTasks') }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getNextWeek } from '~/scripts/Datetime';
import { getProjectMembers, getProjectRole, getProjectStatus, setupProjectState } from '~/scripts/ProjectClassesFetches';
import { getSubtasks, getTasks, createTask as createTaskFetch, getTask, updateTask, deleteTask, createSubtask as createSubtaskFetch, getSubtask, updateSubtask, assignToSubtask, unassignToSubtask, markAllSubtasksAs } from '~/scripts/TasksFetches';
import { findIndexInList, findInList, ident, insertAt, listRemoveIdx, randRange } from '~/scripts/Utils';
import type { ButtonStyle } from '~/types/Button';
import { defaultClose, type Dialog, type DialogAction } from '~/types/Dialog';
import type { DropSubtaskEvent, ProjectStatus, Subtask, Task } from '~/types/ProjectClass';

const state = useAppStateStore();
const dialogs = useDialogs();
const route = useRoute();
const {t} = useI18n();

// button styles
const btnDefault: ButtonStyle = {colorPreset: 'strong', backgroundColor: 'var(--layer-background)', size: 'small'};
const btnDisabled: ButtonStyle = {colorPreset: 'disabled', backgroundColor: 'var(--layer-background)', backgroundColorHover: 'var(--layer-background)', size: 'small'}

// data
const tasksCountInit = ref(0);
const tasks: Ref<Task[]> = ref([]);
const multiSubtasks: Ref<{[key: number]: Subtask[]}> = ref({});
const status: Ref<ProjectStatus> = ref('Immutable');
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

// drop
const _drop = async (destTask: Task ,{ sourceTask, subtaskId}: DropSubtaskEvent) => {
  const {classId, projectId} = state;
  await updateSubtask(classId!, projectId!, sourceTask.id, subtaskId, {taskId: destTask.id});
  
  const subtaskIdx = findIndexInList(multiSubtasks.value[sourceTask.id], s => s.id === subtaskId)!;
  const subtask = multiSubtasks.value[sourceTask.id][subtaskIdx];
  subtask.task = destTask;
  listRemoveIdx(multiSubtasks.value[sourceTask.id], subtaskIdx);
  multiSubtasks.value[destTask.id].push(subtask);
}

// update state
onMounted(async ()=>{
  await setupProjectState(route.params.classId.toString(), route.params.id.toString());
  if (state.classId === undefined || state.projectId === undefined) return;

  
  const {classId, projectId: projId} = state;
  
  const _tasks = await getTasks(classId, projId);
  tasksCountInit.value = _tasks.length;
  for (const task of _tasks){
    multiSubtasks.value[task.id] = await getSubtasks(classId, projId, task);
  }
  tasks.value = _tasks;
  const role = await getProjectRole(classId)!;
  if (role === 'TUTOR'){
    status.value = ((await getProjectMembers(projId!, classId!))).map(x => x.id).includes(state.session.profile!.id) ? "Mutable" : "Immutable";
  }
  else{
    status.value = "Mutable";
  }

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
          tasks.value[taskIdx].color = newTask.color;
          tasks.value[taskIdx].description = newTask.description;
          tasks.value[taskIdx].title = newTask.title;
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

// create subtask 
const createSubtask = (task: Task) => dialogs.closeAllWithTypeThenOpen({
  dialogType: "editSubtask",
  payload: {
    subtask: <Subtask>{
      id: -1,
      title: "",
      description: "",
      assignment: [],
      end: getNextWeek(),
      start: new Date(),
      priority: "non-urgent",
      status: "progress",
      task: task,
    },
    tasks,
    deletable: false,
    leftable: false,
  },
  title: t('projectView.tasks.addSubtask'),
  width: "400px",
  close: defaultClose,
  actionsRight: [{
    caption: t("projectView.tasks.addSubtask"),
    expanding: true,
    icon: 'fluent:add-20-regular',
    style: {colorPreset: 'accent-strong'},
    action: async (c, s: Subtask) => {
      const {classId, projectId} = state;
      
      const id = await createSubtaskFetch(
        classId!, 
        projectId!, 
        s.task.id, 
        s.title, 
        s.description, 
        s.status,
        s.priority, 
        s.start, 
        s.end
      );
      if (id === undefined) {
        dialogs.closeDialog(c.id);
        return;
      };

      console.log(id)
      if (s.assignment.length){
        await assignToSubtask(classId!, projectId!, s.task.id, id, s.assignment.map(x => x.id));
      }
      
      const _subtask = await getSubtask(classId!, projectId!, s.task, id);
      if (_subtask === undefined){
        dialogs.closeDialog(c.id);
        return;
      }

      multiSubtasks.value[_subtask.task.id].push(_subtask);
      dialogs.closeDialog(c.id);
    }
  }]
})

//mark all as done
const markAll = async (tasks: Task[]) => {
  const {classId, projectId} = state;
  for (const task of tasks){
    await markAllSubtasksAs(classId!, projectId!, task.id);
    multiSubtasks.value[task.id] = await getSubtasks(classId!, projectId!, task);
  }
}

// edit subtask
const editSubtask = (s: Subtask, task: Task) => dialogs.closeAllWithTypeThenOpen({
  dialogType: "editSubtask",
  payload: {
    subtask: {...s, assignment: [...s.assignment]},
    tasks,
    deletable: true,
    deleteCallback: () => {
      const idx = findIndexInList(multiSubtasks.value[s.task.id], __s => __s.id === s.id);
      if (idx === undefined) return;
      listRemoveIdx(multiSubtasks.value[s.task.id], idx);
    },
    leftable: true,
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
      const {classId, projectId} = state;
      await updateSubtask(classId!, projectId!, task.id, _sUpdated.id, {
        taskId: _sUpdated.task.id,
        end: _sUpdated.end,
        start: _sUpdated.start,
        description: _sUpdated.description,
        priority: _sUpdated.priority,
        status: _sUpdated.status,
        title: _sUpdated.title
      });
      
      const idx = findIndexInList(multiSubtasks.value[task.id], _s => _s.id === _sUpdated.id);
      
      if (idx === undefined ) {
        dialogs.closeDialog(c.id);
        return;
      }
      
      if (s.assignment.length){
        await unassignToSubtask(classId!, projectId!, _sUpdated.task.id, _sUpdated.id, s.assignment.map(x => x.id));
      }
      
      if (_sUpdated.assignment.length){
        await assignToSubtask(classId!, projectId!, _sUpdated.task.id, _sUpdated.id, _sUpdated.assignment.map(x => x.id));
      }

      const newSubtask = await getSubtask(classId!, projectId!, _sUpdated.task, _sUpdated.id);

      if (newSubtask === undefined) {
        dialogs.closeDialog(c.id);
        return;
      }
      
      listRemoveIdx(multiSubtasks.value[task.id], idx);
      insertAt(multiSubtasks.value[newSubtask.task.id], idx, newSubtask);

      dialogs.closeDialog(c.id);
      return;
    }
  }]
})

// tab nav
const navToKanban = () => navigateTo("tasks/kanban");
const navToTimeline = () => navigateTo("tasks/timeline");
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";

.immutable {
  margin-top: $space-large;
  max-width: 500px;
}

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
  width: 100%;
  height: 100%;
  overflow-x: auto;
}

.no-tasks {
  @include typemix-header;
  font-weight: $typeweight-light;
}
</style>