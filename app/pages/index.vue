<script setup lang="ts">
const { t } = useI18n()
const { vehicles } = useVehicles()
const { formatKg } = useWeightFormat()
const build = useBuildStore()

useSeoMeta({
  title: () => t('home.title'),
  description: () => t('home.subtitle')
})

// Vehicle options for the picker.
const vehicleItems = computed(() =>
  vehicles.map((v) => ({
    label: [v.make, v.model, v.variant].filter(Boolean).join(' '),
    value: v.id
  }))
)

// Phase 2: default to the first vehicle so the calculator is usable out of the box.
// Phase 3 layers naming / persistence / sharing on top.
onMounted(() => {
  if (!build.vehicleId && vehicles[0]) build.setVehicle(vehicles[0].id)
})
</script>

<template>
  <UContainer class="py-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">{{ t('home.title') }}</h1>
      <p class="mt-1 text-muted">{{ t('home.subtitle') }}</p>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <!-- Left: vehicle + controls + gear -->
      <div class="space-y-6 lg:col-span-3">
        <UCard>
          <template #header>
            <h2 class="font-semibold">{{ t('builder.vehicle') }}</h2>
          </template>
          <USelectMenu
            :model-value="build.vehicleId ?? undefined"
            :items="vehicleItems"
            value-key="value"
            :placeholder="t('builder.chooseVehicle')"
            class="w-full"
            @update:model-value="build.setVehicle($event)"
          />
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
        </UCard>

        <UCard>
          <template #header>
            <h2 class="font-semibold">{{ t('builder.crewAndLiquids') }}</h2>
          </template>
          <LoadControls />
        </UCard>

        <UCard>
          <template #header>
            <h2 class="font-semibold">{{ t('builder.gear') }}</h2>
          </template>
          <GearCatalog />
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
              :percent-used="build.percentUsed"
              :status="build.status"
              :total-laden-kg="build.totalLadenKg"
              :gvwr-kg="build.gvwrKg"
              :remaining-kg="build.remainingKg"
            />
          </UCard>

          <UCard v-if="build.axleEstimate">
            <AxleEstimate />
          </UCard>
        </div>
      </div>
    </div>
  </UContainer>
</template>
