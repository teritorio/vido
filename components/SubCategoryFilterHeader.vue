<template>
  <aside
    class="absolute sm:relative inset-x-0 bottom-0 sm:inset-auto h-3/5 sm:h-auto overflow-y-auto sm:overflow-y-visible flex flex-col px-5 py-4 space-y-6 bg-white shadow-md pointer-events-auto rounded-t-lg rounded-b-none sm:rounded-xl"
    style="min-width: 200px"
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
      <div v-for="bf in booleanFiltres" :key="bf.datasourceId">
        <label
          v-for="v in Object.keys(bf).filter((k) => k !== 'datasourceId')"
          :key="v"
          class="block mb-1 text-gray-800"
        >
          <input
            type="checkbox"
            class="text-green-500 focus:ring-0 focus:ring-transparent rounded-full"
            :name="'bf_' + bf.datasourceId + '_' + v"
            :checked="
              (((filtersValues || {}).booleanFiltre || {})[v] || []).includes(
                bf[v]
              )
            "
            @change="
              (e) => onBooleanFiltreChange(v, e.target.checked ? bf[v] : null)
            "
          />
          {{ (sptags && sptags[v] && sptags[v][bf[v]]) || v }}
        </label>
      </div>
    </template>

    <div v-for="sf in selectionFiltres" :key="sf.tag">
      <label :for="'sf_' + sf.tag" class="block mb-2 text-gray-500">{{
        sf.label
      }}</label>
      <Multiselect
        placeholder="Recherchez ou ajoutez une valeur"
        select-label="Appuyez sur entrée pour ajouter"
        selected-label="Sélectionné"
        deselect-label="Appuyez sur entrée pour retirer"
        label="name"
        track-by="code"
        :options="
          Object.keys(sf.values).map((k) => ({ name: sf.values[k], code: k }))
        "
        :value="
          (
            ((filtersValues || {}).selectionFiltre || {})[sf.tag] || []
          ).map((k) => ({ name: sf.values[k], code: k }))
        "
        :multiple="true"
        @input="(val) => onSelectionFiltreChange(sf.tag, val)"
      />
    </div>

    <div v-for="cf in checkboxFiltres" :key="cf.tag">
      <p class="mb-2 text-gray-500">{{ cf.label }}</p>
      <label
        v-for="v in Object.keys(cf.values)"
        :key="v"
        class="block mb-1 text-gray-800"
      >
        <input
          type="checkbox"
          class="text-green-500 focus:ring-0 focus:ring-transparent rounded-full"
          :name="'cf_' + cf.tag + '_' + v"
          :checked="
            (
              ((filtersValues || {}).checkboxFiltre || {})[cf.tag] || []
            ).includes(v)
          "
          @change="(e) => onCheckboxFiltreChange(cf.tag, v, e.target.checked)"
        />
        {{ cf.values[v] }}
      </label>
    </div>
  </aside>
</template>

<script lang="ts">
import copy from 'fast-copy'
import Vue, { PropType } from 'vue'
import Multiselect from 'vue-multiselect'

import {
  Category,
  DataSource,
  SelectionFiltreDS,
  CheckboxFiltreDS,
  BooleanFiltreDS,
  FiltreValues,
} from '@/utils/types'

