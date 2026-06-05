import vehiclesData from '~/data/vehicles.json'
import type { Vehicle } from '#shared/types'

// The ONLY access point for vehicle data. Today it reads typed JSON; swapping to
// an API/DB later means changing just this file, not the UI (see CLAUDE.md).
const vehicles = vehiclesData as Vehicle[]

export function useVehicles() {
  const getVehicle = (id: string | null | undefined): Vehicle | undefined =>
    id ? vehicles.find((v) => v.id === id) : undefined

  return {
    vehicles,
    getVehicle
  }
}
