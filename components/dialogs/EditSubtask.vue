<template>
  <div class="dialog-root">
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
            v-model="dataRef.status"
          @change="emitChange"
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
          <div class="row" v-for="member in dataRef.assignment">
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
    <div class="form-root" v-if="props.context.payload.leftable">
      <div class="attachment group">
        <div class="icon"><Icon name="fluent:attach-20-regular"/></div>
        <div class="content stretched">
          <div class="header">
            <span class="label">{{ $t('projectView.subtasks.attachments') }}</span>
            <IconButton
              :styles="{colorPreset: 'accent-strong', size: 'small'}"
              :caption="$t('projectView.subtasks.addAttachment')"
              icon="fluent:add-20-regular"
              @click="() => newFile()"
            />
          </div>
          <div class="panel">
            <FileCard 
              v-for="file in fileUploads"
              :file="file.file"
              :uploading="file.progress"
              compact
            />
            <div v-for="attachment in attachments" class="record-row">
              <IconButton 
                icon="fluent:document-20-regular"
                :caption="attachment.filename"
                class="attachment-label" 
                :styles="{colorPreset: 'strong', padding: '0'}"
              />
              <IconButton
                :styles="{colorPreset: 'strong', size: 'small'}"
                :expanded="false"
                expanding
                icon="fluent:subtract-20-regular"
                @click="() => detach(attachment)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="comments group">
        <div class="icon"><Icon name="fluent:comment-multiple-20-regular"/></div>
        <div class="content stretched">
          <div class="header">
            <span class="label">{{ $t('projectView.subtasks.comments') }}</span>
            <IconButton
              :styles="{colorPreset: 'accent-strong', size: 'small'}"
              :caption="$t('projectView.subtasks.addComment')"
              icon="fluent:add-20-regular"
              @click="addComment"
            />
          </div>
          <div class="panel">
            <div v-for="comment in comments" class="comment">
              <div class="comment-content">
                <div class="comment-meta">
                  <div class="author"> {{ comment.author.name }} </div>
                  <div class="timestamp"> <DateTimeFormat :datetime="comment.created" format="date-time"/> </div>
                </div>
                <div class="content">
                  <VueMarkdown :source="formatUrlsToMarkdown(comment.comment)"/>
                </div>
              </div>
              <div class="comment-control" v-if="selfId === comment.author.id || selfRole === 'OWNER' || selfRole === 'ADMIN'">
                <IconButton
                  :styles="{colorPreset: 'strong', size: 'small'}"
                  :expanded="false"
                  expanding
                  icon="fluent:pen-20-regular"
                  @click="() => editComment(comment)"
                />
                <IconButton
                  :styles="{colorPreset: 'dangerous', size: 'small'}"
                  :expanded="false"
                  expanding
                  icon="fluent:delete-20-regular"
                  @click="() => delComment(comment)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sprintf } from 'sprintf-js';
import VueMarkdown from 'vue-markdown-render';
import { dateToInput, inputToDate } from '~/scripts/Datetime';
import { attachFileToSubtask, detachSubtaskFile, getProjectFile, getProjectFiles, getSubtaskFiles, subtaskFilePreUploadRequest } from '~/scripts/FileUploadFetches';
import { getProjectMembers } from '~/scripts/ProjectClassesFetches';
import { createComment, deleteComment, deleteSubtask as deleteSubtaskFetch, getComment, getComments, updateComment } from '~/scripts/TasksFetches';
import { findIndexInList, findInList, formatUrlsToMarkdown, ident, listRemoveIdx } from '~/scripts/Utils';
import { uploadFile } from '~/scripts/XMLFileUpload';
import { defaultClose, type Dialog } from '~/types/Dialog';
import type { SharedFile } from '~/types/Files';
import { isPriority, priorities, taskStatuses, type Comment, type Member, type OwnershipRole, type Subtask, type Task } from '~/types/ProjectClass';

const state = useAppStateStore();
const dialogs = useDialogs();
const {t} = useI18n();

