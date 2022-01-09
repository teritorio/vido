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

    <template v-for="filter in filters">
      <div v-if="filter.type == 'boolean'" :key="filter.property">
        <label :key="filter.property" class="block mb-1 text-gray-800">
          <input
            type="checkbox"
            class="text-green-500 rounded-full focus:ring-0 focus:ring-transparent"
            :name="filter.property"
            :checked="filtersValues && filter.property in filtersValues"
            @change="
              (e) => onBooleanFilterChange(filter.property, e.target.checked)
            "
          />
          {{ (filter.name && filter.name.fr) || filter.property }}
        </label>
      </div>
      <div v-else-if="filter.type == 'multiselection'" :key="filter.property">
        <label :for="filter.property" class="block mb-2 text-gray-500">{{
          filter.label
        }}</label>
        <t-rich-select
          placeholder="Recherchez ou ajoutez une valeur"
          search-box-placeholder="Rechercher ..."
          text-attribute="name"
          value-attribute="name"
          multiple
          :options="
            filter.values.map((value) => ({
              name: (value.name && value.name.fr) || value.value,
              code: value.value,
            }))
          "
          :value="(filtersValues && filtersValues[filter.property]) || []"
          @input="(val) => onSelectionFilterChange(filter.property, val)"
        />
      </div>
      <div
        v-else-if="filter.type == 'checkboxes_list'"
        :key="filter.property"
        class="overflow-y-auto"
      >
        <p class="mb-2 text-gray-500">
          {{ (filter.name && filter.name.fr) || filter.property }}
        </p>
        <label
          v-for="value in filter.values"
          :key="value.value"
          class="block mb-1 text-gray-800"
        >
          <input
            type="checkbox"
            class="text-green-500 rounded-full focus:ring-0 focus:ring-transparent"
            :name="filter.property + '_' + value.value"
            :checked="
              (
                (filtersValues && filtersValues[filter.property]) ||
                []
              ).includes(value.value)
            "
            @change="
              (e) =>
                onCheckboxFilterChange(
                  filter.property,
                  value.value,
                  e.target.checked
                )
            "
          />
          {{ (value.name && value.name.fr) || value.value }}
        </label>
      </div>
    </template>
  </aside>
</template>

<script lang="ts">
import copy from 'fast-copy'
import Vue, { PropType } from 'vue'

import { Category, Filter, FilterValues } from '@/utils/types'

export default Vue.extend({
  props: {
    subcategory: {
      type: Object as PropType<Category>,
      required: true,
    },
    filtersValues: {
      type: Object as PropType<FilterValues>,
      default: () => ({}),
    },
  },

  computed: {
    filters(): Filter[] {
      return this.subcategory.category?.filters || []
    },
  },

  methods: {
    onGoBackClick() {
      this.$emit('go-back-click')
    },

    onBooleanFilterChange(property: string, value: boolean) {
      const newFilters = this.filtersValues ? copy(this.filtersValues) : {}

      if (value) {
        newFilters[property] = ['yes']
      } else if (newFilters[property]) {
        delete newFilters[property]
      }
      this.$emit('filter-changed', newFilters)
    },

    onSelectionFilterChange(property: string, values: string[] | null) {
      const newFilters = this.filtersValues ? copy(this.filtersValues) : {}

      if (values && values.length > 0) {
        newFilters[property] = values
      } else if (newFilters[property]) {
        delete newFilters[property]
      }
      this.$emit('filter-changed', newFilters)
    },

    onCheckboxFilterChange(property: string, val: string, checked: boolean) {
      const newFilters = this.filtersValues ? copy(this.filtersValues) : {}

      if (!newFilters[property]) {
        newFilters[property] = []
      }

      if (checked) {
        if (!newFilters[property].includes(val)) {
          newFilters[property].push(val)
        }
      } else if (newFilters[property].includes(val)) {
        newFilters[property] = newFilters[property].filter(
          (k: string) => k !== val
        )
      }

      if (newFilters[property].length === 0) {
        delete newFilters[property]
      }
      this.$emit('filter-changed', newFilters)
    },
  },
})
</script>
