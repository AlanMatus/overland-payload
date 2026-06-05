<script setup lang="ts">
const { t } = useI18n()
const { formatKg } = useWeightFormat()
const build = useBuildStore()

const estimate = computed(() => build.axleEstimate)
</script>

<template>
  <div v-if="estimate" class="space-y-3">
    <div class="flex items-center gap-2">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted">
        {{ t('axle.title') }}
      </h3>
      <UBadge color="neutral" variant="soft" size="sm">{{ t('axle.estimate') }}</UBadge>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div
        class="rounded-lg border p-3"
        :class="estimate.frontOver ? 'border-error' : 'border-default'"
      >
        <p class="text-sm text-muted">{{ t('axle.front') }}</p>
        <p class="text-lg font-semibold tabular-nums">{{ formatKg(estimate.frontAxleKg) }}</p>
        <p v-if="estimate.frontMaxKg" class="text-xs text-muted">
          {{ t('axle.max', { amount: formatKg(estimate.frontMaxKg) }) }}
        </p>
        <p v-if="estimate.frontOver" class="text-xs font-medium text-error">
          {{ t('axle.over') }}
        </p>
      </div>

      <div
        class="rounded-lg border p-3"
        :class="estimate.rearOver ? 'border-error' : 'border-default'"
      >
        <p class="text-sm text-muted">{{ t('axle.rear') }}</p>
        <p class="text-lg font-semibold tabular-nums">{{ formatKg(estimate.rearAxleKg) }}</p>
        <p v-if="estimate.rearMaxKg" class="text-xs text-muted">
          {{ t('axle.max', { amount: formatKg(estimate.rearMaxKg) }) }}
        </p>
        <p v-if="estimate.rearOver" class="text-xs font-medium text-error">
          {{ t('axle.over') }}
        </p>
      </div>
    </div>
    <p class="text-xs text-muted">{{ t('axle.disclaimer') }}</p>
  </div>
</template>
