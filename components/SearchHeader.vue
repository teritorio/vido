<template>
  <aside
    class="flex flex-col max-h-full px-5 py-4 space-y-6 bg-white shadow-md pointer-events-auto sm:rounded-xl md:w-96"
  >
    <div class="flex flex-row sm:flex-col items-center sm:items-start">
      <h1 v-if="!isExplorerFavorite" class="flex-none sm:hidden mr-2">
        <img
          :aria-label="siteName"
          :src="logoUrl"
          class="w-auto h-auto max-w-2xl max-h-12 sm:max-h-16"
        />
      </h1>

      <button
        type="button"
        class="hidden sm:flex flex-shrink-0 items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        @click="onGoBackClick"
      >
        <font-awesome-icon icon="arrow-left" class="text-gray-800" size="xs" />
      </button>

      <form
        v-if="!isExplorerFavorite"
        ref="searchform"
        class="flex-grow relative pointer-events-auto w-full"
        @submit.prevent="onSubmit"
      >
        <section class="relative w-full">
          <input
            ref="search"
            :value="searchText"
            class="w-full px-5 py-3 font-medium text-gray-700 placeholder-gray-500 bg-gray-100 border-none rounded-full outline-none appearance-none focus:outline-none focus:ring focus:ring-gray-300"
            :placeholder="$tc('headerMenu.search')"
            type="text"
            @input="
              searchText = $event.target.value
              onSubmit()
            "
            @focus="$tracking({ type: 'search' })"
          />
          <button
            class="absolute inset-y-0 right-0 px-5 text-gray-800 rounded-r-full outline-none focus:outline-none"
            type="submit"
            :disabled="isLoading"
            @click="focusSearch"
          >
            <font-awesome-icon v-if="!isLoading" icon="search" />
            <font-awesome-icon v-else icon="spinner" class="animate-spin" />
          </button>
        </section>
      </form>
      <div v-else class="flex items-center ml-2">
        <button
          type="button"
          class="flex flex-shrink-0 items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
          @click="goToCategories"
        >
          <font-awesome-icon
            icon="arrow-left"
            class="text-gray-800"
            size="xs"
          />
        </button>
        <p class="ml-2">
          {{
            $tc(
              isFavorite ? 'headerMenu.myFavorites' : 'headerMenu.exploration'
            )
          }}
        </p>
      </div>
    </div>

    <button
      v-if="searchResults"
      type="button"
      class="sm:hidden flex-shrink-0 w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
      @click="reset"
    >
      <font-awesome-icon icon="arrow-left" class="text-gray-800" size="xs" />
    </button>

    <div v-if="searchResults" class="overflow-y-auto">
      <SearchResultBlock
        v-if="itemsMenuItems.length > 0"
        type="category"
        :label="$tc('headerMenu.categories')"
        icon="layer-group"
        :items="itemsMenuItems"
        @item-click="onCategoryClick"
      />

      <SearchResultBlock
        v-if="itemsPois.length > 0"
        type="pois"
        :label="$tc('headerMenu.pois')"
        icon="map-marker-alt"
        :items="itemsPois"
        @item-click="onPoiClick"
      />

      <SearchResultBlock
        v-if="itemsAddress.length > 0"
        type="addresse"
        :label="$tc('headerMenu.addresses')"
        icon="home"
        :items="itemsAddress"
        @item-click="onAddressClick"
      />

      <SearchResultBlock
        v-if="itemsCartocode.length > 0"
        type="cartocode"
        :label="$tc('headerMenu.cartocode')"
        icon="map-marker-alt"
        :items="itemsCartocode"
        @item-click="onPoiClick"
      />

      <p v-if="results == 0">
        {{ $tc('headerMenu.noResult') }}
      </p>
    </div>
  </aside>
</template>

<script lang="ts">
import debounce from 'lodash.debounce'
import Vue, { PropType } from 'vue'

import SearchResultBlock from '@/components/SearchResultBlock.vue'
import { ApiSearchResults, SearchResult } from '@/utils/types'

