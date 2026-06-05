// Pure weight-math. NO Vue / Pinia / Nuxt imports — these must stay trivially
// unit-testable (see CLAUDE.md). All weights are in kilograms.

import type { MountLocation, Vehicle } from '#shared/types'

/** Payload usage thresholds, as a fraction of GVWR. */
export const PAYLOAD_THRESHOLDS = {
  /** At/above this fraction we warn (amber). */
  near: 0.85,
  /** Above this fraction the vehicle is overloaded (red). */
  over: 1
} as const

export type PayloadStatus = 'under' | 'near' | 'over'

/** Sum the weight of a list of items (catalogue or custom). */
export function sumGearWeight(items: ReadonlyArray<{ weightKg: number }>): number {
  return items.reduce((total, item) => total + item.weightKg, 0)
}

/** Combined weight of all passengers (count × average), never negative. */
export function passengerWeight(count: number, avgWeightKg: number): number {
  if (count <= 0 || avgWeightKg <= 0) return 0
  return count * avgWeightKg
}

/** Everything the user adds on top of the bare vehicle. */
export function addedPayloadWeight(input: {
  gearKg: number
  passengerKg: number
  fuelKg: number
  waterKg: number
}): number {
  return input.gearKg + input.passengerKg + input.fuelKg + input.waterKg
}

/** Total laden weight = curb + everything added. */
export function totalLadenWeight(curbWeightKg: number, addedKg: number): number {
  return curbWeightKg + addedKg
}

/** Remaining payload before hitting GVWR. Negative means over the limit. */
export function remainingPayload(gvwrKg: number, totalLadenKg: number): number {
  return gvwrKg - totalLadenKg
}

/** Percentage of GVWR used. Guards against a zero/invalid GVWR. */
export function percentOfGvwr(totalLadenKg: number, gvwrKg: number): number {
  if (gvwrKg <= 0) return 0
  return (totalLadenKg / gvwrKg) * 100
}

/** Map a GVWR-usage percentage to a traffic-light status. */
export function payloadStatus(percentUsed: number): PayloadStatus {
  if (percentUsed > PAYLOAD_THRESHOLDS.over * 100) return 'over'
  if (percentUsed >= PAYLOAD_THRESHOLDS.near * 100) return 'near'
  return 'under'
}

/**
 * Front/rear axle load ESTIMATE.
 *
 * This is intentionally a simple, transparent model — real axle loads depend on
 * exact mounting positions and wheelbase, which we don't model. We split the
 * vehicle's "central" mass (curb + passengers + fuel + water + interior/roof/
 * underbody gear) by a fixed front bias, and assign clearly front- or
 * rear-mounted gear entirely to that axle.
 *
 * Returns null when the vehicle has no axle ratings to compare against.
 */
export function estimateAxleLoads(
  input: {
    curbWeightKg: number
    frontMountedKg: number
    rearMountedKg: number
    centralKg: number // passengers, fuel, water, and roof/interior/underbody gear
  },
  curbFrontFraction = 0.52
): { frontAxleKg: number; rearAxleKg: number } {
  const frac = clamp(curbFrontFraction, 0, 1)
  const central = input.curbWeightKg + input.centralKg
  const frontAxleKg = central * frac + input.frontMountedKg
  const rearAxleKg = central * (1 - frac) + input.rearMountedKg
  return { frontAxleKg, rearAxleKg }
}

/** Which axle a mount location loads: 'front', 'rear', or 'central' (split). */
export function axleForMount(mount: MountLocation | undefined): 'front' | 'rear' | 'central' {
  if (mount === 'front') return 'front'
  if (mount === 'rear') return 'rear'
  return 'central' // roof, interior, underbody, or unspecified
}

/** True when the vehicle has at least one axle rating we can check against. */
export function hasAxleData(vehicle: Pick<Vehicle, 'frontAxleMaxKg' | 'rearAxleMaxKg'>): boolean {
  return vehicle.frontAxleMaxKg !== undefined || vehicle.rearAxleMaxKg !== undefined
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
