<script setup lang="ts">
import { storeToRefs } from 'pinia'
import NavMenu from '~/components/MainMap/NavMenu.vue'
import Logo from '~/components/UI/Logo.vue'
import type { SiteInfosTheme } from '~/lib/apiSettings'
import { siteStore as useSiteStore } from '~/stores/site'

const siteStore = useSiteStore()
const { settings } = siteStore
const { locale } = storeToRefs(siteStore)

if (!settings)
  throw createError({ statusCode: 500, statusMessage: 'Failed to fetch settings', fatal: true })

const theme = ref<SiteInfosTheme>(settings.themes[0])
const mainUrl = computed(() => (locale.value && theme.value.main_url?.[locale.value]) || '/')
const target = computed(() => (locale.value && theme.value.main_url?.[locale.value]) ? '_blank' : '_self')
</script>

<template>
  <header id="header">
    <Logo
      id="logo"
      :main-url="mainUrl"
      :target="target"
      :site-name="theme.title.fr"
      :logo-url="theme.logo_url"
    />
    <slot name="search" />
    <div class="tw-flex tw-justify-end print:tw-hidden">
      <slot />
      <NavMenu />
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import '~/assets/details';

#header {
  display: flex;
  flex-direction: row;
  overflow: visible;
  align-items: center;
  justify-content: space-between;

  &::before,
  &::after {
    display: none;
  }

  #logo {
    margin: 0;
    float: inherit;

    :deep(img) {
      height: 5rem;
    }
  }

  @media (width <= 600px) {
    height: 6rem;

    & {
      min-height: 6rem;
    }

    #logo :deep(img) {
      height: 3.3rem;
    }
  }

  @media only screen and (width <= 767px) {
    #header #logo :deep(img) {
      max-height: 80px;
      max-width: 193px;
      margin-left: -1.3rem;
    }
  }
}
</style>
