<template>
  <div
    class="file-upload"
    @dragover.prevent
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <input
      type="file"
      ref="fileInput"
      class="hidden-file-input"
      @change="handleFileChange"
    />
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts" setup>
const emits = defineEmits(["change"])
const props = defineProps({
  caption: {type: String, default: ""},
})

const fileInput = ref<HTMLInputElement | null>(null);
const message = ref<string>(props.caption);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target?.files?.[0]) {
    const file = target.files[0];
    message.value = file.name;
    readFileContent(file);
  }
};

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0];
  if (file) {
    message.value = file.name;
    readFileContent(file);
  }
};

const readFileContent = (file: File) => {
  emits("change", {file})
  // const reader = new FileReader();
  // reader.onload = () => {
    
  // };
  // reader.readAsText(file);
};
</script>

<style lang="scss">
.file-upload {
  border: 2px dashed var(--accent-intermediate);
  background-color: transparent;
  color: var(--accent-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-align: center;
  
  &:hover {
    border: 2px dashed var(--accent-strong);
  }
}

.hidden-file-input {
  display: none;
}
</style>