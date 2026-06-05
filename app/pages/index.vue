<script setup lang="ts">
const { t } = useI18n()
const { groups, getGroup } = useVehicles()
const { formatKg } = useWeightFormat()
const build = useBuildStore()
const { applySharedFromRoute } = useShareBuild()

useSeoMeta({
  title: () => t('home.metaTitle'),
  description: () => t('home.subtitle')
})

// Step 1: model (one option per make+model group).
const modelItems = computed(() => groups.map((g) => ({ label: g.label, value: g.key })))

const selectedGroupKey = computed(() =>
  build.vehicle ? vehicleGroupKey(build.vehicle) : undefined
)
const selectedGroup = computed(() => getGroup(selectedGroupKey.value))

// Step 2: body — only shown when the chosen model has more than one body.
const bodyItems = computed(() =>
  (selectedGroup.value?.vehicles ?? []).map((v) => ({
    label: v.body ?? v.variant ?? v.id,
    value: v.id
  }))
)
const hasBodyChoice = computed(() => (selectedGroup.value?.vehicles.length ?? 0) > 1)

// Pick a model → default to its first body. Switching model keeps everything
// else (gear, crew, fuel) so users can compare platforms at the same load.
function onSelectModel(key: string) {
  const first = getGroup(key)?.vehicles[0]
  if (first) build.setVehicle(first.id)
}

// On load, a shared build (?b=) takes priority; otherwise the persisted build
// (restored automatically by the store) stands. First-time visitors see the
// empty state until they pick a vehicle.
onMounted(() => {
  applySharedFromRoute()
})
</script>

<template>
  <UContainer class="py-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">{{ t('home.title') }}</h1>
      <p class="mt-1 text-muted">{{ t('home.subtitle') }}</p>
    </div>

    <UCard class="mb-6">
      <BuildToolbar />
    </UCard>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <!-- Left: vehicle + controls + gear -->
      <div class="space-y-6 lg:col-span-3">
        <UCard>
          <template #header>
            <h2 class="font-semibold">{{ t('builder.vehicle') }}</h2>
          </template>
          <div class="grid grid-cols-1 gap-3" :class="{ 'sm:grid-cols-2': hasBodyChoice }">
            <UFormField :label="t('builder.model')">
              <USelectMenu
                :model-value="selectedGroupKey"
                :items="modelItems"
                value-key="value"
                :placeholder="t('builder.chooseVehicle')"
                class="w-full"
                @update:model-value="onSelectModel($event)"
              />
            </UFormField>
            <UFormField v-if="hasBodyChoice" :label="t('builder.body')">
              <USelect
                :model-value="build.vehicleId ?? undefined"
                :items="bodyItems"
                value-key="value"
                class="w-full"
                @update:model-value="build.setVehicle($event)"
              />
            </UFormField>
          </div>
          <dl v-if="build.vehicle" class="mt-4 grid grid-cols-3 gap-3 text-center">
            <div class="rounded-lg bg-elevated p-3">
              <dt class="text-xs text-muted">{{ t('builder.curb') }}</dt>
              <dd class="font-semibold tabular-nums">{{ formatKg(build.curbWeightKg) }}</dd>
            </div>
            <div class="rounded-lg bg-elevated p-3">
              <dt class="text-xs text-muted">{{ t('builder.gvwr') }}</dt>
              <dd class="font-semibold tabular-nums">{{ formatKg(build.gvwrKg) }}</dd>
            </div>
            <div class="rounded-lg bg-elevated p-3">
              <dt class="text-xs text-muted">{{ t('builder.payloadCapacity') }}</dt>
              <dd class="font-semibold tabular-nums">{{ formatKg(build.payloadCapacityKg) }}</dd>
            </div>
          </dl>
          <p v-if="build.vehicle?.confidence === 'estimated'" class="mt-3 text-xs text-muted">
            <UIcon name="i-lucide-info" class="inline size-3" />
            {{ build.vehicle.notes || t('builder.estimatedNote') }}
          </p>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="font-semibold">{{ t('builder.crewAndLiquids') }}</h2>
          </template>
          <LoadControls />
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-2">
              <h2 class="font-semibold">{{ t('builder.gear') }}</h2>
              <CustomGearForm />
            </div>
          </template>
          <div class="space-y-6">
            <CustomGearList />
            <GearCatalog />
          </div>
        </UCard>
      </div>

      <!-- Right: sticky live summary -->
      <div class="lg:col-span-2">
        <div class="lg:sticky lg:top-6 space-y-6">
          <UCard>
            <template #header>
              <h2 class="font-semibold">{{ t('payload.title') }}</h2>
            </template>

            <PayloadBar
              v-if="build.hasVehicle"
              :percent-used="build.percentUsed"
              :status="build.status"
              :total-laden-kg="build.totalLadenKg"
              :gvwr-kg="build.gvwrKg"
              :remaining-kg="build.remainingKg"
            />

            <!-- Empty state -->
            <div v-else class="py-6 text-center">
              <UIcon name="i-lucide-truck" class="mx-auto size-8 text-muted" />
              <p class="mt-2 font-medium">{{ t('payload.emptyTitle') }}</p>
              <p class="text-sm text-muted">{{ t('payload.emptyHint') }}</p>
            </div>
          </UCard>

          <UCard v-if="build.axleEstimate">
            <AxleEstimate />
          </UCard>
        </div>
      </div>
    </div>
  </UContainer>
</template>
