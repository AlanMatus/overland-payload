<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default text-default">
    <header class="border-b border-default">
      <UContainer class="flex h-16 items-center justify-between gap-4">
        <NuxtLink to="/" class="flex items-center gap-2 text-lg font-semibold">
          <UIcon name="i-lucide-truck" class="size-6 text-primary" />
          <span>{{ t('app.name') }}</span>
        </NuxtLink>
        <LocaleSwitcher />
      </UContainer>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-default py-6 text-sm text-muted">
      <UContainer>{{ t('app.tagline') }}</UContainer>
    </footer>
  </div>
</template>
