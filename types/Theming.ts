import { isOfType } from "~/scripts/Utils";

const themes = ["light", "dark", "contrast-light"] as const;
export type Theme = typeof themes[number];
export const isTheme = isOfType(themes);

const accentColor = ["orange", "green", "blue", "purple", "magenta"] as const;
export type AccentColor = typeof accentColor[number];
export const isAccentColor = isOfType(accentColor);
