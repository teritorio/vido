<template>
  <h1>
    <a
      :href="mainUrl"
      rel="noopener noreferrer"
      :aria-label="siteName"
      :title="siteName"
      target="_blank"
    >
      <img
        :src="logoUrl"
        :class="['w-auto h-auto', imageClass]"
        :alt="$t('headerMenu.logo')"
      />
    </a>
  </h1>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    logoUrl: {
      type: String,
      required: true,
    },
    mainUrl: {
      type: String,
      required: true,
    },
    siteName: {
      type: String,
      required: true,
    },
    imageClass: {
      type: String,
      default: 'max-w-2xl max-h-16',
    },
  },
})
</script>
