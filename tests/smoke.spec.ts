import { describe, expect, it } from 'vitest'

// Placeholder so the test runner is wired in Phase 0.
// Real weight-math tests land in Phase 2 (tests/payload.spec.ts).
describe('toolchain smoke test', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2)
  })
})
