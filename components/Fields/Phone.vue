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
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import ExternalLink from '~/components/UI/ExternalLink.vue'

export default defineNuxtComponent({
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
    // Do not use $device.phone directly in template. De-sync DROM from SSR.
    this.phone = this.$device.phone
  },
})
</script>
