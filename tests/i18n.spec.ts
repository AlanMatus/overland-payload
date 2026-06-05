import { describe, expect, it } from 'vitest'
import en from '../i18n/locales/en.json'
import sk from '../i18n/locales/sk.json'

type Json = { [key: string]: string | Json }

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
