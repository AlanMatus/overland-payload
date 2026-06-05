# CLAUDE.md — Overland Rig Builder & Payload Calculator

> Project context and rules for AI coding sessions. Read this fully before writing code, and follow it strictly.

## What we're building

A web app for overland / off-road enthusiasts to plan a vehicle build and — most importantly — check that the loaded vehicle stays within its legal and safe weight limits (payload, GVWR, and axle limits where data allows).

Users pick a base vehicle, add gear (roof tent, drawers, winch, tyres, water, fuel, etc.), set passengers, and see a **live readout of total weight vs. the vehicle's maximum**, with clear warnings when they go over.

The standout, underserved feature is the **weight / payload calculator**. Overloading a rig is a common, real safety and legal problem, and most build planners ignore it. That feature is the product — everything else supports it.

## Scope — v1 (build this)

- Select a base vehicle from a curated dataset.
- Add / remove gear items, each with a weight and an optional mounting location.
- Set passenger count + average weight, fuel level, and water / auxiliary tanks.
- Live total laden weight, remaining payload, % of GVWR, and a front/rear axle estimate where axle data exists.
- Clear visual state: under limit (green), close to limit (amber), over limit (red).
- Save builds locally and share a build via URL.
- **English only for now**, but fully internationalised (i18n) so a Slovak version is a drop-in later.

## Out of scope — do NOT build in v1

- **Part fitment / compatibility** ("does this exact lift kit fit this model-year"). This is a bottomless data problem that sinks bigger teams. We intentionally skip it. If a user wants an item we don't have, let them enter a **custom weight**.
- User accounts / server-side auth (local storage + URL sharing is enough for v1).
- Payments, marketplace, social features.
- A separate backend service (see "Backend" below — we start frontend-only).

Do not silently expand scope. If something seems to require an out-of-scope feature, stop and flag it.

## Tech stack

- **Nuxt 4** (latest, Vue 3 + Vite + Nitro). New `app/` directory structure. TypeScript in **strict** mode.
- **Nuxt UI v4** for components, built on **Tailwind CSS v4**. Prefer its components over hand-rolled CSS.
- **Pinia** (`@pinia/nuxt`) for the build state.
- **@nuxtjs/i18n** for localisation. English default, Slovak planned.
- **@nuxt/eslint** + **Prettier** for linting / formatting. **@vueuse/nuxt** for utility composables.
- **Vitest** for unit tests — the weight math must be tested.
- **pnpm** as the package manager.
- Data: start with typed JSON seed files. Keep all data access behind composables so we can swap to a database later without touching the UI.

### Backend (later, only if needed)

We do **not** need a separate backend for v1. Nuxt's built-in Nitro server routes plus a lightweight database (SQLite via Drizzle ORM) can serve and manage the dataset when we outgrow JSON.

Only introduce **Laravel** if backend complexity genuinely grows (rich admin, heavy business logic, separate API consumers). If/when we do, install **Laravel Boost** as a dev dependency (`composer require laravel/boost --dev`, then `php artisan boost:install`) so the AI agent gets Laravel-aware context, guidelines and an MCP server. Until then, ignore Laravel entirely.

## Conventions

- Vue SFCs with `<script setup lang="ts">` and the Composition API only. No Options API.
- Everything typed; no `any` unless justified with a comment. Define shared `interface`/`type` in `shared/types`.
- Folder layout (Nuxt 4 `app/` dir): components in `app/components`, pages in `app/pages`, composables in `app/composables`, stores in `app/stores`, types shared between app and server in `shared/types`.
- Naming: PascalCase components, `use`-prefixed camelCase composables, kebab-case page filenames.
- **i18n rule (important):** never hardcode user-facing text in templates. Every string goes through `t('...')` / `$t('...')` with a key in `i18n/locales/en.json`. This is what makes the Slovak version a drop-in later.
- **Units:** store all weights internally in **kilograms**. Keep a small formatting layer so another unit (lbs) can be added later without touching the math.
- Keep weight calculations as **pure functions** (no Vue/store dependency) so they're trivial to unit-test.
- Small, focused components. Lift shared logic into composables.

## Data model (starting point)

```ts
interface Vehicle {
  id: string
  make: string
  model: string
  variant?: string
  curbWeightKg: number        // kerb / unladen weight
  gvwrKg: number              // gross vehicle weight rating (max total allowed)
  frontAxleMaxKg?: number
  rearAxleMaxKg?: number
  // payloadCapacityKg is DERIVED: gvwrKg - curbWeightKg
}

interface GearItem {
  id: string
  name: string
  category: 'recovery' | 'camping' | 'storage' | 'protection' | 'tyres' | 'water' | 'fuel' | 'other'
  weightKg: number
  mount?: 'roof' | 'front' | 'rear' | 'interior' | 'underbody'
  isCustom?: boolean          // true for user-entered items not in the catalogue
}

interface Build {
  id: string
  name: string
  vehicleId: string
  gearItemIds: string[]       // catalogue items; custom items stored inline alongside
  passengers: number
  avgPassengerWeightKg: number
  fuelKg: number
  waterKg: number
}
```

## Commands

- `pnpm dev` — dev server
- `pnpm build` / `pnpm preview` — production build / preview
- `pnpm lint` / `pnpm lint:fix`
- `pnpm test` — Vitest

## Definition of done (per feature)

Type-checks pass, lints clean, every user-facing string is an i18n key, weight math has unit tests, the UI works at mobile width, and there are no console errors.