export default Vue.extend({
  components: {
    Multiselect,
  },

  props: {
    subcategory: {
      type: Object as PropType<Category>,
      required: true,
    },
    filtersValues: {
      type: Object as PropType<FiltreValues>,
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
    selectionFiltres(): SelectionFiltreDS[] {
      let filtres: SelectionFiltreDS[] = []
      this.subcategory.datasources.forEach((ds: DataSource) => {
        filtres = filtres.concat(
          ds.filtre?.selectionFiltre?.map((sf) =>
            Object.assign({ datasourceId: ds.idsrc }, sf)
          ) || []
        )
      })
      return filtres
    },
    checkboxFiltres(): CheckboxFiltreDS[] {
      let filtres: CheckboxFiltreDS[] = []
      this.subcategory.datasources.forEach((ds: DataSource) => {
        filtres = filtres.concat(
          ds.filtre?.checkboxFiltre?.map((sf) =>
            Object.assign({ datasourceId: ds.idsrc }, sf)
          ) || []
        )
      })
      return filtres
    },
    booleanFiltres(): BooleanFiltreDS[] {
      const filtres: BooleanFiltreDS[] = []
      this.subcategory.datasources.forEach((ds: DataSource) => {
        if (ds.filtre?.booleanFiltre) {
          filtres.push(
            Object.assign({
              datasourceId: ds.idsrc,
              ...ds.filtre.booleanFiltre,
            })
          )
        }
      })
      return filtres
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

    onBooleanFiltreChange(tag: string, value: string | null) {
      const newFilters = this.filtersValues ? copy(this.filtersValues) : {}
      if (value === null) {
        if (newFilters.booleanFiltre && newFilters.booleanFiltre[tag]) {
          delete newFilters.booleanFiltre[tag]
        }
      } else {
        newFilters.booleanFiltre = Object.assign(
          newFilters.booleanFiltre || {},
          { [tag]: [value] }
        )
      }
      this.$emit('filter-changed', newFilters)
    },

    onSelectionFiltreChange(
      tag: string,
      values: { code: string; name: string }[] | null
    ) {
      const newFilters = this.filtersValues ? copy(this.filtersValues) : {}
      if (values && values.length > 0) {
        if (!newFilters.selectionFiltre) {
          newFilters.selectionFiltre = {}
        }
        newFilters.selectionFiltre[tag] = values.map((v) => v.code)
      } else {
        if (newFilters.selectionFiltre && newFilters.selectionFiltre[tag]) {
          delete newFilters.selectionFiltre[tag]
        }
        if (
          newFilters.selectionFiltre &&
          Object.keys(newFilters.selectionFiltre).length === 0
        ) {
          delete newFilters.selectionFiltre
        }
      }
      this.$emit('filter-changed', newFilters)
    },

    onCheckboxFiltreChange(tag: string, val: string, checked: true) {
      const newFilters = this.filtersValues ? copy(this.filtersValues) : {}

      if (!newFilters.checkboxFiltre) {
        newFilters.checkboxFiltre = {}
      }
      if (!newFilters.checkboxFiltre[tag]) {
        newFilters.checkboxFiltre[tag] = []
      }

      if (checked) {
        if (!newFilters.checkboxFiltre[tag].includes(val)) {
          newFilters.checkboxFiltre[tag].push(val)
        }
      } else if (newFilters.checkboxFiltre[tag].includes(val)) {
        newFilters.checkboxFiltre[tag] = newFilters.checkboxFiltre[tag].filter(
          (k: string) => k !== val
        )
      }

      if (newFilters.checkboxFiltre[tag].length === 0) {
        delete newFilters.checkboxFiltre[tag]
      }
      if (Object.keys(newFilters.checkboxFiltre).length === 0) {
        delete newFilters.checkboxFiltre
      }

      this.$emit('filter-changed', newFilters)
    },

    fetchSpTags() {
      const tags = new Set()
      this.booleanFiltres.forEach((bf) =>
        Object.keys(bf)
          .filter((k) => k !== 'datasourceId')
          .forEach((k) => tags.add(k))
      )

      fetch(
        `${this.$config.API_ENDPOINT}/geodata/v1/sptags?PopupListField=${[
          ...tags,
        ].join(';')}`
      )
        .then((data) => data.json())
        .then((data) => (this.sptags = data))
    },
  },
})
</script>

<style>
.multiselect__tag {
  @apply bg-gray-500;
}
.multiselect__tag span {
  @apply mr-1;
}
.multiselect__tag-icon,
.multiselect__tag-icon:hover {
  @apply bg-red-600;
}
.multiselect__tag-icon::after,
.multiselect__tag-icon:hover::after {
  @apply text-white;
  @apply font-extrabold;
}
</style>
