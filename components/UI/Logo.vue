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
        :class="['w-auto h-auto', imageClass]"
        :alt="$t('headerMenu.logo')"
      />
    </a>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
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
      default: 'max-w-2xl max-h-16',
    },
  },
})
</script>
