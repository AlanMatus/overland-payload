<script setup lang="ts">
const { t } = useI18n()
const colorMode = useColorMode()

// `system` is the default preference; the toggle flips between explicit light/dark.
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (val) => {
    colorMode.preference = val ? 'dark' : 'light'
  }
})
</script>

<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-lucide-moon-star' : 'i-lucide-sun'"
      color="neutral"
      variant="ghost"
      size="sm"
      :aria-label="t(isDark ? 'common.lightMode' : 'common.darkMode')"
      :title="t('common.theme')"
      @click="isDark = !isDark"
    />
    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
