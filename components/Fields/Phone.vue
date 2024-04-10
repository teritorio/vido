<script lang="ts">
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import ExternalLink from '~/components/UI/ExternalLink.vue'
import useDevice from '~/composables/useDevice'

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

  setup() {
    const device = useDevice()

    return {
      device,
    }
  },

  computed: {
    numberFormated(): string {
      return this.number.replaceAll(' ', ' ')
    },
  },
})
</script>

<template>
  <client-only>
    <ExternalLink
      v-if="device.phone"
      :href="`tel:${number}`"
      :title="$t('fields.phone.callNumber')"
    >
      {{ numberFormated }}
    </ExternalLink>
    <span v-else>
      {{ numberFormated }}
    </span>
  </client-only>
</template>
