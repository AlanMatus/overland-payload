<script setup lang="ts">
import type { GearCategory } from '#shared/types'

const { t } = useI18n()
const { byCategory } = useGearCatalog()
const { formatKg } = useWeightFormat()
const build = useBuildStore()

// Stable category order for display.
const categoryOrder: GearCategory[] = [
  'protection',
  'recovery',
  'storage',
  'camping',
  'tyres',
  'water',
  'fuel',
  'other'
]

const groups = computed(() =>
  categoryOrder
    .map((category) => ({ category, items: byCategory.value.get(category) ?? [] }))
    .filter((group) => group.items.length > 0)
)
</script>

<template>
  <div class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
    <section v-for="group in groups" :key="group.category">
      <h3 class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-dimmed">
        <span class="h-px flex-none w-4 bg-primary/40" />
        {{ t(`gear.category.${group.category}`) }}
      </h3>
      <ul class="space-y-1.5">
        <li
          v-for="item in group.items"
          :key="item.id"
          class="flex items-center justify-between gap-3 rounded-xl border px-3 py-2 transition"
          :class="
            build.hasGear(item.id)
              ? 'border-primary/40 bg-primary/5'
              : 'border-default bg-default/40 hover:border-default hover:bg-elevated'
          "
        >
          <div class="min-w-0">
            <p class="truncate text-sm font-medium">{{ item.name }}</p>
            <p class="mt-0.5 flex items-center gap-2 text-xs text-muted">
              <span class="font-mono tabular-nums">{{ formatKg(item.weightKg) }}</span>
              <UBadge v-if="item.mount" color="neutral" variant="soft" size="sm">
                {{ t(`gear.mount.${item.mount}`) }}
              </UBadge>
              <UBadge
                v-if="item.confidence === 'estimated'"
                color="warning"
                variant="soft"
                size="sm"
                :title="item.notes"
              >
                {{ t('gear.estimated') }}
              </UBadge>
            </p>
          </div>
          <UButton
            :color="build.hasGear(item.id) ? 'primary' : 'neutral'"
            :variant="build.hasGear(item.id) ? 'solid' : 'outline'"
            :icon="build.hasGear(item.id) ? 'i-lucide-check' : 'i-lucide-plus'"
            size="sm"
            square
            :aria-pressed="build.hasGear(item.id)"
            :aria-label="build.hasGear(item.id) ? t('gear.added') : t('gear.add')"
            @click="build.toggleGear(item.id)"
          />
        </li>
      </ul>
    </section>
  </div>
</template>