const emits = defineEmits(["emit"]);
const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    subtask: Subtask,
    tasks: Task[],
    deletable: boolean,
    leftable: boolean,
    deleteCallback: () => any;
  }>>, required: true},
});

const {subtask: _subtask, tasks} = props.context.payload;
const dataRef: Ref<Subtask> = ref(_subtask);
const selfRole: Ref<OwnershipRole> = ref('TUTOR');
const selfId = ref(-1);

const taskChange = (id: String) => {
  dataRef.value.task = findInList(tasks, t => t.id === Number(id), ident)!;
  emits("emit", dataRef.value);
}

onMounted(async () => {
  emits("emit", dataRef.value);
  const {classId, projectId, session} = state;
  availableMembers.value = await getProjectMembers(projectId!, classId!)!;
  selfId.value = session.profile!.id;
  const members = await getProjectMembers(projectId!, classId!);
  const selfIdx = findIndexInList(members, m => m.id === selfId.value);
  if (selfIdx !== undefined){
    selfRole.value = members[selfIdx].role;
  }

  attachments.value = await getSubtaskFiles(classId!, projectId!, _subtask.task.id, _subtask.id);
  const projFilesReq = await getProjectFiles(classId!, projectId!)
  projectFiles.value = [...projFilesReq.templateFiles, ...projFilesReq.projectFiles];
  comments.value = await getComments(classId!, projectId!, _subtask.task.id, _subtask.id);
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

// attachment data / process
const projectFiles: Ref<SharedFile[]> = ref([]);
const attachments: Ref<SharedFile[]> = ref([]);
const fileUploads: Ref<{file: SharedFile, promise: Promise<any>, progress: number}[]> = ref([]);


const detach = async (file: SharedFile) => {
  const {classId, projectId} = state;

  await detachSubtaskFile(classId!, projectId!, _subtask.task.id, _subtask.id, file.id);
  const idx = findIndexInList(attachments.value, x => x.id === file.id);
  if (idx === undefined) return;
  listRemoveIdx(attachments.value, idx);
}

const newFile = async () => {
  dialogs.openDialog({
    dialogType: 'subtaskFileAttach',
    title: t('projects.sharedFiles.upload'),
    close: defaultClose,
    payload: {
      files: projectFiles.value.filter(f => !attachments.value.map(a => a.id).includes(f.id)),
      onFileDrop: async (f: File, ctxId: string) => {
        const {classId, projectId} = state;

        const preUpload = await subtaskFilePreUploadRequest(classId!, projectId!, _subtask.task.id, _subtask.id, f.name, f.size);
        if (preUpload === undefined) {
          dialogs.closeDialog(ctxId);
          return;
        }

        const {id, url} = preUpload;
        const uploadPromise = uploadFile(f, url, async (progress: number) => {
          const idx = findIndexInList(fileUploads.value, ({file}) => file.id === id);
          if (idx === undefined) return;
          fileUploads.value[idx].progress = progress;
          if (progress >= 0.99) {
            listRemoveIdx(fileUploads.value, idx);
            const file = await getProjectFile(classId!, projectId!, id);
            if (file === undefined) return;
            attachments.value.push(file);
          }
        })
        const sharedFile = {filename: f.name, id: id, size: f.size};
        fileUploads.value.push({
          file: sharedFile,
          promise: uploadPromise,
          progress: 0,
        });

        dialogs.closeDialog(ctxId);
      },
      onFileSelect: async (f: SharedFile, ctxId: string) => {
        const {classId, projectId} = state;
        await attachFileToSubtask(classId!, projectId!, _subtask.task.id, _subtask.id, f.id);
        attachments.value.push(f);
        dialogs.closeDialog(ctxId);
      },
    },
    width: '500px'
  })
}

// comments data
const comments: Ref<Comment[]> = ref([]);

// delete comment
const delComment = async (comment: Comment) => {
  const {classId, projectId} = state;
  await deleteComment(classId!, projectId!, _subtask.task.id, _subtask.id, comment.id);
  const idx = findIndexInList(comments.value, c => c.id === comment.id);
  if (idx === undefined) return;
  listRemoveIdx(comments.value, idx);
}

// add comment
const addComment = async () => {
  dialogs.closeAllWithTypeThenOpen({
    dialogType: 'multilinePrompt',
    payload: {placeholder: t('projectView.subtasks.commentInstruction')},
    width: '500px',
    close: defaultClose,
    title: t('projectView.subtasks.addCommentTitle'),
    actionsRight: [{
      caption: t(`dialogCommon.confirm`),
      icon: "fluent:checkmark-20-regular",
      style: {colorPreset: "accent-strong"},
      expanding: true,
      action: async (c, s: string) => {
        if (s === "" || s === undefined) return;
        const {classId, projectId} = state;
        
        const id = await createComment(classId!, projectId!, _subtask.task.id, _subtask.id, s, new Date());
        if (id === undefined) {
          dialogs.closeDialog(c.id);
          return;
        }
        
        const comment = await getComment(classId!, projectId!, _subtask.task.id, _subtask.id, id);
        if (comment === undefined) {
          dialogs.closeDialog(c.id);
          return;
        }
        
        comments.value.push(comment);
        dialogs.closeDialog(c.id);
      }
    }]
  })
}

// update comment
const editComment = async (comment: Comment) => {
  dialogs.closeAllWithTypeThenOpen({
    dialogType: 'multilinePrompt',
    payload: {placeholder: t('projectView.subtasks.commentInstruction'), value: comment.comment},
    width: '500px',
    close: defaultClose,
    title: t('projectView.subtasks.editCommentTitle'),
    actionsRight: [{
      caption: t(`dialogCommon.confirm`),
      icon: "fluent:checkmark-20-regular",
      style: {colorPreset: "accent-strong"},
      expanding: true,
      action: async (c, s: string) => {
        if (s === "" || s === undefined) return;
        const {classId, projectId} = state;
        
        await updateComment(classId!, projectId!, _subtask.task.id, _subtask.id, comment.id, s);

        const idx = findIndexInList(comments.value, c => c.id === comment.id);
        if (idx === undefined) {
          dialogs.closeDialog(c.id);
          return;
        }
        comments.value[idx].comment = s;
        dialogs.closeDialog(c.id);
      }
    }]
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
  @include flex-main(flex-start);

  gap: $space-medium;
  flex: 1;
}

.dialog-root {
  padding: $space-medium-large;
  @include flex-row;
  @include flex-cross(stretch);
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
    .row {
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

.record-row {
  @include flex-row;
  @include flex-cross(stretch);
  
  background: var(--layer-background);
}

.group.attachment, .group.comments {
  .panel {
    @include flex-col;
    @include flex-cross(stretch);
    @include flex-main(flex-start);
    
    overflow-y: auto;
    height: 100%;
  }
}

.group.attachment {
  max-height: 130px;
  
  .content {
    height: 100%;
  }
}

.group.comments {
  .panel {
    gap: $space-medium;
  }
}

.attachment-label {
  flex: 1;
  width: 310px;
  
  .attachment-name {
    @include flex-row;

    span {
      width: $icon-size-medium;
      height: $icon-size-medium;
    }
  }
}

.comment {
  @include flex-row;
  @include flex-cross(flex-start);

  background: var(--layer-background);

  .comment-content {
    flex: 1;
    padding: $space-medium;

    .comment-meta {
      margin-bottom: $space-small;
    }

    .author {
      @include typemix-label(var(--accent-strong));
    }

    .content {
      @include typemix-label;

      :deep * {
        @include typemix-label;
        margin: 0;
      }

      :deep a{
        color: var(--accent-strong);
        &:hover {background: var(--accent-weak)}
      }
    }
    
    .timestamp {
      @include typemix-label(var(--foreground-weak));
    }
  }
}
</style>