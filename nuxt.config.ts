// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  // Single source of truth for the app name (used in <title>, header, SEO).
  runtimeConfig: {
    public: {
      appName: 'Overland Rig Builder',
      // Slovak translation is ready — show the locale switcher.
      localeSwitcherEnabled: true
    }
  },

  i18n: {
    // English now; Slovak stubbed for a future drop-in.
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'sk', language: 'sk-SK', name: 'Slovenčina', file: 'sk.json' }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix' // single-locale UX for now; switcher stays hidden until sk is ready
  },

  eslint: {
    config: {
      stylistic: false // formatting is owned by Prettier
    }
  },

  typescript: {
    strict: true,
    typeCheck: false // run explicitly via `pnpm typecheck` to keep dev fast
  }
})
