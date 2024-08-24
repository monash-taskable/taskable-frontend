import type { Optional } from "./Optional"
import type { User } from "./User"

export type AppSession = {
  user: Optional<User>;
}

export const nullSession = (): AppSession => ({
  user: undefined,
});