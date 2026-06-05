import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

type Json = { [key: string]: string | Json }

// Read raw JSON (not `import`) so the @nuxtjs/i18n Vite plugin doesn't compile
// the locale files into message ASTs before we inspect their keys.
const load = (name: string): Json =>
  JSON.parse(
    readFileSync(fileURLToPath(new URL(`../i18n/locales/${name}.json`, import.meta.url)), 'utf8')
  )

const en = load('en')
const sk = load('sk')

function flattenKeys(obj: Json, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof value === 'object' && value !== null
      ? flattenKeys(value as Json, path)
      : [path]
  })
}

describe('i18n locale parity', () => {
  const enKeys = flattenKeys(en as Json).sort()
  const skKeys = flattenKeys(sk as Json).sort()

  it('sk has exactly the same keys as en (drop-in parallel)', () => {
    expect(skKeys).toEqual(enKeys)
  })

  it('has no empty translation values in either locale', () => {
    for (const [name, locale] of [
      ['en', en],
      ['sk', sk]
    ] as const) {
      const values = JSON.stringify(locale)
      expect(values, `${name} has an empty string value`).not.toContain('""')
    }
  })
})
