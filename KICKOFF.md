# Kickoff prompt — paste this as your FIRST message in the new, empty project

---

You are helping me build a web app from scratch in this empty project. Read `CLAUDE.md` in the project root first — it has the full spec, scope, stack and conventions. Follow it strictly and do not expand scope.

We build **phase by phase**. At the end of each phase: stop, give me a short summary of what changed and how to run/verify it, then wait for me to say "next" before starting the following phase. Do not skip ahead.

Context about me: I'm an experienced web developer but new to parts of this exact stack, so prefer idiomatic, modern **Nuxt 4** patterns, and briefly explain key decisions (and any time you're choosing between options) so I learn the stack rather than just receiving code.

Here are the phases.

## Phase 0 — Scaffold & tooling
Initialise a **Nuxt 4** project (latest) with TypeScript strict mode and **pnpm**. Add and configure:
- `@nuxt/ui` (with Tailwind CSS v4)
- `@nuxtjs/i18n` — English as the default locale now, plus a stubbed Slovak (`sk`) locale file for later
- `@pinia/nuxt`
- `@vueuse/nuxt`
- `@nuxt/eslint` + Prettier
- `vitest`

Set up the Nuxt 4 `app/` directory structure, a base layout with a header showing the app name, and a working i18n setup where the homepage title is pulled from a locale key (prove it renders from `en.json`). Finish by listing the run commands.

## Phase 1 — Types & seed data
Implement the data model from CLAUDE.md (`Vehicle`, `GearItem`, `Build`) as shared types. Create typed JSON seed data:
- ~10 popular overland vehicles (e.g. Toyota Land Cruiser, Land Rover Defender, Toyota Hilux, Nissan Patrol, Ford Ranger, a VW Transporter-class van) with realistic curb weight, GVWR and axle limits where you can find them.
- ~30 gear items across the categories with realistic weights (roof tents, drawer systems, winches, bull bars, recovery kits, water/fuel containers, tyres, etc.).

Expose the data through composables (`useVehicles`, `useGearCatalog`). **Clearly mark any figures you are estimating** vs. confident about, so I can verify the real numbers later.

## Phase 2 — The payload calculator (the core)
This is the heart of the app. First, build the weight math as **pure, unit-tested functions**:
- total laden weight = curb + gear + passengers (count × avg) + fuel + water
- remaining payload = GVWR − total laden weight
- % of GVWR used
- front/rear axle load estimate where axle data exists

Then build the live UI: a **"payload bar"** that fills as items are added, with green / amber / red states and an explicit over-limit warning. Add a Pinia store for the current build, controls to add/remove gear, a passenger control (count × average weight), and fuel/water inputs. Write **Vitest tests** for all the math functions, including the over-limit edge cases.

## Phase 3 — Build UX
Let the user pick a vehicle, name a build, and watch everything update live. Persist the current build locally (Pinia persisted state or `localStorage`) and generate a **shareable URL** that encodes only the build config (no personal data). Handle empty states and validation. Allow adding a **custom gear item with a user-entered weight** for anything not in the catalogue.

## Phase 4 — i18n completeness & polish
Audit that every user-facing string is an i18n key in `en.json`; create a parallel `sk.json` (English placeholder values are fine for now) and a locale switcher we can keep hidden until Slovak is ready. Ensure weights go through a unit-formatting layer (kg now, lbs possible later). Do a pass on responsiveness, basic accessibility, and SEO meta tags.

---

Stop after **Phase 0** and wait for me. Start now with Phase 0.
