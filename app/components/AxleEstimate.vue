<script setup lang="ts">
const { t } = useI18n()
const { formatKg } = useWeightFormat()
const build = useBuildStore()

const estimate = computed(() => build.axleEstimate)
</script>

<template>
  <div v-if="estimate" class="space-y-3">
    <div class="flex items-center gap-2">
      <h2 class="font-display text-base font-semibold">{{ t('axle.title') }}</h2>
      <UBadge color="neutral" variant="soft" size="sm">{{ t('axle.estimate') }}</UBadge>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div
        class="rounded-xl border p-3"
        :class="estimate.frontOver ? 'border-error/60 bg-error/5' : 'border-default bg-muted/40'"
      >
        <p class="text-xs uppercase tracking-wide text-dimmed">{{ t('axle.front') }}</p>
        <p class="font-mono text-lg font-semibold tabular-nums text-highlighted">
          {{ formatKg(estimate.frontAxleKg) }}
        </p>
        <p v-if="estimate.frontMaxKg" class="font-mono text-xs text-muted">
          {{ t('axle.max', { amount: formatKg(estimate.frontMaxKg) }) }}
        </p>
        <p v-if="estimate.frontOver" class="mt-0.5 text-xs font-semibold text-error">
          {{ t('axle.over') }}
        </p>
      </div>

      <div
        class="rounded-xl border p-3"
        :class="estimate.rearOver ? 'border-error/60 bg-error/5' : 'border-default bg-muted/40'"
      >
        <p class="text-xs uppercase tracking-wide text-dimmed">{{ t('axle.rear') }}</p>
        <p class="font-mono text-lg font-semibold tabular-nums text-highlighted">
          {{ formatKg(estimate.rearAxleKg) }}
        </p>
        <p v-if="estimate.rearMaxKg" class="font-mono text-xs text-muted">
          {{ t('axle.max', { amount: formatKg(estimate.rearMaxKg) }) }}
        </p>
        <p v-if="estimate.rearOver" class="mt-0.5 text-xs font-semibold text-error">
          {{ t('axle.over') }}
        </p>
      </div>
    </div>
    <p class="text-xs text-dimmed">{{ t('axle.disclaimer') }}</p>
  </div>
</template>
