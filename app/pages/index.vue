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

const modelItems = computed(() => groups.map((g) => ({ label: g.label, value: g.key })))
const selectedGroupKey = computed(() => (build.vehicle ? vehicleGroupKey(build.vehicle) : undefined))
const selectedGroup = computed(() => getGroup(selectedGroupKey.value))
const bodyItems = computed(() =>
  (selectedGroup.value?.vehicles ?? []).map((v) => ({ label: v.body ?? v.variant ?? v.id, value: v.id }))
)
const hasBodyChoice = computed(() => (selectedGroup.value?.vehicles.length ?? 0) > 1)

function onSelectModel(key: string) {
  const first = getGroup(key)?.vehicles[0]
  if (first) build.setVehicle(first.id)
}

onMounted(() => {
  applySharedFromRoute()
})

const tile = 'rounded-2xl border border-default bg-elevated p-5 transition duration-200'
const tileHover = 'hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-15px] hover:shadow-primary/30'
</script>

<template>
  <UContainer class="py-8">
    <!-- Hero heading -->
    <div class="mb-6 max-w-2xl">
      <p class="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary ring-1 ring-primary/20">
        <UIcon name="i-lucide-mountain" class="size-3.5" />
        {{ t('app.kicker') }}
      </p>
      <h1 class="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{{ t('home.title') }}</h1>
      <p class="mt-2 text-muted">{{ t('home.subtitle') }}</p>
    </div>

    <!-- Toolbar -->
    <div :class="[tile, 'mb-4']">
      <BuildToolbar />
    </div>

    <!-- Bento grid -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-[auto_auto_auto]">
      <!-- Vehicle picker (desktop: top-right, cols 3-6) -->
      <section :class="[tile, tileHover, 'lg:col-start-3 lg:col-span-4 lg:row-start-1']">
        <h2 class="mb-3 font-display text-base font-semibold">{{ t('builder.vehicle') }}</h2>
        <div class="grid grid-cols-1 gap-3" :class="{ 'sm:grid-cols-2': hasBodyChoice }">
          <UFormField :label="t('builder.model')">
            <USelectMenu
              :model-value="selectedGroupKey"
              :items="modelItems"
              value-key="value"
              :placeholder="t('builder.chooseVehicle')"
              icon="i-lucide-car"
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

        <dl v-if="build.vehicle" class="mt-4 grid grid-cols-3 gap-3">
          <div class="rounded-xl bg-muted/60 p-3 text-center">
            <dt class="text-[0.7rem] uppercase tracking-wide text-dimmed">{{ t('builder.curb') }}</dt>
            <dd class="font-mono font-semibold tabular-nums text-highlighted">{{ formatKg(build.curbWeightKg) }}</dd>
          </div>
          <div class="rounded-xl bg-muted/60 p-3 text-center">
            <dt class="text-[0.7rem] uppercase tracking-wide text-dimmed">{{ t('builder.gvwr') }}</dt>
            <dd class="font-mono font-semibold tabular-nums text-highlighted">{{ formatKg(build.gvwrKg) }}</dd>
          </div>
          <div class="rounded-xl bg-primary/10 p-3 text-center ring-1 ring-primary/20">
            <dt class="text-[0.7rem] uppercase tracking-wide text-primary/80">{{ t('builder.payloadCapacity') }}</dt>
            <dd class="font-mono font-semibold tabular-nums text-primary">{{ formatKg(build.payloadCapacityKg) }}</dd>
          </div>
        </dl>
        <p v-if="build.vehicle?.confidence === 'estimated'" class="mt-3 flex items-start gap-1.5 text-xs text-dimmed">
          <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />
          <span>{{ build.vehicle.notes || t('builder.estimatedNote') }}</span>
        </p>
      </section>

      <!-- Payload gauge (desktop: tall hero, cols 1-2 rows 1-2) -->
      <section
        :class="[tile, 'lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2 flex flex-col']"
        :style="build.isOverloaded ? 'box-shadow: 0 0 0 1.5px var(--signal-over), 0 12px 40px -16px var(--signal-over)' : ''"
      >
        <h2 class="mb-3 font-display text-base font-semibold">{{ t('payload.title') }}</h2>
        <div class="flex flex-1 items-center justify-center">
          <PayloadGauge
            v-if="build.hasVehicle"
            class="w-full"
            :percent-used="build.percentUsed"
            :status="build.status"
            :total-laden-kg="build.totalLadenKg"
            :gvwr-kg="build.gvwrKg"
            :remaining-kg="build.remainingKg"
          />
          <div v-else class="py-10 text-center">
            <UIcon name="i-lucide-compass" class="mx-auto size-10 text-dimmed" />
            <p class="mt-3 font-display font-medium">{{ t('payload.emptyTitle') }}</p>
            <p class="text-sm text-muted">{{ t('payload.emptyHint') }}</p>
          </div>
        </div>
      </section>

      <!-- Crew & liquids (desktop: row 2, cols 3-4) -->
      <section :class="[tile, tileHover, 'lg:col-start-3 lg:col-span-2 lg:row-start-2']">
        <h2 class="mb-3 font-display text-base font-semibold">{{ t('builder.crewAndLiquids') }}</h2>
        <LoadControls />
      </section>

      <!-- Axle estimate (desktop: row 2, cols 5-6) -->
      <section
        v-if="build.axleEstimate"
        :class="[tile, tileHover, 'lg:col-start-5 lg:col-span-2 lg:row-start-2']"
      >
        <AxleEstimate />
      </section>
      <section
        v-else
        :class="[tile, 'lg:col-start-5 lg:col-span-2 lg:row-start-2 grid place-items-center text-center']"
      >
        <p class="text-sm text-dimmed">{{ t('axle.noData') }}</p>
      </section>

      <!-- Gear (full width) -->
      <section :class="[tile, 'lg:col-start-1 lg:col-span-6 lg:row-start-3']">
        <div class="mb-4 flex items-center justify-between gap-2">
          <h2 class="font-display text-base font-semibold">{{ t('builder.gear') }}</h2>
          <CustomGearForm />
        </div>
        <div class="space-y-6">
          <CustomGearList />
          <GearCatalog />
        </div>
      </section>
    </div>
  </UContainer>
</template>
