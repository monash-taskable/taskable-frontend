import type { Optional } from "./Optional"
import type { User } from "./User"

export type AppSession = {
  user: Optional<User>;
  csrfToken: Optional<string>;
}

export const nullSession = (): AppSession => ({
  user: undefined,
  csrfToken: undefined,
});