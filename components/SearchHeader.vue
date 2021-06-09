<template>
  <aside
    class="flex flex-col min-w-full max-h-full px-5 py-4 space-y-6 bg-white shadow-md pointer-events-auto rounded-xl"
    style="min-width: 300px"
  >
    <button
      type="button"
      class="flex-shrink-0 flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
      @click="onGoBackClick"
    >
      <font-awesome-icon icon="arrow-left" class="text-gray-800" size="xs" />
    </button>

    <form
      class="flex-none flex-shrink-0 pointer-events-auto"
      @submit.prevent="onSubmit"
    >
      <section class="relative">
        <input
          v-model="searchText"
          class="w-full px-5 py-3 font-medium text-gray-700 placeholder-gray-500 bg-gray-100 border-none rounded-full outline-none appearance-none focus:outline-none focus:ring focus:ring-gray-300"
          placeholder="Recherche"
          type="text"
          @input="onSubmit"
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

    <div v-if="searchResults" class="overflow-y-auto">
      <SearchResultBlock
        v-if="itemsClasse.length > 0"
        label="Catégories"
        icon="layer-group"
        :items="itemsClasse"
        @item-click="onCategoryClick"
      />

      <SearchResultBlock
        v-if="itemsOsm.length > 0"
        label="Points d'intérêts (OSM)"
        icon="map-marker-alt"
        :items="itemsOsm"
        @item-click="onPoiClick"
      />

      <SearchResultBlock
        v-if="itemsTis.length > 0"
        label="Points d'intérêts (TIS)"
        icon="map-marker-alt"
        :items="itemsTis"
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
import Vue, { PropType } from 'vue'

import SearchResultBlock from '@/components/SearchResultBlock.vue'
import { ApiSearchResults, SearchResult, Category } from '@/utils/types'

export default Vue.extend({
  components: {
    SearchResultBlock,
  },

  props: {
    datasourcesToCategories: {
      type: Object as PropType<{ [id: string]: Category['id'][] }>,
      required: true,
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
    hasNoResults() {
      return (
        this.itemsClasse.length === 0 &&
        this.itemsOsm.length === 0 &&
        this.itemsTis.length === 0 &&
        this.itemsAddress.length === 0
      )
    },

    itemsClasse(): SearchResult[] {
      return this.searchResults && Array.isArray(this.searchResults.classe)
        ? this.searchResults.classe
            .map((v) => ({
              id: v.idmenu,
              label: `${v.label} (${v.poi_type.toUpperCase()})`,
            }))
            .filter((v) => this.datasourcesToCategories[v.id])
        : []
    },

    itemsOsm(): SearchResult[] {
      return this.searchResults && Array.isArray(this.searchResults.osm)
        ? this.searchResults.osm.map((v) => ({
            id: v.postid.toString(),
            label: v.label,
          }))
        : []
    },

    itemsTis(): SearchResult[] {
      return this.searchResults && Array.isArray(this.searchResults.tis)
        ? this.searchResults.tis.map((v) => ({
            id: v.postid.toString(),
            label: v.label,
          }))
        : []
    },

    itemsAddress(): SearchResult[] {
      return this.searchResults && Array.isArray(this.searchResults.adress)
        ? this.searchResults.adress.map((v) => ({ id: v.ID, label: v.label }))
        : []
    },
  },

  methods: {
    onGoBackClick() {
      this.$emit('go-back-click')
    },

    onCategoryClick(id: string) {
      if (this.datasourcesToCategories[id]) {
        this.$emit('category-click', this.datasourcesToCategories[id])
      }
    },

    onPoiClick(id: string) {
      this.$emit('poi-click', id)
    },

    onAddressClick(id: string) {
      if (this.searchResults && this.searchResults.adress) {
        this.$emit(
          'feature-click',
          this.searchResults.adress.find((a) => a.ID === id)?.geojson
        )
      }
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
    },
  },
})
</script>
