<template>
  <div class="proj-page-root" :style="`--days: ${getDaysInMonth(year, month)}`">
    <div class="action-group">
      <Button
        :caption="$t('projectView.tasks.allTasksView')"
        :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)', size: 'small'}"
        @click="navToTasks"
      />
      <Button
        :caption="$t('projectView.tasks.kanbanView')"
        :styles="{colorPreset: 'strong', backgroundColor: 'var(--layer-background)', size: 'small'}"
        @click="navToKanban"
      />
      <div class="selected">
        <Button
          :caption="$t('projectView.tasks.timelineView')"
          :styles="{colorPreset: 'accent-strong', size: 'small'}"
          @click=""
        />
      </div>
    </div>
    <div
      :style="getStyleCursor(coord)"
      class="timeline-body"
    >
      <div class="timeline-header row">
        <div class="left">
          <IconButton 
            :expanded="false" 
            icon="fluent:chevron-left-20-regular" 
            :styles="{colorPreset: 'accent-strong', size: 'small'}"
            @click="prevMonth"
            />
            {{ sprintf($t('datetime.formatYearMonth'), {month: sprintf($t(`datetime.${monthLookup[month]}`)), year}) }}
            <IconButton 
            :expanded="false" 
            icon="fluent:chevron-right-20-regular" 
            :styles="{colorPreset: 'accent-strong', size: 'small'}"
            @click="nextMonth"
          />
        </div>
        <div class="right">
          <div class="cursor-follower" :class="getClassCursor(following)"></div>
          <div class="month-labels">
            <div v-for="day in range(1, getDaysInMonth(year, month + 1) + 1)" class="month-label">
              {{ day }}
            </div>
          </div>
        </div>
      </div>
      <div class="timeline-entries row">
        <div class="left">
          <div v-if="loading" v-for="_ in tasksCountInit" class="tasks">
            <Skeleton/>
          </div>
          <div v-else v-for="task in tasks" class="tasks" :style="`--tc-strong: var(--tc-${task.color}-strong); --tc-weak: var(--tc-${task.color}-weak)`">
            {{ task.title }}
          </div>
        </div>
        <div @mousemove="cursorUpdate" class="right" @mouseenter="cursorEnter" @mouseleave="cursorExit">
          <div v-for="task in tasks" class="subtasks">
            <div 
              v-for="subtask in getSubtasksForMonth(task, month, year)"
              class="subtask" 
              :style="`--start: ${getMonthSegment(year, month, subtask.start, subtask.end)[0]}; --length: ${getMonthSegment(year, month, subtask.start, subtask.end)[1] + 1};`">
              <ListEntry :subtask="subtask" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sprintf } from 'sprintf-js';
import ListEntry from '~/components/task/ListEntry.vue';
import { getDaysInMonth, getMonthSegment, monthLookup } from '~/scripts/Datetime';
import { getProjectMembers, getProjectRole, setupProjectState } from '~/scripts/ProjectClassesFetches';
import { getSubtasks, getTasks } from '~/scripts/TasksFetches';
import { range } from '~/scripts/Utils';
import type { ProjectStatus, Subtask, Task } from '~/types/ProjectClass';

const state = useAppStateStore();
const route = useRoute();

// data
const tasksCountInit = ref(0);
const tasks: Ref<Task[]> = ref([]);
const multiSubtasks: Ref<{[key: number]: Subtask[]}> = ref({});
const status: Ref<ProjectStatus> = ref('Immutable');
const loading = ref(true);
multiSubtasks.value[0] = [];

const now = new Date();
const month = ref(now.getMonth());
const year = ref(now.getFullYear());

// cursor follower
const following = ref(false);
const coord = ref(-1);
const cursorEnter = () => following.value = true;
const cursorExit = () => following.value = false;
const cursorUpdate = (e: MouseEvent) => {
  coord.value = e.offsetX;
}

const getClassCursor = (following: boolean) => following ? "following" : "";
const getStyleCursor = (coord: number) => coord ? `--follower-x: ${coord}px` : `--follower-x: -1px`;

