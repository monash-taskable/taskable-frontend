import { isOfType } from "~/scripts/Utils";
import type { Optional } from "./Optional";
import type { User } from "./User";
import type { AppSession } from "./Session";

export type AppState = {
  showingTitle: boolean
  title: string,
  titleI18n: boolean,
  titleHasIcon: boolean,
  titleIcon: Optional<string>,
  session: AppSession
};

const oAuthProvider = ["Google"] as const;
export type OAuthProvider = typeof oAuthProvider[number];
export const isOAuthProvider = isOfType(oAuthProvider);