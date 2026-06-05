import vehiclesData from '~/data/vehicles.json'
import type { Vehicle } from '#shared/types'

// The ONLY access point for vehicle data. Today it reads typed JSON; swapping to
// an API/DB later means changing just this file, not the UI (see CLAUDE.md).
const vehicles = vehiclesData as Vehicle[]

/** A model and its body variants (e.g. Defender → 90 / 110). */
export interface VehicleGroup {
  key: string
  make: string
  model: string
  label: string
  vehicles: Vehicle[]
}

/** Group key for a vehicle — vehicles sharing make+model are body variants. */
export function vehicleGroupKey(v: Pick<Vehicle, 'make' | 'model'>): string {
  return `${v.make}__${v.model}`
}

export function useVehicles() {
  const getVehicle = (id: string | null | undefined): Vehicle | undefined =>
    id ? vehicles.find((v) => v.id === id) : undefined

  // One entry per make+model, preserving source order.
  const groups: VehicleGroup[] = (() => {
    const map = new Map<string, VehicleGroup>()
    for (const v of vehicles) {
      const key = vehicleGroupKey(v)
      let group = map.get(key)
      if (!group) {
        group = { key, make: v.make, model: v.model, label: `${v.make} ${v.model}`, vehicles: [] }
        map.set(key, group)
      }
      group.vehicles.push(v)
    }
    return [...map.values()]
  })()

  const getGroup = (key: string | null | undefined): VehicleGroup | undefined =>
    key ? groups.find((g) => g.key === key) : undefined

  return {
    vehicles,
    groups,
    getVehicle,
    getGroup
  }
}