export default Vue.extend({
  components: {
    SearchResultBlock,
  },

  props: {
    logoUrl: {
      type: String,
      required: true,
    },
    siteName: {
      type: String,
      required: true,
    },
    menuToIcon: {
      type: Object as PropType<{ [id: string]: string }>,
      required: true,
    },
    selectionZoom: {
      type: Object as PropType<{ [selection: string]: number }>,
      required: true,
    },
    isExplorerFavorite: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },

  data(): {
    searchText: string
    searchResults: null | ApiSearchResults
    isLoading: boolean
  } {
    return {
      searchText: '',
      searchResults: null,
      isLoading: false,
    }
  },

  computed: {
    itemsMenuItems(): SearchResult[] {
      return (
        this.searchResults?.menu_items.features?.map((v) => ({
          id: v.properties.id,
          label: v.properties.label,
          icon: this.menuToIcon[v.properties.id],
        })) || []
      )
    },

    itemsPois(): SearchResult[] {
      return (
        this.searchResults?.pois.features?.map((v) => ({
          id: v.properties.id,
          label: v.properties.label,
          icon: v.properties.icon,
          small: v.properties.city,
        })) || []
      )
    },

    itemsAddress(): SearchResult[] {
      return (
        this.searchResults?.addresses.features?.map((v) => ({
          id: v.properties.id,
          label: v.properties.label,
        })) || []
      )
    },

    itemsCartocode(): SearchResult[] {
      if (!this.searchResults?.cartocode) {
        return []
      }

      const goodCartocode = Array.isArray(this.searchResults.cartocode)
        ? this.searchResults.cartocode
        : [this.searchResults.cartocode]

      return goodCartocode.map((v) => ({
        id: v.postid,
        label: v.label,
      }))
    },

    results(): Number {
      return (
        this.itemsMenuItems.length +
        this.itemsPois.length +
        this.itemsAddress.length +
        this.itemsCartocode.length
      )
    },
  },

  watch: {
    itemsCartocode(val) {
      if (val.length === 1 && this.results === 1) {
        this.onPoiClick(val[0].id)
      }
    },
  },

  created() {
    this.search = debounce(this.search, 1000)
  },

  mounted() {
    if (!this.$isMobile()) {
      this.focusSearch()
    }
  },

  methods: {
    reset() {
      this.isLoading = false
      this.searchResults = null
      this.searchText = ''
    },

    onGoBackClick() {
      this.$emit('go-back-click')
    },

    goToCategories() {
      this.$emit('go-to-categories')
    },

    onCategoryClick(id: number) {
      if (this.searchResults?.menu_items) {
        const filter = this.searchResults.menu_items.features.find(
          (a) => a.properties.id === id
        )

        this.$emit('category-click', filter)
        this.reset()
      }
    },

    onPoiClick(id: string) {
      this.$emit('poi-click', id)
      this.reset()
    },

    focusSearch() {
      ;(this.$refs.search as HTMLInputElement).focus()
    },

    onAddressClick(id: number) {
      const feature = (this.searchResults?.addresses.features || []).find(
        (a) => a.properties.id === id
      )
      if (feature) {
        const f = Object.assign({}, feature, {
          faIcon: 'home',
          class: 'Adresse',
          vido_zoom:
            feature.properties.type === 'municipality'
              ? this.selectionZoom.zoom_commune
              : this.selectionZoom.zoom_ban,
        })
        this.$emit('feature-click', f)
      }
      this.reset()
    },

    onSubmit() {
      // Reset results if empty search text
      if (
        !this.isLoading &&
        (!this.searchText || this.searchText.trim().length === 0)
      ) {
        this.searchResults = null
      }

      // Launch search if not already loading + search text length >= 3
      this.search()
    },

    search() {
      if (
        !this.isLoading &&
        this.searchText &&
        this.searchText.trim().length >= 2
      ) {
        this.isLoading = true
        fetch(
          `${this.$config.API_ENDPOINT}/${this.$config.API_PROJECT}/${this.$config.API_THEME}/search?q=${this.searchText}`
        )
          .then((data) => data.json())
          .then((data) => {
            this.searchResults = data
            this.isLoading = false
          })
      }
    },
  },
})
</script>
