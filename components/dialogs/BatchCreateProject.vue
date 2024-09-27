<template>
  <div class="dialog-root">
    <div class="instruction">
      {{ $t('projects.batchCreate.chooseFile') }}
      <Button
        :styles="{padding: '0', colorPreset:'accent'}"
        :caption="$t('projects.batchCreate.guide')"
        @click="showInstruction"
      >
      </Button>
    </div>
    <div class="file">
    </div>
    <FileUpload @change="onFileUpload":caption="$t('projects.batchCreate.chooseFilePrompt')"/>
  </div>
</template>

<script lang="ts" setup>
import { findIndexInList, findInList } from '~/scripts/Utils';
import { quickAlert, type Dialog } from '~/types/Dialog';

const {t} = useI18n();

const emits = defineEmits(["emit"]);
const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    classId: number,
  }>>, required: true},
});

const onFileUpload = ({file}: {file: File}) => {
  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result as string;
    const splitted = text.split("\n");
    const header = splitted[0].split(",");
    const studentIndex = findIndexInList(header, x => x.trim().toLowerCase() === 'student')!;
    const projectNameIndex = findIndexInList(header, x => x.trim().toLowerCase() === 'project name')!;
    const parsed = splitted.filter(Boolean).slice(1).map(x => x.split(",")).map((x) => ({student: x[studentIndex].trim(), project: x[projectNameIndex].trim()}))
    const grouped = parsed.reduce((acc, curr) => {
      const { project, student } = curr;
      if (!acc[project]) {
        acc[project] = [];
      }
      acc[project].push(student);
      return acc;
    }, {} as Record<string, string[]>);
    emits("emit", grouped);
  };
  reader.readAsText(file); // Read file as text
}

// instructions
const showInstruction = () => {
  quickAlert(t('projects.batchCreate.instruction'));
}


</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";

.dialog-root {
  @include flex-col;
  @include flex-cross(stretch);
  @include flex-main(flex-start);

  padding: $space-large;
  gap: $space-medium;
}

.instruction {
  @include flex-row;
  @include flex-cross(baseline);
  @include flex-main(flex-start);
  
  @include typemix-label;
  gap: $space-small;
}


</style>