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