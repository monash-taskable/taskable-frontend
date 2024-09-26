<template>
  <div class="announcement-page-root">
    <div v-if="announcement" class="meta">
      <span>{{ announcement.author.name }}</span>・
      <DateTimeFormat :datetime="announcement.sentAt" format="date-time-day"/>
    </div>
    <div v-else class="meta">
      <span><Skeleton/></span>・<Skeleton width="500px"/>
    </div>
    <div v-if="announcement" class="title">{{ announcement.title }}</div>
    <div v-else class="title"><Skeleton size="title"/></div>
    <hr>
    <div class="content">
      <VueMarkdown v-if="announcement" :source="announcement.content"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import VueMarkdown from 'vue-markdown-render';
import { getAnnouncement, setupProjectState } from '~/scripts/ProjectClassesFetches';
import { isNumericString } from '~/scripts/Utils';
import type { Optional } from '~/types/Optional';
import type { Announcement } from '~/types/ProjectClass';

const route = useRoute();
const state = useAppStateStore();

// data
const announcement: Ref<Optional<Announcement>> = ref(undefined);
const loading = ref(false);

// update state
onMounted(async ()=>{
  if (!state.projectId || !state.classId){
    await setupProjectState(route.params.classId.toString(), route.params.id.toString());
  }

  state.setProjectPage("announcements");
  const { classId } = state;

  const announcementId = route.params.announcementId.toString();
  if (!isNumericString(announcementId)){
    navigateTo("list");
    return;
  }

  announcement.value = await getAnnouncement(classId!, Number(announcementId));
  loading.value = false;
});
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";

.announcement-page-root {
  flex: 1;
  background: var(--layer-background);
  padding: $space-extra;
}

.content {
  border: 2px solid var(--layer-background);
  height: 270px;
  overflow-y: auto;
  
  :deep(*) {
    @include typemix-label;
    margin: 0;
    margin-bottom: $space-medium;
  }

  :deep(h1) {
    @include typemix-title;
  }
  
  :deep(h2) {
    @include typemix-header;
  }
  
  :deep(h3), :deep(strong) {
    font-weight: 500;
  }
  
  :deep(a) {
    color: var(--accent-strong);
    &:hover {
      background: var(--accent-weak);
    }
  }

}

.meta {
  @include flex-row;
  @include flex-main(flex-start);
  @include flex-cross(baseline);
  
  color: var(--foreground-weak);
}

.title {
  @include typemix-title(var(--accent-strong));
}

hr{
  margin-bottom: $space-large;
  border: 1px solid var(--background-interaction-strong);
}

</style>