// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxt/icon",
    ['@pinia/nuxt', {
      autoImports: 'defineStore'
    }],
    ["@nuxtjs/i18n", {
      locales: [
        {
          code: 'en-au',
          file: 'en-au.json'
        }
      ],
      lazy: true,
      langDir: 'lang',
      defaultLocale: 'en-au'
    }],
  ],
  
  imports: {
    dirs: ['stores']
  },

  css: ['assets/styles/Main.scss'],
  compatibilityDate: '2024-07-08',
})
