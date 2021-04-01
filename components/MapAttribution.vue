<template>
  <div class="attribution-wrapper">
    <button
      type="button"
      class="absolute w-6 h-6 text-gray-800 transition-opacity bg-white rounded-full shadow-sm outline-none opacity-100 pointer-events-auto hover:bg-gray-100 focus-visible:bg-gray-100 focus:outline-none bottom-3 right-3 sm:opacity-0 sm:pointer-events-none"
    >
      <font-awesome-icon icon="info" class="fa-xs" />
    </button>

    <aside
      class="absolute bottom-0 right-0 px-2 py-1 m-3 text-xs text-center text-gray-800 transition-opacity bg-white rounded-sm shadow-sm opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto"
    >
      <p>
        {{ mapConfig.attribution.fr }} &bull; &copy; Contributeurs de
        <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
        &bull; Réalisation <a href="https://www.teritorio.fr/">Teritorio</a>
      </p>
    </aside>
  </div>
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

<style>
.attribution-wrapper:focus-within aside {
  opacity: 1;
  pointer-events: auto;
}

.attribution-wrapper:focus-within button {
  opacity: 0;
  pointer-events: none;
}
</style>
