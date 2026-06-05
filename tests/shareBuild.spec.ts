import { describe, expect, it } from 'vitest'
import { decodeBuild, encodeBuild } from '../shared/utils/shareBuild'
import type { BuildConfig } from '../shared/types'

const sample: BuildConfig = {
  name: 'Desert rig',
  vehicleId: 'land-rover-defender-110',
  gearItemIds: ['winch-electric', 'rtt-hardshell', 'drawer-system'],
  customGear: [
    { id: 'x', name: 'Custom rooftop solar', weightKg: 9.5, category: 'other', mount: 'roof' }
  ],
  passengers: 2,
  avgPassengerWeightKg: 82,
  fuelKg: 70,
  waterKg: 40
}

describe('encodeBuild / decodeBuild', () => {
  it('produces a URL-safe token (no +, /, = or spaces)', () => {
    const token = encodeBuild(sample)
    expect(token).not.toMatch(/[+/=\s]/)
  })

  it('round-trips the build config', () => {
    const decoded = decodeBuild(encodeBuild(sample))
    expect(decoded).not.toBeNull()
    expect(decoded!.name).toBe(sample.name)
    expect(decoded!.vehicleId).toBe(sample.vehicleId)
    expect(decoded!.gearItemIds).toEqual(sample.gearItemIds)
    expect(decoded!.passengers).toBe(2)
    expect(decoded!.avgPassengerWeightKg).toBe(82)
    expect(decoded!.fuelKg).toBe(70)
    expect(decoded!.waterKg).toBe(40)
  })

  it('preserves custom gear (weights and category) and marks it custom', () => {
    const decoded = decodeBuild(encodeBuild(sample))
    expect(decoded!.customGear).toHaveLength(1)
    expect(decoded!.customGear[0]).toMatchObject({
      name: 'Custom rooftop solar',
      weightKg: 9.5,
      category: 'other',
      mount: 'roof',
      isCustom: true
    })
  })

  it('handles unicode in the build name', () => {
    const decoded = decodeBuild(encodeBuild({ ...sample, name: 'Púšťová zostava 🐫' }))
    expect(decoded!.name).toBe('Púšťová zostava 🐫')
  })

  it('returns null for garbage input', () => {
    expect(decodeBuild('not-valid-base64!!')).toBeNull()
    expect(decodeBuild('')).toBeNull()
  })

  it('returns null for an unsupported version', () => {
    const token = encodeBuild(sample).replace(/.$/, 'X') // corrupt tail
    // Corruption may still parse; explicitly check a wrong-version payload too.
    const wrongVersion = btoa(JSON.stringify({ v: 999 }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    expect(decodeBuild(wrongVersion)).toBeNull()
    // (the corrupted token is allowed to be null OR a best-effort decode)
    void token
  })
})
