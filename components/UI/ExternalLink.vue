<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
  },

  props: {
    href: {
      type: String as PropType<string>,
      required: true,
    },
    title: {
      type: String as PropType<string>,
      default: null,
    },
    target: {
      type: String as PropType<string>,
      default: '_blank',
    },
    rel: {
      type: String as PropType<string>,
      default: null,
    },
    icon: {
      type: String as PropType<string>,
      default: null,
    },
  },

  computed: {
    iconDefault(): string {
      if (this.icon)
        return this.icon
      else if (this.href.startsWith('tel:'))
        return 'phone'
      else
        return 'external-link-alt'
    },
  },
})
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :target="target"
    :rel="rel"
    :title="title"
    class="tw-flex tw-flex-row tw-items-center tw-gap-x-2.5 tw-underline tw-underline-offset-4"
  >
    <FontAwesomeIcon :icon="iconDefault" color="inherit" size="sm" />
    <slot />
  </a>
</template>
