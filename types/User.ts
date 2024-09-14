import type { Optional } from "./Optional";
import type { AccentColor, Theme } from "./Theming";

export type SimpleUser = {
  id: number,
  info: BasicUserInfo,
}

export type BasicUserInfo = {
  firstName: string,
  lastName: string,
  email: string,
}

export type UserSettings = {
  color: AccentColor,
  theme: Theme,
  language: string,
}

