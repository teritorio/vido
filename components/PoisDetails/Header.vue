<template>
  <header id="header">
    <Logo
      id="logo"
      :main-url="mainUrl"
      :site-name="theme && theme.title.fr"
      :logo-url="theme && theme.logo_url"
    />

    <div class="flex justify-end">
      <slot />
      <NavMenu :entries="navMenuEntries" />
    </div>
  </header>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import NavMenu from '~/components/MainMap/NavMenu.vue'
import Logo from '~/components/UI/Logo.vue'
import { ContentEntry } from '~/lib/apiContent'
import { SiteInfosTheme } from '~/lib/apiSettings'

export default Vue.extend({
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
    ...mapGetters({
      local: 'site/locale',
    }),
    mainUrl(): string {
      return this.theme.main_url?.[this.local] || ''
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
