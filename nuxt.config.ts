// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  // Auto-follow the OS theme; `.dark` class drives Nuxt UI tokens.
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: ''
  },

  // Provisioned by @nuxt/fonts and wired to the @theme font families in main.css.
  fonts: {
    families: [
      { name: 'Fraunces', provider: 'google', weights: [400, 500, 600, 700], styles: ['normal'] },
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500, 600, 700] }
    ]
  },

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
