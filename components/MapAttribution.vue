<template>
  <aside
    class="absolute px-2 py-1 text-xs text-gray-800 bg-white rounded-sm shadow-sm bottom-3 right-3"
  >
    <p>
      {{ mapConfig.attribution.fr }} &bull; &copy; C.D.T. 40 &bull; &copy;
      Contributeurs de
      <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &bull;
      Réalisation <a href="https://www.teritorio.fr/">Teritorio</a>
    </p>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters({
      mapConfig: 'config/map',
    }),
  },
})
</script>
