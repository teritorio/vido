<template>
  <section class="py-4 px-1 sm:px-6 sticky top-0 z-50 bg-white">
    <header>
      <div class="flex justify-between align-center">
        <p class="text-lg flex-auto">{{ $tc('favorites.notebook.title') }}</p>

        <button
          type="button"
          class="flex-none hover:bg-zinc-200 flex items-center border-solid border-zinc-300 border-2 bg-white focus:outline-none focus-visible:bg-zinc-100 py-2 px-4 rounded-full h-11"
          @click="$emit('on-close')"
        >
          <font-awesome-icon
            ref="menu_icon"
            icon="times"
            class="text-zinc-500 sm:mr-2"
            size="sm"
          />
          <p class="hidden sm:block">{{ $tc('favorites.notebook.close') }}</p>
        </button>
      </div>
      <div class="flex justify-around align-center mb-8">
        <div class="flex-auto menu-actions">
          <button
            type="button"
            class="hover:bg-zinc-200 rounded-full px-4 py-2 text-sm leading-5 text-left text-zinc-700 transition duration-150 ease-in-out focus:outline-none focus:bg-zinc-100"
            role="menuitem"
            @blur="blurHandler"
            @click="setShareLink()"
          >
            <font-awesome-icon
              ref="menu_icon"
              icon="share-alt"
              class="text-zinc-500 mr-2"
              size="sm"
            />
            {{ $tc('favorites.menu_share') }}
          </button>
          <a
            :href="pdfLink"
            target="_blank"
            class="hover:bg-zinc-200 rounded-full px-4 py-2 text-sm leading-5 text-left text-zinc-700 transition duration-150 ease-in-out focus:outline-none focus:bg-zinc-100"
            role="menuitem"
            @blur="blurHandler"
            @click="exportLink('export_pdf')"
          >
            <font-awesome-icon
              ref="menu_icon"
              icon="file-pdf"
              class="text-zinc-500 mr-2"
              size="sm"
            />
            {{ $tc('favorites.export_pdf') }}
          </a>
          <a
            :href="csvLink"
            target="_blank"
            class="hover:bg-zinc-200 rounded-full px-4 py-2 text-sm leading-5 text-left text-zinc-700 transition duration-150 ease-in-out focus:outline-none focus:bg-zinc-100"
            role="menuitem"
            @blur="blurHandler"
            @click="exportLink('export_csv')"
          >
            <font-awesome-icon
              ref="menu_icon"
              icon="file-arrow-down"
              class="text-zinc-500 mr-2"
              size="sm"
            />
            {{ $tc('favorites.export_csv') }}
          </a>
          <button
            class="hover:bg-zinc-200 rounded-full px-4 py-2 text-sm leading-5 text-left text-zinc-700 transition duration-150 ease-in-out focus:outline-none focus:bg-zinc-100"
            role="menuitem"
            @blur="blurHandler"
            @click="removeFavorites()"
          >
            <font-awesome-icon
              ref="menu_icon"
              icon="trash"
              class="text-zinc-500 mr-2"
              size="sm"
            />
            {{ $tc('favorites.menu_clear') }}
          </button>
        </div>
      </div>
    </header>
    <main>
      <PoisDeck
        v-if="favs"
        :pois="favs"
        :notebook="true"
        :explorer-mode-enabled="explorerModeEnabled"
        :favorites-mode-enabled="true"
        @explore-click="exploreAroundSelectedPoi"
        @favorite-click="$emit('favorite-click', $event)"
        @zoom-click="goToSelectedPoi"
      />
    </main>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import { ApiPoi, getPois } from '~/lib/apiPois'

export default Vue.extend({
  components: {
    PoisDeck,
  },
  props: {
    exploreAroundSelectedPoi: {
      type: Function,
      required: true,
    },
    goToSelectedPoi: {
      type: Function,
      required: true,
    },
    explorerModeEnabled: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      isModeFavorites: 'map/isModeFavorites',
      favoritesIds: 'favorite/favoritesIds',
    }),
    pdfLink(): string {
      return `${this.$vidoConfig().API_EXPORT}/${
        this.$vidoConfig().API_PROJECT
      }/${
        this.$vidoConfig().API_THEME
      }/pois/favorites.pdf?ids=${this.favoritesIds.join(',')}`
    },

    csvLink(): string {
      return `${this.$vidoConfig().API_ENDPOINT}/${
        this.$vidoConfig().API_PROJECT
      }/${this.$vidoConfig().API_THEME}/pois.csv?ids=${this.favoritesIds.join(
        ','
      )}`
    },
  },
  data(): {
    isCopied: boolean
    favs: ApiPoi[]
  } {
    return {
      isCopied: false,
      favs: [],
    }
  },
  mounted() {
    this.getFavs()
  },
  methods: {
    runActionAndClose(callbackFunction: Function) {
      // callbackFunction()
      console.log('callbackFunction', callbackFunction)
      this.$emit('close')
    },
    async fetchFavorites(ids: [string]) {
      return await getPois(
        this.$vidoConfig().API_ENDPOINT,
        this.$vidoConfig().API_PROJECT,
        this.$vidoConfig().API_THEME,
        ids
      ).then((pois) => (pois && pois.features) || [])
    },

    explore(poi?: ApiPoi) {
      this.$emit('close')
      this.$emit('explore-click')
    },
    goTo(poi?: ApiPoi) {
      this.$emit('close')
      this.$emit('go-to-selected-poi', poi)
    },
    async getFavs() {
      try {
        await this.fetchFavorites(this.favoritesIds).then((res) => {
          this.favs = res
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    },
    removeFavorites() {
      try {
        this.$store.dispatch('favorite/setFavorites', [])
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Vido error:', e.message)
      }
    },
    setShareLink() {
      this.$emit('set-share-link')
    },
    exportLink(w: 'export_pdf' | 'export_csv') {
      this.$tracking({
        type: 'favorites_event',
        event: w,
      })
    },
    blurHandler() {
      console.log('blur')
    },
  },
})
</script>
