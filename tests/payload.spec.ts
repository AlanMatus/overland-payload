import { describe, expect, it } from 'vitest'
import {
  PAYLOAD_THRESHOLDS,
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
} from '../shared/utils/payload'

describe('sumGearWeight', () => {
  it('returns 0 for an empty list', () => {
    expect(sumGearWeight([])).toBe(0)
  })

  it('sums item weights', () => {
    expect(sumGearWeight([{ weightKg: 30 }, { weightKg: 12.5 }, { weightKg: 7.5 }])).toBe(50)
  })
})

describe('passengerWeight', () => {
  it('multiplies count by average', () => {
    expect(passengerWeight(4, 80)).toBe(320)
  })

  it('clamps non-positive inputs to 0', () => {
    expect(passengerWeight(0, 80)).toBe(0)
    expect(passengerWeight(2, 0)).toBe(0)
    expect(passengerWeight(-1, 80)).toBe(0)
  })
})

describe('addedPayloadWeight', () => {
  it('adds gear, passengers, fuel and water', () => {
    expect(addedPayloadWeight({ gearKg: 200, passengerKg: 160, fuelKg: 50, waterKg: 40 })).toBe(450)
  })
})

describe('totalLadenWeight', () => {
  it('is curb plus added', () => {
    expect(totalLadenWeight(2300, 450)).toBe(2750)
  })
})

describe('remainingPayload', () => {
  it('is positive when under the limit', () => {
    expect(remainingPayload(3220, 2750)).toBe(470)
  })

  it('is exactly zero at the limit', () => {
    expect(remainingPayload(3220, 3220)).toBe(0)
  })

  it('is negative when over the limit', () => {
    expect(remainingPayload(3220, 3400)).toBe(-180)
  })
})

describe('percentOfGvwr', () => {
  it('computes the percentage used', () => {
    expect(percentOfGvwr(1610, 3220)).toBe(50)
  })

  it('returns 100 exactly at GVWR', () => {
    expect(percentOfGvwr(3220, 3220)).toBe(100)
  })

  it('exceeds 100 when overloaded', () => {
    expect(percentOfGvwr(3542, 3220)).toBeCloseTo(110, 5)
  })

  it('guards against a zero or invalid GVWR', () => {
    expect(percentOfGvwr(2000, 0)).toBe(0)
    expect(percentOfGvwr(2000, -100)).toBe(0)
  })
})

describe('payloadStatus (traffic light)', () => {
  it('is "under" well below the limit', () => {
    expect(payloadStatus(50)).toBe('under')
  })

  it('flips to "near" at the amber threshold', () => {
    expect(payloadStatus(PAYLOAD_THRESHOLDS.near * 100)).toBe('near') // 85
    expect(payloadStatus(84.9)).toBe('under')
    expect(payloadStatus(99.9)).toBe('near')
  })

  it('is "near" exactly at 100% (at the limit, not over)', () => {
    expect(payloadStatus(100)).toBe('near')
  })

  it('flips to "over" only above 100%', () => {
    expect(payloadStatus(100.01)).toBe('over')
    expect(payloadStatus(130)).toBe('over')
  })
})

describe('estimateAxleLoads', () => {
  it('splits central mass by the front fraction and sums to total laden', () => {
    const { frontAxleKg, rearAxleKg } = estimateAxleLoads(
      { curbWeightKg: 2000, centralKg: 400, frontMountedKg: 60, rearMountedKg: 90 },
      0.5
    )
    // central = 2400; 50/50 => 1200 each, plus mounted gear
    expect(frontAxleKg).toBe(1260)
    expect(rearAxleKg).toBe(1290)
    // conservation: front + rear === curb + central + all mounted
    expect(frontAxleKg + rearAxleKg).toBe(2000 + 400 + 60 + 90)
  })

  it('respects a front-biased default split', () => {
    const { frontAxleKg, rearAxleKg } = estimateAxleLoads({
      curbWeightKg: 1000,
      centralKg: 0,
      frontMountedKg: 0,
      rearMountedKg: 0
    })
    expect(frontAxleKg).toBeCloseTo(520, 5) // 0.52 default
    expect(rearAxleKg).toBeCloseTo(480, 5)
  })

  it('clamps an out-of-range front fraction', () => {
    const r = estimateAxleLoads(
      { curbWeightKg: 1000, centralKg: 0, frontMountedKg: 0, rearMountedKg: 0 },
      2
    )
    expect(r.frontAxleKg).toBe(1000)
    expect(r.rearAxleKg).toBe(0)
  })
})

describe('axleForMount', () => {
  it('maps front/rear directly and everything else to central', () => {
    expect(axleForMount('front')).toBe('front')
    expect(axleForMount('rear')).toBe('rear')
    expect(axleForMount('roof')).toBe('central')
    expect(axleForMount('interior')).toBe('central')
    expect(axleForMount('underbody')).toBe('central')
    expect(axleForMount(undefined)).toBe('central')
  })
})

describe('hasAxleData', () => {
  it('is true when either axle rating exists', () => {
    expect(hasAxleData({ frontAxleMaxKg: 1600, rearAxleMaxKg: 2000 })).toBe(true)
    expect(hasAxleData({ frontAxleMaxKg: 1600 })).toBe(true)
    expect(hasAxleData({ rearAxleMaxKg: 2000 })).toBe(true)
  })

  it('is false when neither rating exists', () => {
    expect(hasAxleData({})).toBe(false)
  })
})

describe('end-to-end over-limit scenario', () => {
  it('a small vehicle goes over with heavy gear', () => {
    // Suzuki Jimny-like: curb 1135, GVWR 1435 → only 300 kg payload.
    const gearKg = sumGearWeight([{ weightKg: 65 }, { weightKg: 75 }, { weightKg: 30 }]) // 170
    const paxKg = passengerWeight(2, 80) // 160
    const added = addedPayloadWeight({ gearKg, passengerKg: paxKg, fuelKg: 40, waterKg: 21 })
    const total = totalLadenWeight(1135, added)
    expect(total).toBe(1526)
    expect(remainingPayload(1435, total)).toBe(-91) // over by 91 kg
    expect(payloadStatus(percentOfGvwr(total, 1435))).toBe('over')
  })
})
