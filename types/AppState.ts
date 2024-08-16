import { isOfType } from "~/scripts/Utils";
import type { Optional } from "./Optional";

export type AppState = {
  showingTitle: boolean
  title: string,
  titleI18n: boolean,
  titleHasIcon: boolean,
  titleIcon: Optional<string>,
  token: Optional<string>,
};

const oAuthProvider = ["Google"] as const;
export type OAuthProvider = typeof oAuthProvider[number];
export const isOAuthProvider = isOfType(oAuthProvider);