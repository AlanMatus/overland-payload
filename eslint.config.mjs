// @nuxt/eslint generates a flat config from the project; we extend it and
// disable any rules that conflict with Prettier (Prettier owns formatting).
import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'

export default withNuxt(prettier)
