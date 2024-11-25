<script lang="ts">
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

export default defineNuxtComponent({
  props: {
    logoUrl: {
      type: String as PropType<string>,
      required: true,
    },
    mainUrl: {
      type: String as PropType<string>,
      required: true,
    },
    siteName: {
      type: String as PropType<string>,
      required: true,
    },
    imageClass: {
      type: String as PropType<string>,
      default: 'tw-max-w-2xl tw-max-h-16',
    },
    target: {
      type: String,
      default: '_blank',
    },
  },
})
</script>

<template>
  <div>
    <a
      :href="mainUrl"
      rel="noopener noreferrer"
      :aria-label="siteName"
      :title="siteName"
      :target="target"
    >
      <img
        :src="logoUrl"
        class="tw-w-auto tw-h-auto" :class="[imageClass]"
        :alt="$t('headerMenu.logo')"
      >
    </a>
  </div>
</template>
