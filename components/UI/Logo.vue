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

<style lang="css" scoped>
@media (width < 768px) {
  a {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background-color: #FFF;
    box-shadow: 0 1px 2px rgb(0 0 0 / 10%), 0 1px 3px rgb(0 0 0 / 10%);
    border-radius: 0.75rem;
    padding: 1rem;
  }
}
</style>
