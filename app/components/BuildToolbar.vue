<script setup lang="ts">
const { t } = useI18n()
const build = useBuildStore()
const { copyShareLink, clipboardSupported } = useShareBuild()
const toast = useToast()

async function share() {
  if (!build.hasVehicle) return
  const url = await copyShareLink()
  toast.add({
    title: clipboardSupported.value ? t('share.copied') : t('share.ready'),
    description: clipboardSupported.value ? undefined : url,
    icon: 'i-lucide-link',
    color: 'success'
  })
}

function reset() {
  build.reset()
  toast.add({ title: t('toolbar.resetDone'), icon: 'i-lucide-rotate-ccw', color: 'neutral' })
}
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
    <UFormField :label="t('toolbar.buildName')" class="flex-1">
      <UInput
        :model-value="build.name"
        :placeholder="t('toolbar.buildNamePlaceholder')"
        class="w-full"
        @update:model-value="build.setName($event)"
      />
    </UFormField>
    <div class="flex gap-2">
      <UButton
        icon="i-lucide-share-2"
        color="primary"
        :disabled="!build.hasVehicle"
        @click="share"
      >
        {{ t('toolbar.share') }}
      </UButton>
      <UButton icon="i-lucide-rotate-ccw" color="neutral" variant="outline" @click="reset">
        {{ t('toolbar.reset') }}
      </UButton>
    </div>
  </div>
</template>
