# Overland Rig Builder & Payload Calculator

A web app for overland / off-road enthusiasts to plan a vehicle build and check that the loaded
vehicle stays within its legal and safe weight limits (payload, GVWR, and axle limits where data
allows).

Pick a base vehicle, add gear (roof tent, drawers, winch, tyres, water, fuel…), set passengers, and
watch a **live readout of total weight vs. the vehicle's maximum**, with clear green / amber / red
warnings when you approach or exceed the limit.

> The standout feature is the **weight / payload calculator** — overloading a rig is a common, real
> safety and legal problem that most build planners ignore.

## Tech stack

- **Nuxt 4** (Vue 3 + Vite + Nitro), TypeScript **strict**
- **Nuxt UI v4** + **Tailwind CSS v4**
- **Pinia** (build state) + **pinia-plugin-persistedstate** (localStorage)
- **@nuxtjs/i18n** (English now, Slovak stubbed as a drop-in)
- **@vueuse/nuxt**, **@nuxt/eslint** + **Prettier**, **Vitest**
- **pnpm**

## Commands

```bash
pnpm install      # install dependencies
pnpm dev          # dev server (http://localhost:3000)
pnpm build        # production build
pnpm preview      # preview the production build
pnpm lint         # eslint
pnpm lint:fix     # eslint --fix
pnpm typecheck    # vue-tsc type check
pnpm test         # vitest (run once)
pnpm test:watch   # vitest watch
```

> **macOS note:** `pnpm dev` sets `TMPDIR=/tmp` to keep Nuxt's vite-node unix socket path under the
> 104-char macOS limit (the default `/var/folders/...` TMPDIR overflows it and breaks the dev server).

## How it works

- **Weight math** lives in `shared/utils/payload.ts` as **pure functions** (no Vue/Pinia deps) and is
  fully unit-tested (`tests/payload.spec.ts`), including over-limit edge cases.
- **State** is a Pinia store (`app/stores/build.ts`) that wraps those pure functions as getters.
- **Data** (vehicles, gear) is typed JSON behind composables (`useVehicles`, `useGearCatalog`) so it
  can be swapped for a database later without touching the UI.
- **Builds persist** to localStorage and can be **shared via URL** (`?b=<token>`) — the token encodes
  only build config, no personal data (`shared/utils/shareBuild.ts`).
- **Units:** all weights are stored in **kilograms**; display goes through `useWeightFormat` so
  another unit (lbs) can be added without touching the math.

## Project structure

```
app/
  components/   PayloadBar, GearCatalog, LoadControls, AxleEstimate, BuildToolbar,
                CustomGearForm, CustomGearList, LocaleSwitcher
  composables/  useVehicles, useGearCatalog, useWeightFormat, useShareBuild
  data/         vehicles.json, gear.json (seed data)
  layouts/      default.vue
  pages/        index.vue (the builder)
  stores/       build.ts
shared/
  types/        domain model (Vehicle, GearItem, Build, BuildConfig)
  utils/        payload.ts (pure math), shareBuild.ts (URL encode/decode)
i18n/locales/   en.json, sk.json
tests/          payload, data, shareBuild, i18n, smoke
```

## Data accuracy

Vehicle curb/GVWR/axle figures and most gear weights are **estimates** (marked with
`confidence: "estimated"` in the seed data) and vary by model year and market. Fuel/water weights are
physics-based and marked `confident`. Verify against manufacturer plates / a weighbridge before
relying on them for real-world loading decisions.
