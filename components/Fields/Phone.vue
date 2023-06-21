<template>
  <client-only>
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
  </client-only>
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

  computed: {
    numberFormated(): string {
      return this.number.replaceAll(' ', ' ')
    },

    phone(): boolean {
      return this.$device.value.phone
    },
  },
})
</script>
