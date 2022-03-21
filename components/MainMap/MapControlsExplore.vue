<template>
  <button
    :aria-label="$tc('mapControls.exploreAriaLabel')"
    :title="$tc('mapControls.exploreButton')"
    type="button"
    :class="[
      'hidden sm:block text-sm font-bold rounded-full shadow-md w-11 h-11 outline-none focus:outline-none ',
      isModeExplorer &&
        'bg-blue-500 hover:bg-blue-400 focus-visible:bg-blue-400',
      !isModeExplorer && 'bg-white hover:bg-gray-100 focus-visible:bg-gray-100',
    ]"
    @click="toggleMode"
  >
    <font-awesome-icon
      icon="eye"
      :class="[
        isModeExplorer && 'text-white',
        !isModeExplorer && 'text-gray-800',
      ]"
      size="lg"
    />
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

import { Mode } from '@/utils/types'

export default Vue.extend({
  computed: {
    ...mapGetters({
      isModeExplorer: 'map/isModeExplorer',
    }),
  },

  methods: {
    ...mapActions({
      setMode: 'map/setMode',
    }),
    toggleMode() {
      this.$tracking({ type: 'map_control_event', event: 'explorer' })
      this.setMode(this.isModeExplorer ? Mode.BROWSER : Mode.EXPLORER)
    },
  },
})
</script>
