import { defineStore } from 'pinia'
import type { BuildConfig, GearItem, Vehicle } from '#shared/types'
import {
  addedPayloadWeight,
  axleForMount,
  estimateAxleLoads,
  hasAxleData,
  passengerWeight,
  payloadStatus,
  percentOfGvwr,
  remainingPayload,
  sumGearWeight,
  totalLadenWeight
} from '#shared/utils/payload'

const DEFAULT_AVG_PASSENGER_KG = 80
const DEFAULT_PASSENGERS = 1

export const useBuildStore = defineStore('build', () => {
  const { getVehicle } = useVehicles()
  const { getGearItem } = useGearCatalog()

  // --- State (mirrors the Build type; id/name set when saving or sharing) ---
  const name = ref('')
  const vehicleId = ref<string | null>(null)
  const gearItemIds = ref<string[]>([])
  const customGear = ref<GearItem[]>([])
  const passengers = ref(DEFAULT_PASSENGERS)
  const avgPassengerWeightKg = ref(DEFAULT_AVG_PASSENGER_KG)
  const fuelKg = ref(0)
  const waterKg = ref(0)

  // --- Derived data ---
  const vehicle = computed<Vehicle | undefined>(() => getVehicle(vehicleId.value))

  /** Catalogue items currently in the build (skips ids no longer in the catalogue). */
  const catalogueGear = computed<GearItem[]>(() =>
    gearItemIds.value.map((id) => getGearItem(id)).filter((g): g is GearItem => g !== undefined)
  )

  /** Everything on the build: catalogue + custom items. */
  const allGear = computed<GearItem[]>(() => [...catalogueGear.value, ...customGear.value])

  // --- Weight math (delegates to pure functions) ---
  const gearKg = computed(() => sumGearWeight(allGear.value))
  const passengerKg = computed(() => passengerWeight(passengers.value, avgPassengerWeightKg.value))
  const addedKg = computed(() =>
    addedPayloadWeight({
      gearKg: gearKg.value,
      passengerKg: passengerKg.value,
      fuelKg: fuelKg.value,
      waterKg: waterKg.value
    })
  )

  const curbWeightKg = computed(() => vehicle.value?.curbWeightKg ?? 0)
  const gvwrKg = computed(() => vehicle.value?.gvwrKg ?? 0)
  const payloadCapacityKg = computed(() => Math.max(gvwrKg.value - curbWeightKg.value, 0))

  const totalLadenKg = computed(() => totalLadenWeight(curbWeightKg.value, addedKg.value))
  const remainingKg = computed(() => remainingPayload(gvwrKg.value, totalLadenKg.value))
  const percentUsed = computed(() => percentOfGvwr(totalLadenKg.value, gvwrKg.value))
  const status = computed(() => payloadStatus(percentUsed.value))
  const isOverloaded = computed(() => status.value === 'over')

  /** Front/rear axle estimate, or null when the vehicle has no axle ratings. */
  const axleEstimate = computed(() => {
    const v = vehicle.value
    if (!v || !hasAxleData(v)) return null

    let frontMountedKg = 0
    let rearMountedKg = 0
    let gearCentralKg = 0
    for (const item of allGear.value) {
      const axle = axleForMount(item.mount)
      if (axle === 'front') frontMountedKg += item.weightKg
      else if (axle === 'rear') rearMountedKg += item.weightKg
      else gearCentralKg += item.weightKg
    }

    const { frontAxleKg, rearAxleKg } = estimateAxleLoads({
      curbWeightKg: v.curbWeightKg,
      frontMountedKg,
      rearMountedKg,
      // passengers, fuel and water ride "central" with roof/interior/underbody gear
      centralKg: passengerKg.value + fuelKg.value + waterKg.value + gearCentralKg
    })

    return {
      frontAxleKg,
      rearAxleKg,
      frontMaxKg: v.frontAxleMaxKg,
      rearMaxKg: v.rearAxleMaxKg,
      frontOver: v.frontAxleMaxKg !== undefined && frontAxleKg > v.frontAxleMaxKg,
      rearOver: v.rearAxleMaxKg !== undefined && rearAxleKg > v.rearAxleMaxKg
    }
  })

  const hasVehicle = computed(() => vehicle.value !== undefined)

  // --- Actions ---
  function setVehicle(id: string | null) {
    vehicleId.value = id
  }

  function setName(value: string) {
    name.value = value
  }

  function addGear(id: string) {
    if (!gearItemIds.value.includes(id)) gearItemIds.value.push(id)
  }

  function removeGear(id: string) {
    gearItemIds.value = gearItemIds.value.filter((g) => g !== id)
  }

  function toggleGear(id: string) {
    if (gearItemIds.value.includes(id)) removeGear(id)
    else addGear(id)
  }

  function hasGear(id: string) {
    return gearItemIds.value.includes(id)
  }

  function addCustomGear(item: Omit<GearItem, 'id' | 'isCustom'> & { id?: string }) {
    const id = item.id ?? `custom-${customGear.value.length + 1}-${item.name}`
    customGear.value.push({ ...item, id, isCustom: true })
  }

  function removeCustomGear(id: string) {
    customGear.value = customGear.value.filter((g) => g.id !== id)
  }

  function setPassengers(count: number) {
    passengers.value = Math.max(0, Math.round(count))
  }

  function setAvgPassengerWeight(kg: number) {
    avgPassengerWeightKg.value = Math.max(0, kg)
  }

  function setFuel(kg: number) {
    fuelKg.value = Math.max(0, kg)
  }

  function setWater(kg: number) {
    waterKg.value = Math.max(0, kg)
  }

  function reset() {
    name.value = ''
    vehicleId.value = null
    gearItemIds.value = []
    customGear.value = []
    passengers.value = DEFAULT_PASSENGERS
    avgPassengerWeightKg.value = DEFAULT_AVG_PASSENGER_KG
    fuelKg.value = 0
    waterKg.value = 0
  }

  /** Plain snapshot of the build config (no derived data) for sharing/persisting. */
  function snapshot(): BuildConfig {
    return {
      name: name.value,
      vehicleId: vehicleId.value,
      gearItemIds: [...gearItemIds.value],
      customGear: customGear.value.map((g) => ({ ...g })),
      passengers: passengers.value,
      avgPassengerWeightKg: avgPassengerWeightKg.value,
      fuelKg: fuelKg.value,
      waterKg: waterKg.value
    }
  }

  /** Replace the whole build from a decoded share/config object. */
  function applyConfig(config: BuildConfig) {
    name.value = config.name ?? ''
    vehicleId.value = config.vehicleId ?? null
    gearItemIds.value = [...(config.gearItemIds ?? [])]
    customGear.value = (config.customGear ?? []).map((g) => ({ ...g, isCustom: true }))
    passengers.value = config.passengers ?? DEFAULT_PASSENGERS
    avgPassengerWeightKg.value = config.avgPassengerWeightKg ?? DEFAULT_AVG_PASSENGER_KG
    fuelKg.value = config.fuelKg ?? 0
    waterKg.value = config.waterKg ?? 0
  }

  return {
    // state
    name,
    vehicleId,
    gearItemIds,
    customGear,
    passengers,
    avgPassengerWeightKg,
    fuelKg,
    waterKg,
    // derived
    vehicle,
    hasVehicle,
    catalogueGear,
    allGear,
    gearKg,
    passengerKg,
    addedKg,
    curbWeightKg,
    gvwrKg,
    payloadCapacityKg,
    totalLadenKg,
    remainingKg,
    percentUsed,
    status,
    isOverloaded,
    axleEstimate,
    // actions
    setVehicle,
    setName,
    addGear,
    removeGear,
    toggleGear,
    hasGear,
    addCustomGear,
    removeCustomGear,
    setPassengers,
    setAvgPassengerWeight,
    setFuel,
    setWater,
    reset,
    snapshot,
    applyConfig
  }
}, {
  // Persist the current build locally so it survives reloads (client-only).
  persist: {
    key: 'overland-build',
    pick: [
      'name',
      'vehicleId',
      'gearItemIds',
      'customGear',
      'passengers',
      'avgPassengerWeightKg',
      'fuelKg',
      'waterKg'
    ]
  }
})
