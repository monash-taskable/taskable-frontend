import { defineStore } from 'pinia'
import { isOfType } from '~/scripts/Utils';
import type { AccentColor, Theme } from '~/types/Theming';

// export const languages = ["en-au", "zh-tw"] as const;
// export type Language = typeof languages[number];
// export const isLanguage = isOfType(languages);
export const languageNames = {
  "en-au": "English (Australia)",
  "zh-tw": "中文（台灣）"
};

export type AppConfig = {
  theme: Theme,
  accent: AccentColor,
};

export const useAppConfigStore = defineStore({
  id: 'appConfigStore',
  state: (): AppConfig => ({
    theme: "light",
    accent: "green",
  }),
  actions: {
    setTheme(theme: Theme){
      this.theme = theme;
    },
    setAccent(accent: AccentColor){
      this.accent = accent;
    },
  }
})