const nextMonth = () => {
  const _nextMonth = month.value + 1;
  if (_nextMonth > 11) {
    year.value ++;
    month.value = 0;
    return;
  }
  month.value = _nextMonth;
}

const prevMonth = () => {
  const _prevMonth = month.value - 1;
  if (_prevMonth < 0) {
    year.value --;
    month.value = 11;
    return;
  }
  month.value = _prevMonth;
}

// update state
onMounted(async ()=>{
  await setupProjectState(route.params.classId.toString(), route.params.id.toString());
  const {classId, projectId: projId} = state;
  
  const _tasks = await getTasks(classId!, projId!);
  tasksCountInit.value = _tasks.length;
  for (const task of _tasks){
    multiSubtasks.value[task.id] = await getSubtasks(classId!, projId!, task);
  }
  tasks.value = _tasks;
  const role = await getProjectRole(classId!)!;
  if (role === 'TUTOR'){
    status.value = ((await getProjectMembers(projId!, classId!))).map(x => x.id).includes(state.session.profile!.id) ? "Mutable" : "Immutable";
  }
  else{
    status.value = "Mutable";
  }

  loading.value = false;
  
  state.setProjectPage("tasks");
});

// get subtasks for month
const getSubtasksForMonth = (task: Task, month: number, year: number) => multiSubtasks
  .value[task.id]
  .filter(s => 
    (s.start.getFullYear() === year && s.start.getMonth() === month) || 
    (s.end.getFullYear() === year && s.end.getMonth() === month));

// tab nav
const navToTasks = () => navigateTo("../tasks");
const navToKanban = () => navigateTo("kanban");
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";

$left-size: 275px;
$entry-height: 50px;

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

.proj-page-root {
  height: calc(100% - 50px);
}

.timeline-body {
  @include flex-col;
  @include flex-cross(stretch);
  @include flex-main(flex-start);

  height: 100%;
  width: 100%;
  background: var(--layer-background);
  margin-top: $space-large;

  .row {
    @include flex-row;
    @include flex-cross(stretch);
    @include flex-main(flex-start);
    
    .left {
      width: $left-size;
    }
    
    .right {
      flex: 1;
      padding-right: $space-medium;
    }
  }
}

.timeline-header {
  .left {
    @include flex-row;
    @include flex-main(flex-start);
    @include typemix-label(var(--accent-strong));
    @include flex-cross(center);
    
  }
  .left {
    gap: $space-medium;
  }
  .right {
    position: relative;

    .cursor-follower.following {
      position: absolute;
      top: 0;
      left: var(--follower-x);
      height: 100%;
      border-left: 1px solid var(--accent-intermediate);
    }
    
    .month-labels {
      @include flex-row;
      @include flex-main(flex-start);
      @include typemix-label(var(--accent-strong));
      @include flex-cross(center);
      @include flex-cross(flex-end);

      position: absolute;
      width: calc(100% - $space-medium);
      bottom: 0;
    }

    .month-label {
      flex: 2;
      border-left: 1px solid var(--foreground-weak);
      padding: 0 $space-extra-small;
      
      &.last-left {
        flex: 1;
      }
      
      &.last {
        flex: 1;
        border-left: 0;
        border-right: 1px solid var(--foreground-weak);
        text-align: right;
      }
    }
  }
}

.timeline-entries {
  flex: 1;
}

.tasks {
  @include flex-row;
  @include flex-cross(center);
  @include flex-main(flex-start);
  
  height: $entry-height;
  padding: 0 $space-large;
  color: var(--tc-strong);
  user-select: none;
  cursor: pointer;
  
  &:hover {
    background: var(--tc-weak);
  }
}

.subtasks {
  @include flex-row;
  @include flex-cross(center);
  @include flex-main(flex-start);
  
  height: $entry-height;
  position: relative;
  
  .subtask {
    @include flex-row;
    @include flex-cross(center);
    @include flex-main(flex-start);
    
    height: $entry-height;
    position: absolute;
    top: 0;
    left: calc(calc(100% / var(--days)) * var(--start));
    width: calc(calc(100% / var(--days)) * var(--length)); 

    &:deep(.list-entry) {
      width: 100%;
    }
  }
}
</style>