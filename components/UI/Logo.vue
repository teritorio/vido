<template>
  <div>
    <a
      :href="mainUrl"
      rel="noopener noreferrer"
      :aria-label="siteName"
      :title="siteName"
      target="_blank"
    >
      <img
        :src="logoUrl"
        :class="['tw-w-auto tw-h-auto', imageClass]"
        :alt="$t('headerMenu.logo')"
      />
    </a>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'

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
  },
})
</script>
