<script setup lang="ts">
const { t } = useI18n()
const build = useBuildStore()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <UFormField :label="t('controls.passengers')">
      <UInputNumber
        :model-value="build.passengers"
        :min="0"
        :step="1"
        class="w-full"
        @update:model-value="build.setPassengers($event)"
      />
    </UFormField>

    <UFormField :label="t('controls.avgPassengerWeight')">
      <UInputNumber
        :model-value="build.avgPassengerWeightKg"
        :min="0"
        :step="5"
        class="w-full"
        @update:model-value="build.setAvgPassengerWeight($event)"
      />
    </UFormField>

    <UFormField :label="t('controls.fuel')" :hint="t('controls.fuelHint')">
      <UInputNumber
        :model-value="build.fuelKg"
        :min="0"
        :step="5"
        class="w-full"
        @update:model-value="build.setFuel($event)"
      />
    </UFormField>

    <UFormField :label="t('controls.water')" :hint="t('controls.waterHint')">
      <UInputNumber
        :model-value="build.waterKg"
        :min="0"
        :step="5"
        class="w-full"
        @update:model-value="build.setWater($event)"
      />
    </UFormField>
  </div>
</template>
