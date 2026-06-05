<script setup lang="ts">
const { t } = useI18n()
const { formatKg } = useWeightFormat()
const build = useBuildStore()
</script>

<template>
  <div v-if="build.customGear.length > 0" class="space-y-2">
    <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">
      {{ t('custom.yourItems') }}
    </h3>
    <ul class="divide-y divide-default rounded-lg border border-default">
      <li
        v-for="item in build.customGear"
        :key="item.id"
        class="flex items-center justify-between gap-3 px-3 py-2"
      >
        <div class="min-w-0">
          <p class="truncate font-medium">{{ item.name }}</p>
          <p class="flex items-center gap-2 text-sm text-muted">
            <span class="tabular-nums">{{ formatKg(item.weightKg) }}</span>
            <UBadge color="neutral" variant="soft" size="sm">
              {{ t(`gear.category.${item.category}`) }}
            </UBadge>
            <UBadge v-if="item.mount" color="neutral" variant="soft" size="sm">
              {{ t(`gear.mount.${item.mount}`) }}
            </UBadge>
          </p>
        </div>
        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          size="sm"
          :aria-label="t('custom.remove')"
          @click="build.removeCustomGear(item.id)"
        />
      </li>
    </ul>
  </div>
</template>
