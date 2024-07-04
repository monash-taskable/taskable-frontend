// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    ['@pinia/nuxt', {autoImports: 'defineStore'}],
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
  }
})