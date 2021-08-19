<template>
  <aside
    class="flex flex-col max-h-full px-5 py-4 space-y-6 bg-white shadow-md pointer-events-auto sm:rounded-xl md:w-96"
  >
    <div class="flex flex-row sm:flex-col items-center sm:items-start h-1/5">
      <h1 class="flex-none sm:hidden mr-2">
        <img :aria-label="siteName" :src="logoUrl" class="w-20 h-auto" />
      </h1>

      <button
        type="button"
        class="hidden sm:flex flex-shrink-0 items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        @click="onGoBackClick"
      >
        <font-awesome-icon icon="arrow-left" class="text-gray-800" size="xs" />
      </button>

      <form
        ref="searchform"
        class="flex-grow relative pointer-events-auto w-full"
        @submit.prevent="onSubmit"
      >
        <section class="relative w-full">
          <input
            :value="searchText"
            class="w-full px-5 py-3 font-medium text-gray-700 placeholder-gray-500 bg-gray-100 border-none rounded-full outline-none appearance-none focus:outline-none focus:ring focus:ring-gray-300"
            placeholder="Recherche"
            type="text"
            @input="
              searchText = $event.target.value
              onSubmit()
            "
          />
          <button
            class="absolute inset-y-0 right-0 px-5 text-gray-800 rounded-r-full outline-none focus:outline-none"
            type="submit"
            :disabled="isLoading"
          >
            <font-awesome-icon v-if="!isLoading" icon="search" />
            <font-awesome-icon v-else icon="spinner" class="animate-spin" />
          </button>
        </section>
      </form>
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
        v-if="itemsClasse.length > 0"
        label="Catégories"
        icon="layer-group"
        :items="itemsClasse"
        @item-click="onCategoryClick"
      />

      <SearchResultBlock
        v-if="itemsCities.length > 0"
        label="Communes"
        icon="city"
        :items="itemsCities"
        @item-click="onAddressClick"
      />

      <SearchResultBlock
        v-if="itemsTis.length > 0"
        label="Points d'intérêts (TIS)"
        icon="map-marker-alt"
        :items="itemsTis"
        @item-click="onPoiClick"
      />

      <SearchResultBlock
        v-if="itemsOsm.length > 0"
        label="Points d'intérêts (OSM)"
        icon="map-marker-alt"
        :items="itemsOsm"
        @item-click="onPoiClick"
      />

      <SearchResultBlock
        v-if="itemsAddress.length > 0"
        label="Adresses"
        icon="home"
        :items="itemsAddress"
        @item-click="onAddressClick"
      />

      <p v-if="hasNoResults">Aucun résultat</p>
    </div>
  </aside>
</template>

<script lang="ts">
import copy from 'fast-copy'
import debounce from 'lodash.debounce'
import Vue, { PropType } from 'vue'

import SearchResultBlock from '@/components/SearchResultBlock.vue'
import { toTitleCase } from '@/utils/string'
import {
  ApiSearchResults,
  ApiAddrSearchResult,
  SearchResult,
  Category,
} from '@/utils/types'

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
      type: Object as PropType<{ [menuId: string]: string }>,
      required: true,
    },
    selectionZoom: {
      type: Object as PropType<{ [selection: string]: number }>,
      required: true,
    },
  },

  data(): {
    searchText: string
    searchResults: null | ApiSearchResults
    isLoading: boolean
    debouncedSearch: Function
  } {
    return {
      searchText: '',
      searchResults: null,
      isLoading: false,
      debouncedSearch: debounce(() => {
        if (
          !this.isLoading &&
          this.searchText &&
          this.searchText.trim().length >= 3
        ) {
          this.isLoading = true
          fetch(
            `${this.$config.API_ENDPOINT}/geodata/v1/search?q=${this.searchText}`
          )
            .then((data) => data.json())
            .then((data) => {
              this.searchResults = data
              this.isLoading = false
            })
        }
      }, 1000),
    }
  },

  computed: {
    hasNoResults() {
      return (
        this.itemsClasse.length === 0 &&
        this.itemsOsm.length === 0 &&
        this.itemsTis.length === 0 &&
        this.itemsAddress.length === 0 &&
        this.itemsCities.length === 0
      )
    },

    itemsClasse(): SearchResult[] {
      return this.searchResults && Array.isArray(this.searchResults.classe)
        ? this.searchResults.classe.map((v) => ({
            id: v.idmenu,
            label: v.label,
            icon: this.menuToIcon[v.idmenu],
          }))
        : []
    },

    itemsOsm(): SearchResult[] {
      return this.searchResults && Array.isArray(this.searchResults.osm)
        ? this.searchResults.osm.map((v) => ({
            id: v.postid.toString(),
            label: v.label,
            icon: this.menuToIcon[v.idmenu],
            small: v.commune && toTitleCase(v.commune),
          }))
        : []
    },

    itemsTis(): SearchResult[] {
      return this.searchResults && Array.isArray(this.searchResults.tis)
        ? this.searchResults.tis.map((v) => ({
            id: v.postid.toString(),
            label: v.label,
            icon: this.menuToIcon[v.idmenu],
            small: v.commune && toTitleCase(v.commune),
          }))
        : []
    },

    itemsCities(): SearchResult[] {
      if (
        !this.searchResults ||
        !Array.isArray(this.searchResults.municipality)
      ) {
        return []
      }

      return this.searchResults.municipality.map((v) => ({
        id: v.ID,
        label: v.label,
      }))
    },

    itemsAddress(): SearchResult[] {
      if (!this.searchResults || !Array.isArray(this.searchResults.adress)) {
        return []
      }

      return this.searchResults.adress.map((v) => ({
        id: v.ID,
        label: v.label,
      }))
    },

    addressResults(): ApiAddrSearchResult[] {
      return this.searchResults
        ? (Array.isArray(this.searchResults.municipality)
            ? this.searchResults.municipality
            : []
          ).concat(
            Array.isArray(this.searchResults.adress)
              ? this.searchResults.adress
              : []
          )
        : []
    },
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

    onCategoryClick(id: Category['id']) {
      this.$emit('category-click', id)
      this.reset()
    },

    onPoiClick(id: string) {
      this.$emit('poi-click', id)
      this.reset()
    },

    onAddressClick(id: string) {
      let feature = this.addressResults.find((a) => a.ID === id)?.geojson
      const isCity =
        (this.searchResults && Array.isArray(this.searchResults.municipality)
          ? this.searchResults.municipality
          : []
        ).find((a) => a.ID === id) !== undefined
      if (feature) {
        feature = copy(feature)
        if (!feature.properties) {
          feature.properties = {}
        }
        feature.properties.faIcon = 'home'
        feature.properties.class = 'Adresse'
        feature.properties.vido_zoom = isCity
          ? this.selectionZoom.zoom_commune
          : this.selectionZoom.zoom_ban
        this.$emit('feature-click', feature)
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
      this.debouncedSearch()
    },
  },
})
</script>
