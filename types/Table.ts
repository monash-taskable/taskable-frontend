import type { ButtonProps, ButtonStyle } from "./Button";

export type SelectedAction = {
  button: ButtonProps,
  action: (selected: any[]) => void,
}

export type SearchProp = {
  by: <T>(str: string) => (entry: T) => boolean;
  button: ButtonProps
}

export const defaultSearch = (by: <T>(str: string) => (entry: T) => boolean): SearchProp => ({
  by,
  button: {
    style: {colorPreset: "strong"},
    icon: "fluent:search-20-regular",
    label: "",
    expanding: true,
    expanded: false,
  }
})

export type TableColumn = {
  key: string,
  order: number,
  label: string,
  flex?: number
};

export type TableCell = {
  key: string,
  order: number,
  value: string,
  flex: number,
}

export type TableRow<T> = {
  cells: TableCell[]
  id: number
  object: T
}

export type TableSortDirection = "Ascending" | "Descending" | "Default";
export const cycleSort = (curr: TableSortDirection): TableSortDirection => {
  if (curr === "Ascending") return "Descending";
  if (curr === "Descending") return "Default";
  else return "Ascending";
}

export type TableSortChangeEvent = {
  direction: TableSortDirection,
  field: string
}

export type TableToggleType = "Checked" | "Partial" | "Empty";
export const cycleToggle = (curr: TableToggleType): TableToggleType => {
  if (curr === "Checked") return "Empty";
  if (curr === "Partial") return "Empty";
  else return "Checked";
}

export type TableToggleChangeEvent = {
  toggle: TableToggleType
}

export type OnSelectEvent<T> = {
  selected: T[]
}