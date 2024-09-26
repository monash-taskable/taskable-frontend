<template>
  <div class="announcement-layout-root">
    <div class="list">
      <Button
        v-for="announcement in announcements"
        :styles="{padding: '0', backgroundColor: 'var(--layer-background)', colorPreset: selected(announcement.id) ? 'accent-strong' : 'strong'}"
        @click="() => navToAnnouncement(announcement.id)"
      >
        <div class="list-item" :class="selected(announcement.id)">
          <div class="title">{{ announcement.title }}</div>
          <div class="meta">
            <span>{{ announcement.author.name }}</span>・
            <DateTimeFormat :datetime="announcement.sentAt" format="date-time"/>
          </div>
        </div>
      </Button>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { getAnnouncements, setupProjectState } from '~/scripts/ProjectClassesFetches';
import { isNumericString } from '~/scripts/Utils';
import type { Announcement } from '~/types/ProjectClass';

const route = useRoute();
const state = useAppStateStore();

// data
const announcements: Ref<Announcement[]> = ref([]);
const loading = ref(false);
const _aId = route.params.announcementId;
if (_aId){
  const announcementId = isNumericString(_aId.toString()) ? Number(_aId.toString()) : undefined;
}
const selected = (id: number) => String(id) === _aId ? "selected" : "";

// update state
onMounted(async ()=>{
  await setupProjectState(route.params.classId.toString(), route.params.id.toString());
  state.setProjectPage("announcements");
  const { classId } = state;

  announcements.value = await getAnnouncements(classId!);
  loading.value = false;
});

const navToAnnouncement = (navId: number) => navigateTo(String(navId));
</script>

<style lang="scss" scoped>
@import "/assets/styles/constants/Flex.scss";
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";

.announcement-layout-root {
  @include flex-row;
  @include flex-cross(stretch);
  
  gap: $space-medium;
  width: 100%;
  height: 100%;
}

.list-item {
  @include flex-col;
  @include flex-cross(flex-start);
  
  padding: $space-medium-large;
  width: 400px;
  
  .title {
    @include typemix-label;
  }
  
  .meta {
    @include flex-row;
    @include flex-main(flex-start);
    @include flex-cross(baseline);
    
    color: var(--foreground-weak);
  }
  
  &.selected .title {
    @include typemix-label(var(--accent-strong));
  }
}


</style>