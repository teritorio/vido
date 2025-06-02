<script setup lang="ts">
withDefaults(defineProps<{
  logoUrl: string
  mainUrl: string
  siteName: string
  imageClass?: string
  target?: string
}>(), {
  imageClass: 'tw-max-w-2xl tw-max-h-16',
  target: '_blank',
})

const { t } = useI18n()
</script>

<template>
  <a
    class="logo"
    rel="noopener noreferrer"
    :aria-label="siteName"
    :href="mainUrl"
    :title="siteName"
    :target="target"
  >
    <img
      class="tw-w-auto tw-h-auto"
      :src="logoUrl"
      :class="[imageClass]"
      :alt="t('headerMenu.logo')"
    >
  </a>
</template>
