<script setup lang="ts">
// Locale switcher — built and wired now, but hidden until Slovak is ready.
// Flip `public.localeSwitcherEnabled` in nuxt.config.ts to reveal it.
const { t, locale, locales, setLocale } = useI18n()
const config = useRuntimeConfig()

type LocaleCode = typeof locale.value

const enabled = computed(() => config.public.localeSwitcherEnabled === true)

const items = computed(() =>
  (locales.value as { code: string; name?: string }[]).map((l) => ({
    label: l.name ?? l.code,
    value: l.code
  }))
)
</script>

<template>
  <USelect
    v-if="enabled"
    :model-value="locale"
    :items="items"
    value-key="value"
    size="sm"
    :aria-label="t('common.language')"
    icon="i-lucide-languages"
    @update:model-value="setLocale($event as LocaleCode)"
  />
</template>
