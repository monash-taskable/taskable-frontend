import { defineStore } from 'pinia'
import { FetchRequest } from '~/scripts/FetchTools';
import { isOfType } from '~/scripts/Utils';
import { UpdateProfileRequest } from '~/types/proto/Profile';
import type { AccentColor, Theme } from '~/types/Theming';

// export const languages = ["en-au", "zh-tw"] as const;
// export type Language = typeof languages[number];
// export const isLanguage = isOfType(languages);
export const languageNames = {
  "en-au": "English (Australia)",
  "zh-tw": "中文（台灣）",
  "si-lk": "සිංහල (ශ්‍රී ලංකාව)"
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
      FetchRequest
      .protectedAPI(`/users/update`)
      .post()
      .payload(UpdateProfileRequest.encode, {theme})
      .commit();
    },
    setAccent(accent: AccentColor){
      this.accent = accent;
      FetchRequest
      .protectedAPI(`/users/update`)
      .post()
      .payload(UpdateProfileRequest.encode, {color: accent})
      .commit();
    },
  }
})
