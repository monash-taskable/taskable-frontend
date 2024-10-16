export const dayOfWeekLookup = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]

export const monthLookup = [
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


export const getDatePercentage = (start: Date, end: Date, now: Date): number => {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const nowTime = now.getTime();

  if (nowTime <= startTime) return 0;
  if (nowTime >= endTime) return 1;
  return (nowTime - startTime) / (endTime - startTime);
};


export const stringToDate = (dateString: string) => {
  // Split the date and time components
  const [datePart, timePart] = dateString.split('T');

  // Split the date into year, month, and day
  const [year, month, day] = datePart.split('-').map(Number);

  // Split the time into hours and minutes
  const [hours, minutes] = timePart.split(':').map(Number);

  // Create a Date object in UTC
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  return date;
}

export const dateToString = (date: Date) => {
  // Get the parts of the date
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  // Format the date and time as 'YYYY-MM-DD HH:MM'
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export const getCurrentGMTDateTime = () => dateToString(new Date());

export const getNextWeek = (): Date => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

export const inputToDate = (dateString: string) => new Date(dateString);
export const dateToInput = (date: Date) => date.toISOString().split('T')[0];

export const getDaysInMonth = (year: number, month: number): number => new Date(year, month, 0).getDate();

export const getMonthSegment = (year: number, month: number, start: Date, end: Date): [number, number] => {
  // First, create the first and last day of the target month
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0); // Last day of the month

  // Find the effective start and end dates within the month segment
  const effectiveStart = start > endOfMonth ? null : (start < startOfMonth ? startOfMonth : start);
  const effectiveEnd = end < startOfMonth ? null : (end > endOfMonth ? endOfMonth : end);

  if (effectiveStart === null || effectiveEnd === null) {
      return [0, 0]; // If no part of the range overlaps with the month
  }

  // Calculate the start day (0-indexed within the month) and the length of the segment
  const startDayInMonth = effectiveStart.getDate() - 1;
  const segmentLength = effectiveEnd.getDate() - effectiveStart.getDate() + 1;

  return [startDayInMonth, segmentLength];
}