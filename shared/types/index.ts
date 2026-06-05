// Shared domain types — the single source of truth for the data model.
// Used by composables, the Pinia store, pure weight-math utils and the UI.
// All weights are stored in KILOGRAMS (see CLAUDE.md "Units" rule).

/** How sure we are about a seed figure, so real numbers can be verified later. */
export type DataConfidence = 'confident' | 'estimated'

export type GearCategory =
  | 'recovery'
  | 'camping'
  | 'storage'
  | 'protection'
  | 'tyres'
  | 'water'
  | 'fuel'
  | 'other'

export type MountLocation = 'roof' | 'front' | 'rear' | 'interior' | 'underbody'

export interface Vehicle {
  id: string
  make: string
  model: string
  variant?: string
  /**
   * Short body label (e.g. "3-door", "110 · 5-door", "Double Cab"). Vehicles
   * sharing the same `make` + `model` are body variants of one another and are
   * grouped behind a single model choice in the picker.
   */
  body?: string
  curbWeightKg: number // kerb / unladen weight
  gvwrKg: number // gross vehicle weight rating (max total allowed)
  frontAxleMaxKg?: number
  rearAxleMaxKg?: number
  // payloadCapacityKg is DERIVED: gvwrKg - curbWeightKg (see shared/utils/payload.ts)

  /** Marks whether the weight/axle figures are verified or estimated. */
  confidence?: DataConfidence
  /** Free-text note on sourcing or which variant/market the figures reflect. */
  notes?: string
}

export interface GearItem {
  id: string
  name: string
  category: GearCategory
  weightKg: number
  mount?: MountLocation
  isCustom?: boolean // true for user-entered items not in the catalogue

  confidence?: DataConfidence
  notes?: string
}

export interface Build {
  id: string
  name: string
  vehicleId: string
  gearItemIds: string[] // catalogue items
  customGear: GearItem[] // user-entered items stored inline (isCustom: true)
  passengers: number
  avgPassengerWeightKg: number
  fuelKg: number
  waterKg: number
}

/**
 * The portable build configuration — the persisted/shareable shape.
 * Same as Build minus the server-ish `id` (and vehicleId may be null while
 * the user hasn't picked one yet). This is what gets encoded into a share URL.
 */
export interface BuildConfig {
  name: string
  vehicleId: string | null
  gearItemIds: string[]
  customGear: GearItem[]
  passengers: number
  avgPassengerWeightKg: number
  fuelKg: number
  waterKg: number
}
