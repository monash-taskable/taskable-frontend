import { isOfType } from "~/scripts/Utils";
import type { ButtonStyle } from "./ButtonStyle";
import type { Optional } from "./Optional";

const dialogTypes = ["alert"] as const;
export type DialogType = typeof dialogTypes[number];
export const isOfDialog = isOfType(dialogTypes);

export type DialogController = {
  dialogs: {[key: string]: Dialog<any>},
};

export type DialogInit<T> = {
  title: string,
  titleI18n: boolean,
  dialogType: DialogType
  width: string,
  height: string,
  x: number,
  y: number,
  actions: DialogAction[]
  close?: DialogAction
  payload: T
}

export type Dialog<T> = {
  id: string,
  title: string,
  titleI18n: boolean,
  dialogType: DialogType
  width: string,
  height: string,
  x: number,
  y: number,
  actions: DialogAction[],
  close: Optional<DialogAction>
  payload: T,
}

export type DialogAction = {
  caption: string
  captionI18n: boolean,
  style: ButtonStyle,
  icon: string,
  action?: () => void,
}