<template>
  <a
    v-if="href"
    :href="href"
    :target="target"
    :rel="rel"
    :title="title"
    class="flex flex-row items-center gap-x-2.5 underline underline-offset-4"
  >
    <font-awesome-icon :icon="iconDefault" color="inherit" size="sm" />
    <slot></slot>
  </a>
</template>

<script lang="ts">
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
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
      if (this.icon) {
        return this.icon
      } else if (this.href.startsWith('tel:')) {
        return 'phone'
      } else {
        return 'external-link-alt'
      }
    },
  },
})
</script>
