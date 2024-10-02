<template>
  <div class="dialog-body">
    <div class="actions">
      <div class="action-group">
        <IconButton
          icon="fluent:add-20-regular"
          :caption="$t('projects.sharedFiles.upload')"
          :styles="{colorPreset: 'accent-strong'}"
          @click="addTemplateFile"
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
          v-if="selectedFile"
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
      />
      <FileCard 
        v-for="file in fileUploads"
        :file="file.file"
        :uploading="file.progress"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sprintf } from 'sprintf-js';
import { deleteTemplateFile, getTemplateFile, getTemplateFiles, templateFileDownloadRequest, templateFilePreUploadRequest } from '~/scripts/FileUploadFetches';
import { findIndexInList, listRemoveIdx, openFileInNewTab } from '~/scripts/Utils';
import { uploadFile } from '~/scripts/XMLFileUpload';
import type { ButtonStyle } from '~/types/Button';
import { defaultClose, type Dialog, type DialogAction } from '~/types/Dialog';
import type { SharedFile } from '~/types/Files';
import type { Optional } from '~/types/Optional';
import type { ProjectClass, Template } from '~/types/ProjectClass';

const btnDefault: ButtonStyle = {colorPreset: 'strong', backgroundColor: 'var(--layer-background)', size: 'small'};

const dialogs = useDialogs();
const {t} = useI18n();

// data
const templateFiles: Ref<SharedFile[]> = ref([]);
const fileUploads: Ref<{file: SharedFile, promise: Promise<any>, progress: number}[]> = ref([]);
  
const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    template: Template,
    projClass: ProjectClass,
  }>>, required: true},
});

const {template, projClass} = props.context.payload;

console.log(template);

// interaction
const selectedFile: Ref<Optional<SharedFile>> = ref(undefined);
const selectFile = (file: SharedFile) => selectedFile.value = file;
const unselectFile = () => selectedFile.value = undefined;
const toggleTemplateSelect = ({selection}: {selection: boolean}, file: SharedFile) => {
  if (selection) {
    selectFile(file);
  }
  else unselectFile();
}

// download
const download = async () => {
  if (selectedFile.value === undefined) return;
  const url = await templateFileDownloadRequest(projClass.classId, template.templateId, selectedFile.value.id);
  if (url === undefined) return;
  
  openFileInNewTab(url);
}

// delete
const deleteFile = async () => {
  if (selectedFile.value === undefined) return;
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
          await deleteTemplateFile(projClass.classId!, template.templateId!, selectedFile.value.id);
          const fileIdx = findIndexInList(templateFiles.value, x => x.id === selectedFile.value!.id);
          listRemoveIdx(templateFiles.value, fileIdx!);
          dialogs.closeDialog(c.id);
        }
      }]
    },
    title: t("projects.sharedFiles.deleteConfirm")
  })
}

// add file
const addTemplateFile = () => {
  dialogs.closeAllWithTypeThenOpen({
    dialogType: "upload",
    title: t("projects.sharedFiles.upload"),
    width: "400px",
    close: defaultClose,
    payload: {
      caption: t('projects.sharedFiles.uploadFileInstruction'),
      onUpload: async (c: Dialog<any>, file: File) => {
        const preUpload = await  templateFilePreUploadRequest(projClass.classId, template.templateId, file.name, file.size);
        if (preUpload === undefined) {
          dialogs.closeDialog(c.id);
          return;
        }

        const {id, url} = preUpload;
        const uploadPromise = uploadFile(file, url, async (progress: number) => {
          const idx = findIndexInList(fileUploads.value, ({file}) => file.id === id);
          if (idx === undefined) return;
          if (progress === 1) {
            setTimeout(async () => {
              listRemoveIdx(fileUploads.value, idx);
              const file = await getTemplateFile(projClass.classId, template.templateId, id);
              if (file === undefined) return;
              templateFiles.value.push(file);
            }, 500);
          }
          fileUploads.value[idx].progress = progress;
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

onMounted(async () => {
  templateFiles.value = (await getTemplateFiles(projClass.classId, template.templateId)).templateFiles;
})

</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";

.dialog-body {
  padding: $space-large;
  height: var(--height);
}


.actions {
  @include flex-row;
  @include flex-main(flex-start);

  gap: $space-medium;
  margin-bottom: $space-medium;
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