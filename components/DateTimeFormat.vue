<template>
  <span>
    {{ formatted }}
  </span>
</template>

<script lang="ts" setup>
import { sprintf } from 'sprintf-js';
import type { PropType } from 'vue';

const {t} = useI18n();

const props = defineProps({
  datetime: {type: Date, required: true},
  format: {type: String as PropType<
    | "date-only"
    | "date-day"
    | "time-day"
    | "date-time-day"
    | "date-time"
    | "time-only"
    | "day-only"
  >, default: "date-time"},
});

const dayOfWeekLookup = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]

const monthLookup = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
]

const AM = t("datetime.am");
const PM = t("datetime.pm");

const seconds = props.datetime.getSeconds();   // 0 - 59
const minutes = props.datetime.getMinutes();   // 0 - 59
const hours = (props.datetime.getHours() % 12) || 12;  // 1 - 12
const day = props.datetime.getDate();          // 1 - 31 (day of the month)
const year = props.datetime.getFullYear();     // e.g., 2024
const monthIdx = props.datetime.getMonth();       // 0 - 11 (January is 0, February is 1, etc.)
const dayOfWeekIdx = (props.datetime.getDay() + 7) % 7; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
const month = t(`datetime.${monthLookup[monthIdx]}`);
const dayOfWeek = t(`datetime.${dayOfWeekLookup[dayOfWeekIdx]}`);
const isAM = props.datetime.getHours() < 12;

let format = "";
if (props.format === 'date-only') format = t("datetime.formatDateOnly");
if (props.format === 'time-only') format = t("datetime.formatTimeOnly");
if (props.format === 'day-only') format = t("datetime.formatDayOnly");
if (props.format === "date-time") format = t("datetime.formatDateTime");
if (props.format === 'date-day') format = t("datetime.formatDateDay");
if (props.format === 'time-day') format = t("datetime.formatTimeDay");
if (props.format === 'date-time-day') format = t("datetime.formatDateTimeDay");

const fDate = sprintf(t("datetime.formatDate"), {day, month, year})
const fTime = sprintf(t("datetime.formatTime"), {m: minutes, h: hours, part: isAM ? AM : PM})

const formatted = sprintf(format, {date: fDate, time: fTime, day: dayOfWeek});

</script>

<style>

</style>