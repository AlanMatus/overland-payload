// Encode/decode a build config to a compact, URL-safe string so a build can be
// shared via a link. Encodes ONLY build config — no personal data, no ids that
// identify a user. Pure functions (browser/Node `btoa`/`atob`), so unit-testable.

import type { BuildConfig, GearCategory, GearItem, MountLocation } from '#shared/types'

const SHARE_VERSION = 1

// Compact wire format — short keys keep the URL small.
interface WireGear {
  n: string // name
  w: number // weightKg
  c: GearCategory // category
  m?: MountLocation // mount
}

interface WirePayload {
  v: number // schema version
  n?: string // name
  ve: string | null // vehicleId
  g: string[] // catalogue gear ids
  c: WireGear[] // custom gear
  p: number // passengers
  a: number // avg passenger kg
  f: number // fuel kg
  w: number // water kg
}

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/** Encode a build config into a URL-safe token. */
export function encodeBuild(config: BuildConfig): string {
  const payload: WirePayload = {
    v: SHARE_VERSION,
    n: config.name || undefined,
    ve: config.vehicleId,
    g: config.gearItemIds,
    c: config.customGear.map((g) => ({ n: g.name, w: g.weightKg, c: g.category, m: g.mount })),
    p: config.passengers,
    a: config.avgPassengerWeightKg,
    f: config.fuelKg,
    w: config.waterKg
  }
  return toBase64Url(JSON.stringify(payload))
}

/** Decode a token back into a build config, or null if invalid/unsupported. */
export function decodeBuild(token: string): BuildConfig | null {
  try {
    const parsed = JSON.parse(fromBase64Url(token)) as Partial<WirePayload>
    if (parsed.v !== SHARE_VERSION) return null

    const customGear: GearItem[] = Array.isArray(parsed.c)
      ? parsed.c.map((g, i) => ({
          id: `custom-${i + 1}-${g.n}`,
          name: String(g.n),
          weightKg: Number(g.w),
          category: g.c,
          mount: g.m,
          isCustom: true
        }))
      : []

    return {
      name: parsed.n ?? '',
      vehicleId: parsed.ve ?? null,
      gearItemIds: Array.isArray(parsed.g) ? parsed.g.map(String) : [],
      customGear,
      passengers: Number(parsed.p ?? 1),
      avgPassengerWeightKg: Number(parsed.a ?? 80),
      fuelKg: Number(parsed.f ?? 0),
      waterKg: Number(parsed.w ?? 0)
    }
  } catch {
    return null
  }
}
