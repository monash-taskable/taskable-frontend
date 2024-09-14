import { isOfType } from "~/scripts/Utils";
import type { ButtonStyle } from "./Button";
import type { Optional } from "./Optional";

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
  "batchMemberAdd"
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
  titleI18n?: boolean,
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
  titleI18n: boolean,
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
  captionI18n: boolean,
  style: ButtonStyle,
  icon: string,
  expanding: boolean,
  action?: (context: Dialog<any>, emitted: any) => void,
}

export const defaultClose: DialogAction = {
  caption: "dialogCommon.close",
  captionI18n: true,
  icon: "fluent:dismiss-20-regular",
  style: {colorPreset: 'strong'},
  expanding: true,
};

export const quickAlert = (message: string, title?: string) => useDialogs().openDialog({
  title: title ?? "Alert",
  dialogType: 'alert',
  payload: message,
  titleI18n: false,
  width: "300px",
  x: 120,
  y: 120,
})

export const quickError = (message: string, title?: string, icon?: string, titleI18n?: boolean, messageI18n?: boolean) => 
  useDialogs().closeAllWithTypeThenOpen({
    title: title ?? "dialogError.somethingWentWrong",
    icon: icon ?? "fluent:error-circle-20-regular",
    dialogType: "error",
    width: "400px",
    titleI18n: titleI18n ?? true,
    payload: { 
      message,
      i18n: messageI18n ?? false,
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