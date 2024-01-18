<script lang="ts">
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import Footer from '~/components/Layout/Footer.vue'
import Header from '~/components/Layout/Header.vue'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import type { ContentEntry } from '~/lib/apiContent'
import type { Settings } from '~/lib/apiSettings'

export default defineNuxtComponent({
  components: {
    Header,
    TeritorioIconBadge,
    Footer,
  },

  props: {
    settings: {
      type: Object as PropType<Settings>,
      required: true,
    },
    navMenuEntries: {
      type: Array as PropType<ContentEntry[]>,
      required: true,
    },
    name: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    icon: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    colorLine: {
      type: String as PropType<string>,
      required: true,
    },
    colorFill: {
      type: String as PropType<string>,
      required: true,
    },
  },
})
</script>

<template>
  <div class="tw-w-full container">
    <div>
      <Header
        :theme="settings.themes[0]"
        :nav-menu-entries="navMenuEntries"
        :color-line="colorLine"
      >
        <slot name="headerButtons" />
      </Header>
      <div v-if="icon" class="tw-flex tw-justify-center">
        <TeritorioIconBadge :color-fill="colorFill" size="2xl" :picto="icon" />
      </div>
      <h1 class="print:tw-pb-4">
        {{ name }}
      </h1>
      <slot name="actions" />
      <slot name="body" />
      <Footer :attributions="settings.attributions">
        <slot name="footer" />
      </Footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/details';

:deep(body) {
  color: $color-text;
  background-color: #fefefe;
  padding: 1rem 1rem;
  min-width: 21rem;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  line-height: 1.3;
  word-wrap: break-word;
  @extend %font-light;
}

:deep(h1) {
  font-size: 2.4rem;
  text-align: center;
  margin: 0.6rem 0.3rem 0;
  text-transform: uppercase;
}

:deep(h2) {
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 0.7rem;
  text-transform: uppercase;
}

:deep(h3) {
  font-size: 1.2rem;
  margin-top: 1.2rem;
  margin-bottom: 0.7rem;
}
</style>
