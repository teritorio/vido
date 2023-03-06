<template>
  <ExternalLink
    v-if="phone"
    :href="`tel:${number}`"
    :title="$t('fields.phone.callNumber')"
  >
    {{ numberFormated }}
  </ExternalLink>
  <span v-else>
    {{ numberFormated }}
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { useNuxtApp } from '#app'
import ExternalLink from '~/components/UI/ExternalLink.vue'

export default defineComponent({
  components: {
    ExternalLink,
  },

  props: {
    number: {
      type: String as PropType<string>,
      default: null,
    },
  },

  data(): {
    phone: boolean
  } {
    return {
      phone: true,
    }
  },

  computed: {
    numberFormated(): string {
      return this.number.replaceAll(' ', ' ')
    },
  },

  mounted() {
    // Do not use $screen.phone directly in template. De-sync DROM from SSR.
    const { $screen } = useNuxtApp()
    this.phone = $screen.phone
  },
})
</script>
