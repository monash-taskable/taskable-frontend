import type { Optional } from "~/types/Optional";

/**
 * Tests if a value is of type T, where type T is some literal type
 * 
 * Example:
 * 
 * ```typescript
 * const food = ["Apple", "Banana", "Carrot"] as const;
 * type Food = typeof food[number];
 * 
 * const isFood = isOfType(food);
 * 
 * console.log(isFood("Apple")); // true
 * console.log(isFood("Google")); // false
 * ```
 * 
 * @param typeDef the list consisting all literal value for T
 * @returns A function that checks whether a value belongs to T
 */
export const isOfType = <T>(typeDef: readonly T[]) => (val: any): val is T => typeDef.includes(val);

export const getCurrentGMTDateTime = () => {
  const now = new Date();

  // Get the parts of the date
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');

  // Format the date and time as 'YYYY-MM-DD HH:MM'
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

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

export const findInList = <T, V>(list: T[], predicate: (t: T) => boolean, extractor: (t: T) => V): Optional<V> => {
  for (const item of list) {
    if (predicate(item)) return extractor(item);
  }
  return undefined;
}

export const listRemove = <T>(list: T[], item: T) => {
  const index = list.indexOf(item);
  if (index > -1) { // only splice array when item is found
    list.splice(index, 1); // 2nd parameter means remove one item only
  }
}