import { isOfType } from "~/scripts/Utils";
import type { ButtonStyle } from "./Button";
import type { Optional } from "./Optional";
import { useNuxt } from "nuxt/kit";

const dialogTypes = [
  "alert",
  "createClass",
  "error",
  "signIn",
  "signInLoading",
  "signInError",
  "createProjectTemplate",
  "editClass",
  "updateMemberRole",
  "searchUser",
  "batchMemberAdd",
  "sessionError",
  "projectError",
  "editTemplate",
  "optionsAlert",
  "listAnnouncements",
  "editAnnouncement",
] as const;
export type DialogType = typeof dialogTypes[number];
export const isOfDialog = isOfType(dialogTypes);

export type DialogController = {
  dialogs: {[key: string]: Dialog<any>},
};

export type DialogStyle = {
  titleBackground?: string
  titleColor?: string
}

export type DialogInit<T> = {
  title: string,
  icon?: string,
  style?: DialogStyle,
  dialogType: DialogType
  width: string,
  height?: string,
  x?: number,
  y?: number,
  actionsRight?: DialogAction[]
  actionsLeft?: DialogAction[]
  close?: DialogAction
  payload: T,
}

export type Dialog<T> = {
  id: string,
  icon?: string,
  title: string,
  style?: DialogStyle,
  dialogType: DialogType
  width: string,
  height: string,
  x?: number,
  y?: number,
  actionsRight: DialogAction[],
  actionsLeft: DialogAction[],
  close: Optional<DialogAction>
  payload: T,
}

export type DialogAction = {
  caption: string
  style: ButtonStyle,
  icon: string,
  expanding: boolean,
  expanded?: boolean,
  action?: (context: Dialog<any>, emitted: any) => void,
}

export const defaultClose: DialogAction = ({
  caption: "",
  icon: "fluent:dismiss-20-regular",
  style: {colorPreset: 'strong'},
  expanding: true,
  expanded: false,
});

export const quickAlert = (message: string, title?: string) => useDialogs().openDialog({
  title: title ?? "Alert",
  dialogType: 'alert',
  payload: message,
  width: "300px",
  close: defaultClose
})

export const quickError = (message: string, title: string, icon?: string) => 
  useDialogs().closeAllWithTypeThenOpen({
    title: title,
    icon: icon ?? "fluent:error-circle-20-regular",
    dialogType: "error",
    width: "400px",
    payload: { 
      message,
    },
    close: {
      ...defaultClose,
      style: {colorPreset: "dangerous-strong"}
    },
    style: {
      titleBackground: "var(--dangerous-weak)",
      titleColor: "var(--dangerous-strong)",
    },
  })