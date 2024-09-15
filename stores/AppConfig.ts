import { defineStore } from 'pinia'
import type { AccentColor, Theme } from '~/types/Theming';

export type AppConfig = {
  theme: Theme,
  accent: AccentColor
};

export const useAppConfigStore = defineStore({
  id: 'appConfigStore',
  state: (): AppConfig => ({
    theme: "light",
    accent: "green"
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
