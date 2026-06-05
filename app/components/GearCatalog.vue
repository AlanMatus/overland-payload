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
  <div class="space-y-6">
    <section v-for="group in groups" :key="group.category">
      <h3 class="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
        {{ t(`gear.category.${group.category}`) }}
      </h3>
      <ul class="divide-y divide-default rounded-lg border border-default">
        <li
          v-for="item in group.items"
          :key="item.id"
          class="flex items-center justify-between gap-3 px-3 py-2"
        >
          <div class="min-w-0">
            <p class="truncate font-medium">{{ item.name }}</p>
            <p class="flex items-center gap-2 text-sm text-muted">
              <span class="tabular-nums">{{ formatKg(item.weightKg) }}</span>
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
            :aria-pressed="build.hasGear(item.id)"
            @click="build.toggleGear(item.id)"
          >
            {{ build.hasGear(item.id) ? t('gear.added') : t('gear.add') }}
          </UButton>
        </li>
      </ul>
    </section>
  </div>
</template>
