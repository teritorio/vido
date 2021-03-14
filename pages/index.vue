<template>
  <div class="w-full h-full">
    <Map v-if="!!mapConfig" class="absolute" />

    <div
      class="fixed top-0 bottom-0 flex flex-col w-full h-full max-w-md p-4 space-y-4 pointer-events-none"
    >
      <aside
        class="px-5 py-4 space-y-12 bg-white shadow-md pointer-events-auto rounded-xl"
      >
        <div class="flex items-center justify-between">
          <h1>
            <Logo
              :aria-label="siteConfig ? siteConfig.fr.name : ''"
              class="h-auto w-36"
            />
          </h1>

          <button
            type="button"
            class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
          >
            <font-awesome-icon icon="minus" class="text-gray-800 fa-xs" />
          </button>
        </div>

        <HeaderSearch class="flex-none pointer-events-auto" />
        <HeaderCategories class="flex-1 pointer-events-auto" />
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

import HeaderCategories from '@/components/HeaderCategories.vue'
import HeaderSearch from '@/components/HeaderSearch.vue'
import Logo from '@/components/Logo/Logo.vue'
import Map from '@/components/Map.vue'

export default Vue.extend({
  components: {
    HeaderCategories,
    HeaderSearch,
    Logo,
    Map,
  },
  computed: {
    ...mapGetters({
      mapConfig: 'config/map',
    }),
    ...mapGetters({
      siteConfig: 'config/site',
    }),
  },
  mounted() {
    this.fetchConfigFromAPI()
  },
  methods: {
    ...mapActions({
      fetchConfigFromAPI: 'config/fetch',
    }),
  },
})
</script>
