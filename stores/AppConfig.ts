import { defineStore } from 'pinia'
import type { AppConfig } from '~/types/AppConfig'
import type { AccentColor, Theme } from '~/types/Theming';

export const useAppConfigStore = defineStore({
  id: 'appConfigStore',
  state: (): AppConfig => ({
    theme: "dark",
    accent: "blue",
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
