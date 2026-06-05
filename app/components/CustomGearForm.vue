<script setup lang="ts">
import type { GearCategory, MountLocation } from '#shared/types'

const { t } = useI18n()
const build = useBuildStore()

const open = ref(false)

const name = ref('')
const weightKg = ref<number>(0)
const category = ref<GearCategory>('other')
const mount = ref<MountLocation | undefined>(undefined)

const categoryItems = computed(() =>
  (['protection', 'recovery', 'storage', 'camping', 'tyres', 'water', 'fuel', 'other'] as const).map(
    (c) => ({ label: t(`gear.category.${c}`), value: c })
  )
)
const mountItems = computed(() =>
  (['roof', 'front', 'rear', 'interior', 'underbody'] as const).map((m) => ({
    label: t(`gear.mount.${m}`),
    value: m
  }))
)

const canSubmit = computed(() => name.value.trim().length > 0 && weightKg.value > 0)

function resetForm() {
  name.value = ''
  weightKg.value = 0
  category.value = 'other'
  mount.value = undefined
}

function submit() {
  if (!canSubmit.value) return
  build.addCustomGear({
    name: name.value.trim(),
    weightKg: weightKg.value,
    category: category.value,
    mount: mount.value
  })
  resetForm()
  open.value = false
}
</script>

<template>
  <div>
    <UButton
      icon="i-lucide-plus"
      color="neutral"
      variant="outline"
      size="sm"
      @click="open = true"
    >
      {{ t('custom.add') }}
    </UButton>

    <UModal v-model:open="open" :title="t('custom.title')">
      <template #body>
        <div class="space-y-4">
          <UFormField :label="t('custom.name')" required>
            <UInput v-model="name" class="w-full" :placeholder="t('custom.namePlaceholder')" />
          </UFormField>

          <UFormField :label="t('custom.weight')" :hint="t('custom.weightHint')" required>
            <UInputNumber v-model="weightKg" :min="0" :step="1" class="w-full" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField :label="t('custom.category')">
              <USelect v-model="category" :items="categoryItems" value-key="value" class="w-full" />
            </UFormField>
            <UFormField :label="t('custom.mount')">
              <USelect
                v-model="mount"
                :items="mountItems"
                value-key="value"
                :placeholder="t('custom.mountPlaceholder')"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="open = false">
            {{ t('common.cancel') }}
          </UButton>
          <UButton :disabled="!canSubmit" @click="submit">{{ t('custom.addItem') }}</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
