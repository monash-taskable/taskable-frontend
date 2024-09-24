<template>
  <div class="container" :class="isEmpty() ? 'empty' : ''">
    <ProjectClassList :project-class="projCls" v-for="[_, projCls] in Object.entries(projectClassRef.projectClasses.value)" />
    <div v-if="isEmpty()">
      {{ $t('projects.noClass') }}
    </div>
    <div class="new-section">
      <IconButton @click="openCreateClassForm" icon="fluent:people-community-add-20-regular" :caption="$t('projects.newClass')" :styles="{colorPreset: 'accent', size: 'small'}" />
      <IconButton v-if="useRuntimeConfig().public.debug" @click="addDebugClass" icon="fluent:bug-20-regular" :caption="$t('projects.addDebugClass')" :styles="{colorPreset: 'accent', size: 'small'}" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FetchRequest } from '~/scripts/FetchTools';
import { getCurrentGMTDateTime } from '~/scripts/Utils';
import { defaultClose, type Dialog } from '~/types/Dialog';
import { debugProjectClass, type ProjectClass } from '~/types/ProjectClass';
import { CreateClassRequest, GetClassResponse } from '~/types/proto/ProjectClass';

const {t} = useI18n();

useAppStateStore().setTitle(t("projects.title"), true);
const dialogControl = useDialogs();

const projectClassStore = useProjectClassStore();
const projectClassRef = storeToRefs(projectClassStore);

const addDebugClass = () => projectClassStore.setLocalClass(debugProjectClass);

const isEmpty = () => Object.keys(projectClassRef.projectClasses.value).length === 0;


// create class
const openCreateClassForm = () => dialogControl.closeAllWithTypeThenOpen({
  width: "350px",
  height: "fit-content",
  title: t("projects.newClass.title"),
  dialogType: "createClass",
  close: {
    ...defaultClose,
    caption: t("dialogCommon.cancel"), 
    style: {colorPreset: "strong"}
  },
  actionsRight: [
    {
      caption: t("dialogCommon.confirm"),
      icon: t("fluent:checkmark-20-regular"),
      style: {colorPreset: "accent-strong"},
      action: (d: Dialog<{}>, emt?: any) => {
        emt = emt as string;
        if (emt === ""){
          return;
        }

        // create class call
        const createClassReq = FetchRequest.protectedAPI("/classes/create")
          .post()
          .payload(CreateClassRequest.encode, {
            classDesc: "",
            className: emt,
            timestamp: getCurrentGMTDateTime(),
          })
          .commitAndRecv(GetClassResponse.decode);

        createClassReq.then(req => req.res(projectClassStore.createClassCallback));
        
        useDialogs().closeDialog(d.id);
      },
      expanding: false,
    }
  ],
  payload: {}
});

onMounted(async () => {
  projectClassStore.cleanupLocalClasses();
  await projectClassStore.loadClasses();
})

</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Sizes.scss";

.new-section {
  @include flex-col;
  @include flex-cross(stretch);
  
  border: 2px dashed var(--layer-background);
  padding: calc($space-medium - 4px);
  min-width: max-content;
  
  & .section-title {
    @include flex-row;
    @include flex-cross(center);
    @include flex-main(space-around);
    
    & .controls { @include flex-row; };
    & h3 { flex: 1; }
  }
}

.container {
  @include flex-row;
  @include flex-cross(flex-start);
  @include flex-main(flex-start);
  
  width: calc(100% - ($space-medium * 2));
  height: calc(calc(100% - 2.75rem) - calc($space-medium * 2));
  padding: $space-medium;
  gap: $space-medium;
  overflow-x: auto;
  
  @media only screen and (max-width: 700px) {
    @include flex-col;
    @include flex-cross(stretch);
    @include flex-main(flex-start);
  }
}

.empty {
  @include flex-col;
  @include flex-cross(center);
  @include flex-main(center);
  @include typemix-title;


  gap: $space-extra;
}
</style>