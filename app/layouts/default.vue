<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-screen flex-col text-default">
    <header
      class="sticky top-0 z-40 border-b border-default/70 bg-default/70 backdrop-blur-xl supports-[backdrop-filter]:bg-default/55"
    >
      <UContainer class="flex h-16 items-center justify-between gap-4">
        <NuxtLink to="/" class="group flex items-center gap-2.5">
          <span
            class="grid size-9 place-items-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/25 transition group-hover:bg-primary/20"
          >
            <UIcon name="i-lucide-compass" class="size-5" />
          </span>
          <span class="flex flex-col leading-none">
            <span class="font-display text-lg font-semibold tracking-tight">{{ t('app.name') }}</span>
            <span class="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-dimmed">
              {{ t('app.kicker') }}
            </span>
          </span>
        </NuxtLink>

        <div class="flex items-center gap-1">
          <LocaleSwitcher />
          <ColorModeToggle />
        </div>
      </UContainer>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="mt-8 border-t border-default/70">
      <UContainer class="flex flex-col items-start justify-between gap-2 py-6 text-sm text-muted sm:flex-row sm:items-center">
        <span class="font-display">{{ t('app.tagline') }}</span>
        <span class="text-xs text-dimmed">{{ t('app.disclaimer') }}</span>
      </UContainer>
    </footer>
  </div>
</template>
