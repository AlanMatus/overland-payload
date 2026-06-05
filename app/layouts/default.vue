<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default text-default">
    <header class="border-b border-default">
      <UContainer class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-lg">
          <UIcon name="i-lucide-truck" class="text-primary size-6" />
          <span>{{ t('app.name') }}</span>
        </NuxtLink>
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
