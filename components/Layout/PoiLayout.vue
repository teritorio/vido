<template>
  <div class="w-full container">
    <div>
      <Header
        :theme="settings.themes[0]"
        :nav-menu-entries="navMenuEntries"
        :color-line="colorLine"
      >
        <slot name="headerButtons"></slot>
      </Header>
      <div class="flex justify-center">
        <TeritorioIconBadge :color-fill="colorFill" size="2xl" :picto="icon" />
      </div>
      <h1>{{ name }}</h1>
      <slot name="actions"></slot>
      <slot name="body"></slot>
      <Footer :attributions="settings.attributions" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import Footer from '~/components/Layout/Footer.vue'
import Header from '~/components/Layout/Header.vue'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { ContentEntry } from '~/lib/apiContent'
import { Settings } from '~/lib/apiSettings'

export default Vue.extend({
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
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    colorLine: {
      type: String,
      required: true,
    },
    colorFill: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '~/assets/details.scss';

:deep(body) {
  color: $color-text;
  background-color: #fefefe;
  padding: 1rem 1rem;
  min-width: 21rem;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  line-height: 1.3;
  word-wrap: break-word;
  @extend .font-light;
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
