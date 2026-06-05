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

// 270° gauge: gap centered at the bottom.
const R = 84
const C = 2 * Math.PI * R
const ARC = 0.75 * C // 270°
const GAP = C - ARC

const fillPercent = computed(() => Math.min(Math.max(props.percentUsed, 0), 100))
const valueLen = computed(() => (fillPercent.value / 100) * ARC)

const signalVar = computed(
  () => ({ under: 'var(--signal-under)', near: 'var(--signal-near)', over: 'var(--signal-over)' })[props.status]
)

const statusBadgeColor = computed<'success' | 'warning' | 'error'>(() =>
  props.status === 'over' ? 'error' : props.status === 'near' ? 'warning' : 'success'
)

const gaugeLabel = computed(() =>
  t('payload.gaugeLabel', { percent: formatPercent(props.percentUsed), status: t(`payload.status.${props.status}`) })
)
</script>

<template>
  <div class="flex flex-col items-center">
    <div
      class="relative aspect-square w-full max-w-[15rem]"
      role="img"
      :aria-label="gaugeLabel"
      :style="{ color: signalVar }"
    >
      <svg viewBox="0 0 200 200" class="size-full -rotate-[0deg]">
        <g transform="rotate(135 100 100)">
          <!-- track -->
          <circle
            cx="100"
            cy="100"
            :r="R"
            fill="none"
            stroke="var(--ui-bg-accented)"
            stroke-width="14"
            stroke-linecap="round"
            :stroke-dasharray="`${ARC} ${GAP}`"
          />
          <!-- value -->
          <circle
            cx="100"
            cy="100"
            :r="R"
            fill="none"
            stroke="currentColor"
            stroke-width="14"
            stroke-linecap="round"
            :stroke-dasharray="`${valueLen} ${C}`"
            class="gauge-value"
            :style="{ filter: status === 'over' ? 'drop-shadow(0 0 6px currentColor)' : 'none' }"
          />
        </g>
      </svg>

      <!-- center readout -->
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span class="font-mono text-5xl font-semibold leading-none tabular-nums text-highlighted">
          {{ formatPercent(percentUsed) }}
        </span>
        <span class="mt-1 text-xs font-medium uppercase tracking-widest text-muted">
          {{ t('payload.ofGvwrShort') }}
        </span>
        <UBadge :color="statusBadgeColor" variant="subtle" size="sm" class="mt-2 font-medium">
          {{ t(`payload.status.${status}`) }}
        </UBadge>
      </div>
    </div>

    <!-- readouts -->
    <dl class="mt-4 grid w-full grid-cols-2 gap-3">
      <div class="rounded-xl bg-muted/60 px-3 py-2 text-center">
        <dt class="text-[0.7rem] uppercase tracking-wide text-dimmed">{{ t('payload.totalLaden') }}</dt>
        <dd class="font-mono text-lg font-semibold tabular-nums text-highlighted">{{ formatKg(totalLadenKg) }}</dd>
      </div>
      <div class="rounded-xl bg-muted/60 px-3 py-2 text-center">
        <dt class="text-[0.7rem] uppercase tracking-wide text-dimmed">{{ t('builder.gvwr') }}</dt>
        <dd class="font-mono text-lg font-semibold tabular-nums text-highlighted">{{ formatKg(gvwrKg) }}</dd>
      </div>
    </dl>

    <!-- remaining / over-limit -->
    <div class="mt-3 w-full">
      <UAlert
        v-if="status === 'over'"
        color="error"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        :title="t('payload.overTitle')"
        :description="t('payload.overBy', { amount: formatKg(Math.abs(remainingKg)) })"
        :ui="{ title: 'font-display font-semibold' }"
      />
      <p
        v-else
        class="text-center text-sm"
        :class="status === 'near' ? 'text-warning font-medium' : 'text-muted'"
      >
        {{ t('payload.remaining', { amount: formatKg(remainingKg) }) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.gauge-value {
  transition:
    stroke-dasharray 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    stroke 0.3s ease;
}
</style>
