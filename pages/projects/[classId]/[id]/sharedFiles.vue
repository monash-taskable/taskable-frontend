<template>
  <div class="page-root">
    <div class="actions">
      <div class="action-group">
        <IconButton
          @click="addProjectFile"
          icon="fluent:add-20-regular"
          :caption="$t('projects.sharedFiles.upload')"
          :styles="{colorPreset: 'accent-strong'}"
        />
      </div>
      <div class="action-group">
        <IconButton
          v-if="selectedFile"
          :expanding="true"
          :expanded="false"
          icon="fluent:arrow-download-20-regular"
          :styles="btnDefault"
          @click="download"
        />
        <IconButton
          v-if="selectedFile && !isTemplateSelected"
          :expanding="true"
          :expanded="false"
          icon="fluent:delete-20-regular"
          :styles="{colorPreset: 'dangerous-strong'}"
          @click="deleteFile"
        />
      </div>
    </div>
    <div class="files">
      <FileCard 
        v-for="file in templateFiles" 
        :file="file"
        :selected="selectedFile === file"
        @select="(e) => toggleTemplateSelect(e, file)"
        :uploading="file.id === 1 ? 0.2 : undefined"
      />
      <FileCard 
        v-for="file in templateFiles" 
        :file="file"
        :selected="selectedFile === file"
        @select="(e) => toggleSelect(e, file)"
        :uploading="file.id === 1 ? 0.2 : undefined"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sprintf } from 'sprintf-js';
import { deleteProjectFile, getProjectFile, getProjectFiles, projectDownloadRequest, projectFilePreUpload } from '~/scripts/FileUploadFetches';
import { setupProjectState } from '~/scripts/ProjectClassesFetches';
import { findIndexInList, listRemoveIdx, openFileInNewTab } from '~/scripts/Utils';
import { uploadFile } from '~/scripts/XMLFileUpload';
import type { ButtonStyle } from '~/types/Button';
import { defaultClose, type Dialog, type DialogAction } from '~/types/Dialog';
import type { SharedFile } from '~/types/Files';
import type { Optional } from '~/types/Optional';

const btnDefault: ButtonStyle = {colorPreset: 'strong', backgroundColor: 'var(--layer-background)', size: 'small'};

const route = useRoute();
const state = useAppStateStore();
const dialogs = useDialogs();
const {t} = useI18n();

// data
const projectFiles: Ref<SharedFile[]> = ref([]);
const templateFiles: Ref<SharedFile[]> = ref([]);
const fileUploads: Ref<{file: SharedFile, promise: Promise<any>, progress: number}[]> = ref([]);

// interaction
const selectedFile: Ref<Optional<SharedFile>> = ref(undefined);
const isTemplateSelected = ref(false);
const selectFile = (file: SharedFile) => selectedFile.value = file;
const unselectFile = () => selectedFile.value = undefined;
const toggleSelect = ({selection}: {selection: boolean}, file: SharedFile) => {
  if (selection) {
    selectFile(file);
    isTemplateSelected.value = false;
  }
  else unselectFile();
}
const toggleTemplateSelect = ({selection}: {selection: boolean}, file: SharedFile) => {
  if (selection) {
    selectFile(file);
    isTemplateSelected.value = true;
  }
  else unselectFile();
}

// download
const download = async () => {
  const {classId, projectId} = state;
  if (selectedFile.value === undefined) return;
  const url = await projectDownloadRequest(classId!, projectId!, selectedFile.value.id);
  if (url === undefined) return;
  
  openFileInNewTab(url);
}

// delete
const deleteFile = async () => {
  if (selectedFile.value === undefined) return;
  const {classId, projectId} = state;
  
  dialogs.closeAllWithTypeThenOpen({
    dialogType: "optionsAlert",
    width: "400px",
    close: defaultClose,
    payload: {
      message: sprintf(t("projects.sharedFiles.deleteConfirmMsg"), selectedFile.value.filename),
      actions: [<DialogAction>{
        caption: t("dialogCommon.cancel"),
        icon: "fluent:arrow-turn-up-left-20-regular",
        expanding: false,
        style: {colorPreset: 'strong', backgroundColor: 'var(--layer-background)'},
        action: (c: Dialog<any>, _: any) => dialogs.closeDialog(c.id)
      },{
        caption: t("projects.sharedFiles.delete"),
        icon: "fluent:delete-20-regular",
        expanding: false,
        style: {colorPreset: 'dangerous-strong'},
        action: async (c: Dialog<any>, _: any) => {
          if (selectedFile.value === undefined) {
            dialogs.closeDialog(c.id);
            return;
          };
          await deleteProjectFile(classId!, projectId!, selectedFile.value.id);
          const fileIdx = findIndexInList(projectFiles.value, x => x.id === selectedFile.value!.id);
          listRemoveIdx(projectFiles.value, fileIdx!);
          dialogs.closeDialog(c.id);
        }
      }]
    },
    title: t("projects.sharedFiles.deleteConfirm")
  })
}

// add file
const addProjectFile = () => {
  const {classId, projectId} = state;

  dialogs.closeAllWithTypeThenOpen({
    dialogType: "upload",
    title: t("projects.sharedFiles.upload"),
    width: "400px",
    close: defaultClose,
    payload: {
      caption: t('projects.sharedFiles.uploadFileInstruction'),
      onUpload: async (c: Dialog<any>, file: File) => {
        const preUpload = await  projectFilePreUpload(classId!, projectId!, file.name, file.size);
        if (preUpload === undefined) {
          dialogs.closeDialog(c.id);
          return;
        }

        const {id, url} = preUpload;
        const uploadPromise = uploadFile(file, url, async (progress: number) => {
          const idx = findIndexInList(fileUploads.value, ({file}) => file.id === id)!;
          fileUploads.value[idx].progress = progress;
          if (progress >= 0.99) {
            listRemoveIdx(fileUploads.value, idx);
            const file = await getProjectFile(classId!, projectId!, id);
            if (file === undefined) return;
            projectFiles.value.push(file);
          }
        })
        const sharedFile = {filename: file.name, id: id, size: file.size};
        fileUploads.value.push({
          file: sharedFile,
          promise: uploadPromise,
          progress: 0,
        });

        dialogs.closeDialog(c.id);
      }
    }
  })
}

// update state
onMounted(async ()=>{
  await setupProjectState(route.params.classId.toString(), route.params.id.toString());
  state.setProjectPage("sharedFiles");
  
  const {classId, projectId} = state;
  const fileReq = await getProjectFiles(classId!, projectId!);
  projectFiles.value = fileReq.projectFiles;
  templateFiles.value = fileReq.templateFiles;
});
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

.drop-area {
  height: 300px;
  max-width: 500px;

  :deep(.file-upload) {
    height: 300px;
  }
}

.files {
  @include flex-row;
  @include flex-cross(flex-start);
  @include flex-main(flex-start);

  flex-wrap: wrap;
  gap: $space-medium;
  padding: $space-large 0;
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

.files {
  height: 100%;
  overflow-y: auto;
}
</style>