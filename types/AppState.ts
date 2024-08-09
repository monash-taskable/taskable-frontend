import type { Optional } from "./Optional";

export type AppState = {
  showingTitle: boolean
  title: string,
  titleI18n: boolean,
  titleHasIcon: boolean,
  titleIcon: Optional<string>,
};