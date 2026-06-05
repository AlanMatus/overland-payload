import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    // Pure weight-math functions need no DOM; component tests opt in via
    // a `// @vitest-environment nuxt` comment at the top of the file.
    environment: 'node',
    include: ['tests/**/*.{test,spec}.ts']
  }
})
