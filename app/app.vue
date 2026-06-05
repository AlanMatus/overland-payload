<script setup lang="ts">
// UApp provides Nuxt UI's global context (toasts, overlays, tooltips).
const { t, locale } = useI18n()

// App-wide head defaults; pages override title/description via useSeoMeta.
useHead({
  htmlAttrs: { lang: () => locale.value },
  titleTemplate: (title) => (title ? `${title} · ${t('app.name')}` : t('app.name'))
})

useSeoMeta({
  ogTitle: () => t('home.title'),
  ogDescription: () => t('home.subtitle'),
  ogType: 'website',
  twitterCard: 'summary'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
