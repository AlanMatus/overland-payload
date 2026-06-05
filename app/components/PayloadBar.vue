<script setup lang="ts">
import type { PayloadStatus } from '#shared/utils/payload'

const props = defineProps<{
  percentUsed: number
  status: PayloadStatus
  totalLadenKg: number
  gvwrKg: number
  remainingKg: number
}>()

const { t } = useI18n()
const { formatKg, formatPercent } = useWeightFormat()

// Bar fill is capped at 100% visually; the label still shows the true % when over.
const fillPercent = computed(() => Math.min(props.percentUsed, 100))

const statusColor = computed(() => {
  const map: Record<PayloadStatus, string> = {
    under: 'bg-success',
    near: 'bg-warning',
    over: 'bg-error'
  }
  return map[props.status]
})

const statusLabel = computed(() => t(`payload.status.${props.status}`))

const statusBadgeColor = computed<'success' | 'warning' | 'error'>(() => {
  if (props.status === 'over') return 'error'
  if (props.status === 'near') return 'warning'
  return 'success'
})
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-end justify-between gap-4">
      <div>
        <p class="text-sm text-muted">{{ t('payload.totalLaden') }}</p>
        <p class="text-2xl font-bold tabular-nums">{{ formatKg(totalLadenKg) }}</p>
        <p class="text-sm text-muted">{{ t('payload.ofGvwr', { gvwr: formatKg(gvwrKg) }) }}</p>
      </div>
      <div class="text-right">
        <UBadge :color="statusBadgeColor" variant="subtle" size="lg">{{ statusLabel }}</UBadge>
        <p class="mt-1 text-2xl font-bold tabular-nums">{{ formatPercent(percentUsed) }}</p>
      </div>
    </div>

    <div
      class="relative h-5 w-full overflow-hidden rounded-full bg-elevated"
      role="progressbar"
      :aria-valuenow="Math.round(percentUsed)"
      :aria-valuemin="0"
      :aria-valuemax="100"
      :aria-label="t('payload.barLabel')"
    >
      <div
        class="h-full rounded-full transition-all duration-300"
        :class="statusColor"
        :style="{ width: `${fillPercent}%` }"
      />
    </div>

    <!-- Remaining payload / explicit over-limit warning -->
    <UAlert
      v-if="status === 'over'"
      color="error"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      :title="t('payload.overTitle')"
      :description="t('payload.overBy', { amount: formatKg(Math.abs(remainingKg)) })"
    />
    <p v-else class="text-sm" :class="status === 'near' ? 'text-warning' : 'text-muted'">
      {{ t('payload.remaining', { amount: formatKg(remainingKg) }) }}
    </p>
  </div>
</template>
