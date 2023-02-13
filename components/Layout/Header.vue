<template>
  <header id="header">
    <Logo
      id="logo"
      :main-url="mainUrl"
      :site-name="theme && theme.title.fr"
      :logo-url="theme && theme.logo_url"
    />

    <div class="tw-flex tw-justify-end">
      <slot></slot>
      <NavMenu :entries="navMenuEntries" class="print:hidden" />
    </div>
  </header>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import NavMenu from '~/components/MainMap/NavMenu.vue'
import Logo from '~/components/UI/Logo.vue'
import { ContentEntry } from '~/lib/apiContent'
import { SiteInfosTheme } from '~/lib/apiSettings'
import { siteStore } from '~/stores/site'

export default defineNuxtComponent({
  components: {
    Logo,
    NavMenu,
  },
  props: {
    theme: {
      type: Object as PropType<SiteInfosTheme>,
      default: null,
    },
    navMenuEntries: {
      type: Array as PropType<ContentEntry[]>,
      required: true,
    },
  },
  computed: {
    ...mapState(siteStore, ['locale']),

    mainUrl(): string {
      return (this.locale && this.theme.main_url?.[this.locale]) || ''
    },
  },
})
</script>

<style lang="scss" scoped>
@import '~/assets/details.scss';

#header {
  display: flex;
  flex-direction: row;
  overflow: visible;
  // height: 8.6rem;
  // min-height: 8.6rem;
  align-items: center;
  justify-content: space-between;
  // padding: 0.8rem 1.3rem;

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

  @media (max-width: 600px) {
    height: 6rem;

    & {
      min-height: 6rem;
    }

    #logo :deep(img) {
      height: 3.3rem;
    }
  }

  @media only screen and (max-width: 767px) {
    #header #logo :deep(img) {
      max-height: 80px;
      max-width: 193px;
      margin-left: -1.3rem;
    }
  }
}
</style>
