import type { Optional } from "./Optional"

export type Profile = {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
}

export type AppSession = {
  profile: Optional<Profile>;
}

export const nullSession = (): AppSession => ({
  profile: undefined,
});