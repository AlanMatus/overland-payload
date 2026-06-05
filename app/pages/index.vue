<script setup lang="ts">
const { t } = useI18n()

// Proves i18n renders: the page <title> and heading both come from en.json.
useSeoMeta({
  title: () => t('home.title'),
  description: () => t('home.subtitle')
})
</script>

<template>
  <UContainer class="py-16">
    <div class="max-w-2xl">
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">
        {{ t('home.title') }}
      </h1>
      <p class="mt-4 text-lg text-muted">
        {{ t('home.subtitle') }}
      </p>
    </div>
  </UContainer>
</template>
