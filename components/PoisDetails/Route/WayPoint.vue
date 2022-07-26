<template>
  <div>
    <TeritorioIconBadge
      :color-fill="
        point.properties.display && point.properties.display.color_fill
      "
      :picto="point.properties.display && point.properties.display.icon"
      :image="point.properties['image:thumbnail']"
    />
    <h3 v-if="point.properties.name">{{ point.properties.name }}</h3>
    <p v-if="point.properties.description">
      {{ point.properties.description }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { MapPoi } from '~/lib/mapPois'

export default Vue.extend({
  components: {
    TeritorioIconBadge,
  },

  props: {
    point: {
      type: Object as PropType<MapPoi>,
      required: true,
    },
  },
})
</script>
