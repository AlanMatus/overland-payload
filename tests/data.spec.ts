import { describe, expect, it } from 'vitest'
import vehicles from '../app/data/vehicles.json'
import gear from '../app/data/gear.json'
import type { GearItem, Vehicle } from '../shared/types'

const vehicleList = vehicles as Vehicle[]
const gearList = gear as GearItem[]

const uniqueIds = (items: { id: string }[]) => new Set(items.map((i) => i.id)).size

describe('vehicle seed data', () => {
  it('has ~10 vehicles', () => {
    expect(vehicleList.length).toBeGreaterThanOrEqual(10)
  })

  it('has unique ids', () => {
    expect(uniqueIds(vehicleList)).toBe(vehicleList.length)
  })

  it('every vehicle has positive curb weight and a GVWR above it (positive payload)', () => {
    for (const v of vehicleList) {
      expect(v.curbWeightKg, v.id).toBeGreaterThan(0)
      expect(v.gvwrKg, v.id).toBeGreaterThan(v.curbWeightKg)
    }
  })

  it('axle limits, when present, are positive', () => {
    for (const v of vehicleList) {
      if (v.frontAxleMaxKg !== undefined) expect(v.frontAxleMaxKg, v.id).toBeGreaterThan(0)
      if (v.rearAxleMaxKg !== undefined) expect(v.rearAxleMaxKg, v.id).toBeGreaterThan(0)
    }
  })

  it('marks confidence on every entry', () => {
    for (const v of vehicleList) {
      expect(['confident', 'estimated'], v.id).toContain(v.confidence)
    }
  })

  it('multi-body models share make+model and have distinct bodies', () => {
    const byModel = new Map<string, Vehicle[]>()
    for (const v of vehicleList) {
      const key = `${v.make} ${v.model}`
      byModel.set(key, [...(byModel.get(key) ?? []), v])
    }
    // These models each ship more than one body variant.
    for (const model of [
      'Land Rover Defender (L663)',
      'Jeep Wrangler JL',
      'Jeep Wrangler JK',
      'Suzuki Jimny',
      'Ford Bronco'
    ]) {
      const variants = byModel.get(model) ?? []
      expect(variants.length, model).toBeGreaterThan(1)
      const bodies = variants.map((v) => v.body)
      expect(bodies.every(Boolean), `${model} bodies`).toBe(true)
      expect(new Set(bodies).size, `${model} distinct bodies`).toBe(variants.length)
    }
  })
})

describe('gear seed data', () => {
  const categories = [
    'recovery',
    'camping',
    'storage',
    'protection',
    'tyres',
    'water',
    'fuel',
    'other'
  ]

  it('has ~30 gear items', () => {
    expect(gearList.length).toBeGreaterThanOrEqual(30)
  })

  it('has unique ids', () => {
    expect(uniqueIds(gearList)).toBe(gearList.length)
  })

  it('covers every category', () => {
    const present = new Set(gearList.map((g) => g.category))
    for (const c of categories) expect(present, c).toContain(c)
  })

  it('every item has a positive weight and a valid category', () => {
    for (const g of gearList) {
      expect(g.weightKg, g.id).toBeGreaterThan(0)
      expect(categories, g.id).toContain(g.category)
    }
  })

  it('marks confidence on every entry', () => {
    for (const g of gearList) {
      expect(['confident', 'estimated'], g.id).toContain(g.confidence)
    }
  })
})
