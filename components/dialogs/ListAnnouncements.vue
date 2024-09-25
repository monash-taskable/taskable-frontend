<template>
  <div class="body">
    <Table selectable action
      :loading="loading"
      :items="announcements"
      :serialize="(a: Announcement) => ({title: a.title, author: a.author.name, createdAt: datetimeFormat(a.sentAt)})"
      :identify="(a: Announcement, _) => a.id"
      :search="search"
      :selected-actions="selectedActions"
      :columns="[
        {key: 'title', label: t('projects.announcements.title'), order: 0, flex: 4},
        {key: 'author', label: t('projects.announcements.author'), order: 1, flex: 4},
        {key: 'createdAt', label: t('projects.announcements.createdAt'), order: 2, flex: 5},
      ]"
    >
      <template #actions>
        <IconButton
          :caption="$t('projects.announcements.postAnnouncement')"
          icon="fluent:add-20-regular"
          :styles="{colorPreset: 'accent-strong'}"
          @click="postAnnouncement"
        />
      </template>
    </Table>
    <div class="info" v-if="announcements.length === 0">{{ $t('projects.announcements.noAnnouncements') }}</div>
  </div>
</template>

<script lang="ts" setup>
import { sprintf } from 'sprintf-js';
import type { PropType } from 'vue';
import { dayOfWeekLookup, monthLookup } from '~/scripts/Datetime';
import { createAnnouncement, getAnnouncements, updateAnnouncement as updateAnnouncementFetch, deleteAnnouncement as deleteAnnouncementFetch, getAnnouncement } from '~/scripts/ProjectClassesFetches';
import { defaultClose, quickAlert, quickError, type Dialog, type DialogAction } from '~/types/Dialog';
import type { ProjectClass, Announcement } from '~/types/ProjectClass';
import { defaultSearch, type SelectedAction } from '~/types/Table';

const {t} = useI18n();
const dialogs = useDialogs();

const emit = defineEmits(["emit"]);
const props = defineProps({
  context: {type: Object as PropType<Dialog<{
    projectClass: ProjectClass,
  }>>, required: true},
});

const { projectClass } = props.context.payload;

const loading = ref(true);
const announcements: Ref<Announcement[]> = ref([]);


// delete announcement
const deleteAnnouncement = (a: Announcement[]) => {
  dialogs.closeAllWithTypeThenOpen({
    dialogType: "optionsAlert",
    width: "400px",
    close: defaultClose,
    payload: {
      message: t("projects.announcements.deleteAnnouncementMessage"),
      actions: [<DialogAction>{
        caption: t("dialogCommon.cancel"),
        icon: "fluent:arrow-turn-up-left-20-regular",
        expanding: false,
        style: {colorPreset: 'strong', backgroundColor: 'var(--layer-background)'},
        action: (c: Dialog<any>, _: any) => dialogs.closeDialog(c.id)
      },{
        caption: t("projects.announcements.deleteAnnouncement"),
        icon: "fluent:delete-20-regular",
        expanding: false,
        style: {colorPreset: 'dangerous-strong'},
        action: async (c: Dialog<any>, _: any) => {
          for (const _a of a)
            await deleteAnnouncementFetch(projectClass.classId, _a.id);
          announcements.value = await getAnnouncements(projectClass.classId);
        dialogs.closeDialog(c.id);
        }
      }]
    },
    title: t("projects.announcements.deleteAnnouncement.title")
  })
}

// update announcement
const updateAnnouncement = (a: Announcement) => dialogs.closeAllWithTypeThenOpen({
  dialogType: "editAnnouncement",
  payload: {
    title: a.title,
    content: a.content,
  },
  title: t("projects.announcements.editAnnouncement.title"),
  width: "700px",
  actionsRight: [{
    caption: t("dialogCommon.confirm"),
    icon: "fluent:checkmark-20-regular",
    expanding: true,
    style: {colorPreset: 'accent-strong'},
    action: async (ctx, data: {title: string, content: string}) => {
      await updateAnnouncementFetch(projectClass.classId, a.id, data);
      announcements.value = await getAnnouncements(projectClass.classId);
      dialogs.closeDialog(ctx.id);
    }
  }],
  close: defaultClose,
});


// selected action
const selectedActions: SelectedAction[] = [{
  action: deleteAnnouncement,
  button: {
    icon: "fluent:delete-20-regular",
    label: "",
    expanding: true,
    expanded: false,
    style: {colorPreset: "strong"}
  }
},{
  action: async (a: Announcement[]) => {
    if (a.length > 1){
      quickAlert(t("projects.announcements.editOne"));
      return;
    }

    await updateAnnouncement(a[0]);
  },
  button: {
    icon: "fluent:pen-20-regular",
    label: "",
    expanding: true,
    expanded: false,
    style: {colorPreset: "strong"}
  }
}]

// search
// @ts-ignore
const search = defaultSearch((s: string) => (entry: Announcement) => `${entry.author.name}\n${entry.title}\n${datetimeFormat(entry.sentAt)}\n${entry.author.email}`.includes(s))

// add announcement
const postAnnouncement = () => dialogs.closeAllWithTypeThenOpen({
  dialogType: "editAnnouncement",
  payload: {
    title: "",
    content: "",
  },
  title: t("projects.announcements.postAnnouncement.title"),
  width: "700px",
  actionsRight: [{
    caption: t("projects.announcements.postAnnouncement"),
    icon: "fluent:checkmark-20-regular",
    expanding: true,
    style: {colorPreset: 'accent-strong'},
    action: async (c, data: {title: string, content: string}) => {
      const {title, content} = data;
      const id = await createAnnouncement(projectClass.classId, title, content);
      if (id){
        const newAnnouncement = await getAnnouncement(projectClass.classId, id);
        if (newAnnouncement) announcements.value.push(newAnnouncement);
      }
      dialogs.closeDialog(c.id);
    }
  }],
  close: defaultClose,
});

// datetime format
const datetimeFormat = (datetime: Date) => {
  const AM = t("datetime.am");
  const PM = t("datetime.pm");

  const minutes = datetime.getMinutes();   // 0 - 59
  const hours = (datetime.getHours() % 12) || 12;  // 1 - 12
  const day = datetime.getDate();          // 1 - 31 (day of the month)
  const year = datetime.getFullYear();     // e.g., 2024
  const monthIdx = datetime.getMonth();       // 0 - 11 (January is 0, February is 1, etc.)
  const dayOfWeekIdx = (datetime.getDay() + 7) % 7; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const month = t(`datetime.${monthLookup[monthIdx]}`);
  const dayOfWeek = t(`datetime.${dayOfWeekLookup[dayOfWeekIdx]}`);
  const isAM = datetime.getHours() < 12;
  const format = t("datetime.formatDateTime");
  const fDate = sprintf(t("datetime.formatDate"), {day, month, year})
  const fTime = sprintf(t("datetime.formatTime"), {m: minutes, h: hours, part: isAM ? AM : PM})
  return sprintf(format, {date: fDate, time: fTime, day: dayOfWeek});
}

onMounted(async () => {
  announcements.value = await getAnnouncements(projectClass.classId);
  loading.value = false;
});
</script>

<style scoped lang="scss">
@import "/assets/styles/constants/Sizes.scss";
@import "/assets/styles/constants/Typography.scss";
@import "/assets/styles/constants/Flex.scss";

.body {
  @include flex-col;
  @include flex-cross(stretch);
  
  padding: $space-extra;
  height: var(--height);
  // gap: $space-large;
}

.info {
  @include flex-col;
  @include flex-cross(center);
  @include typemix-label;
  
  background: var(--layer-background);
  padding: $space-extra;
}
</style>