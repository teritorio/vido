<template>
  <aside
    class="absolute inset-x-0 bottom-0 flex flex-col px-5 py-4 space-y-6 bg-white shadow-md pointer-events-auto sm:relative sm:inset-auto h-3/5 sm:h-auto sm:rounded-xl overflow-y-visible md:w-96"
  >
    <div class="flex justify-between">
      <button
        type="button"
        class="flex items-center justify-center w-10 h-10 text-2xl font-bold transition-all rounded-full outline-none cursor-pointer focus:outline-none hover:bg-gray-100 focus:bg-gray-100"
        @click="onGoBackClick"
      >
        <font-awesome-icon icon="arrow-left" class="text-gray-800" size="xs" />
      </button>
    </div>

    <template v-if="sptags">
      <label
        v-for="key in booleanFilters"
        :key="key"
        class="block mb-1 text-gray-800"
      >
        <input
          type="checkbox"
          class="text-green-500 rounded-full focus:ring-0 focus:ring-transparent"
          :name="key"
          :checked="((filtersValues || {}).booleanFilters || []).includes(key)"
          @change="
            (e) => onBooleanFilterChange(v, e.target.checked ? key : null)
          "
        />
        {{ (sptags && sptags[v] && sptags[v][key]) || v }}
      </label>
    </template>

    <div v-for="sf in selectionFilters" :key="sf.tag">
      <label :for="'sf_' + sf.tag" class="block mb-2 text-gray-500">{{
        sf.label
      }}</label>
      <t-rich-select
        placeholder="Recherchez ou ajoutez une valeur"
        search-box-placeholder="Rechercher ..."
        text-attribute="name"
        value-attribute="name"
        multiple
        :options="
          Object.keys(sf.values).map((k) => ({ name: sf.values[k], code: k }))
        "
        :value="((filtersValues || {}).selectionFilter || {})[sf.tag] || []"
        @input="(val) => onSelectionFilterChange(sf.tag, val)"
      />
    </div>

    <div class="overflow-y-auto">
      <div v-for="cf in checkboxFilters" :key="cf.tag">
        <p class="mb-2 text-gray-500">{{ cf.label }}</p>
        <label
          v-for="v in Object.keys(cf.values)"
          :key="v"
          class="block mb-1 text-gray-800"
        >
          <input
            type="checkbox"
            class="text-green-500 rounded-full focus:ring-0 focus:ring-transparent"
            :name="'cf_' + cf.tag + '_' + v"
            :checked="
              (
                ((filtersValues || {}).checkboxFilter || {})[cf.tag] || []
              ).includes(v)
            "
            @change="(e) => onCheckboxFilterChange(cf.tag, v, e.target.checked)"
          />
          {{ cf.values[v] }}
        </label>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import copy from 'fast-copy'
import Vue, { PropType } from 'vue'

import {
  Category,
  SelectionFilter,
  CheckboxFilter,
  BooleanFilters,
  FilterValues,
} from '@/utils/types'

export default Vue.extend({
  props: {
    subcategory: {
      type: Object as PropType<Category>,
      required: true,
    },
    filtersValues: {
      type: Object as PropType<FilterValues>,
      default: () => {},
    },
  },

  data(): {
    sptags: { [key: string]: any } | null
  } {
    return {
      sptags: null,
    }
  },

  computed: {
    selectionFilters(): SelectionFilter[] {
      return this.subcategory.datasources?.selectionFilter || []
    },
    checkboxFilters(): CheckboxFilter[] {
      return this.subcategory.datasources?.checkboxFilter || []
    },
    booleanFilters(): BooleanFilters {
      return this.subcategory.datasources?.booleanFilters || []
    },
  },

  watch: {
    subcategory() {
      this.sptags = null
      this.fetchSpTags()
    },
  },

  created() {
    this.fetchSpTags()
  },

  methods: {
    onGoBackClick() {
      this.$emit('go-back-click')
    },

    onBooleanFilterChange(tag: string, value: string | null) {
      const newFilters = this.filtersValues ? copy(this.filtersValues) : {}
      if (newFilters.booleanFilters) {
        if (value === null) {
          if (newFilters.booleanFilters.includes(tag)) {
            newFilters.booleanFilters = newFilters.booleanFilters.splice(
              newFilters.booleanFilters.indexOf(tag),
              1
            )
          }
        } else {
          newFilters.booleanFilters.push(value)
        }
        this.$emit('filter-changed', newFilters)
      }
    },

    onSelectionFilterChange(tag: string, values: string[] | null) {
      const newFilters = this.filtersValues ? copy(this.filtersValues) : {}

      if (values && values.length > 0) {
        if (!newFilters.selectionFilter) {
          newFilters.selectionFilter = {}
        }
        newFilters.selectionFilter[tag] = values
      } else {
        if (newFilters.selectionFilter && newFilters.selectionFilter[tag]) {
          delete newFilters.selectionFilter[tag]
        }
        if (
          newFilters.selectionFilter &&
          Object.keys(newFilters.selectionFilter).length === 0
        ) {
          delete newFilters.selectionFilter
        }
      }
      this.$emit('filter-changed', newFilters)
    },

    onCheckboxFilterChange(tag: string, val: string, checked: true) {
      const newFilters = this.filtersValues ? copy(this.filtersValues) : {}

      if (!newFilters.checkboxFilter) {
        newFilters.checkboxFilter = {}
      }
      if (!newFilters.checkboxFilter[tag]) {
        newFilters.checkboxFilter[tag] = []
      }

      if (checked) {
        if (!newFilters.checkboxFilter[tag].includes(val)) {
          newFilters.checkboxFilter[tag].push(val)
        }
      } else if (newFilters.checkboxFilter[tag].includes(val)) {
        newFilters.checkboxFilter[tag] = newFilters.checkboxFilter[tag].filter(
          (k: string) => k !== val
        )
      }

      if (newFilters.checkboxFilter[tag].length === 0) {
        delete newFilters.checkboxFilter[tag]
      }
      if (Object.keys(newFilters.checkboxFilter).length === 0) {
        delete newFilters.checkboxFilter
      }

      this.$emit('filter-changed', newFilters)
    },

    fetchSpTags() {
      if (this.booleanFilters) {
        fetch(
          `${
            this.$config.API_ENDPOINT
          }/sptags?PopupListField=${this.booleanFilters.join(';')}`
        )
          .then((data) => data.json())
          .then((data) => (this.sptags = data))
      }
    },
  },
})
</script>
