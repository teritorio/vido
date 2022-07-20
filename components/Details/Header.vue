<template>
  <header id="header">
    <div id="logo">
      <a :href="theme && theme.mail_url">
        <p class="img-logo">
          <img :src="theme && theme.logo_url" :alt="theme && theme.title.fr" />
        </p>
      </a>
    </div>

    <div class="flex justify-end">
      <slot />
      <NavMenu :entries="navMenuEntries" class="ml-3 sm:ml-9" />
    </div>
  </header>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import NavMenu from '~/components/MainMap/NavMenu.vue'
import { ContentEntry } from '~/lib/apiContent'
import { SiteInfosTheme } from '~/lib/apiSettings'

export default Vue.extend({
  components: {
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

    img {
      height: 5rem;
    }
  }

  @media (max-width: 600px) {
    height: 6rem;

    & {
      min-height: 6rem;
    }

    #logo img {
      height: 3.3rem;
    }
  }

  @media only screen and (max-width: 767px) {
    #header #logo img {
      max-height: 80px;
      max-width: 193px;
      margin-left: -1.3rem;
    }
  }
}
</style>
