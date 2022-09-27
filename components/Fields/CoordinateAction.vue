<template>
  <ExternalLink
    v-if="isIOS !== undefined && href"
    :href="href"
    target="_blank"
    v-bind="$attrs"
  >
    <slot />
  </ExternalLink>
  <span v-else>
    <slot />
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import ExternalLink from '~/components/UI/ExternalLink.vue'
import { isIOS } from '~/utils/isIOS'

export default Vue.extend({
  components: {
    ExternalLink,
  },

  props: {
    geometry: {
      type: Object as PropType<GeoJSON.Geometry>,
      required: true,
    },
  },

  data(): {
    isIOS: boolean | undefined
  } {
    return {
      isIOS: undefined,
    }
  },

  computed: {
    href(): string | undefined {
      if (isIOS !== undefined && this.geometry.type === 'Point') {
        const lat = this.geometry.coordinates[1]
        const lng = this.geometry.coordinates[0]
        const latLng = `${lat},${lng}`
        return this.isIOS ? `maps://?q=${latLng}` : `geo:${latLng}?q=${latLng}`
      } else {
        return undefined
      }
    },
  },

  mounted() {
    this.isIOS = isIOS()
  },
})
</script>
