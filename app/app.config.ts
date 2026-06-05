// Nuxt UI semantic color aliases → our custom scales (defined in assets/css/main.css).
// primary = terra (burnt orange), neutral = sand (warm taupe).
// success/warning/error keep sensible defaults; the payload gauge uses the
// harmonized --signal-* CSS vars directly for its traffic-light zones.
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'terra',
      neutral: 'sand',
      success: 'green',
      warning: 'amber',
      error: 'red'
    }
  }
})
