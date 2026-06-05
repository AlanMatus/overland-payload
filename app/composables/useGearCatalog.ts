import gearData from '~/data/gear.json'
import type { GearCategory, GearItem } from '#shared/types'

// The ONLY access point for catalogue gear. Custom (user-entered) items are NOT
// here — they live inline on the build (see Build.customGear).
const gear = gearData as GearItem[]

export function useGearCatalog() {
  const getGearItem = (id: string): GearItem | undefined => gear.find((g) => g.id === id)

  const byCategory = computed(() => {
    const groups = new Map<GearCategory, GearItem[]>()
    for (const item of gear) {
      const list = groups.get(item.category) ?? []
      list.push(item)
      groups.set(item.category, list)
    }
    return groups
  })

  return {
    gear,
    getGearItem,
    byCategory
  }
}
