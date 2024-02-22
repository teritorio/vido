<template>
  <div class="stars-data tw-text-amber-500 tw-mb-1">
    <FontAwesomeIcon
      v-for="(_item, index) in numericProp"
      :key="index"
      icon="star"
    />
    {{ isSNotation ? 'S' : '' }}
  </div>
</template>

<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'

enum StarsEnum {
  One = '1',
  OneS = '1S',
  Two = '2',
  TwoS = '2S',
  Three = '3',
  ThreeS = '3S',
  Four = '4',
  FourS = '4S',
  Five = '5',
  FiveS = '5S',
}

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
  },

  props: {
    stars: {
      type: String as PropType<StarsEnum>,
      required: true,
    },
  },
  computed: {
    isSNotation(): boolean {
      return Boolean(this.stars.includes('S'))
    },
    numericProp(): number {
      let stars: string = this.stars
      if (this.isSNotation) stars = this.stars.slice(0, -1)

      return Number(stars)
    },
  },
})
</script>
