<script lang="ts">
import type { PropType } from 'vue'
import { VAutocomplete } from 'vuetify/components/VAutocomplete'

import { defineNuxtComponent } from '#app'
import type { FilterValueList } from '~/utils/types-filters'

export default defineNuxtComponent({
  components: {
    VAutocomplete,
  },

  props: {
    filter: {
      type: Object as PropType<FilterValueList>,
      required: true,
    },
  },

  emits: {
    click: () => true,
    blur: () => true,
    change: (_value: string[] | undefined) => true,
  },

  data(): {
    currentValue: string[] | undefined
  } {
    return {
      currentValue: this.filter.filterValues,
    }
  },

  computed: {
    items(): { title: string, value: string }[] {
      return this.filter.def.values.map(value => ({
        title: (value.name && value.name.fr) || value.value,
        value: value.value,
      })).sort((a, b) => a.title.localeCompare(b.title, this.$i18n.locale, { sensitivity: 'base' }))
    },
  },

  watch: {
    filter() {
      this.currentValue = this.filter.filterValues
    },
  },

  methods: {
    normalize(str: string): string {
      return str
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
    },

    filterEasy(value: string, query: string) {
      if (value == null || query == null)
        return -1

      return this.normalize(value).indexOf(this.normalize(query))
    },

    onChange(value: string[] | undefined) {
      this.$emit('change', value)
    },
  },
})
</script>

<template>
  <div>
    <v-autocomplete
      v-model="currentValue"
      outlined
      multiple
      chips
      deletable-chips
      :items="items"
      :label="$t('listFilter.label')"
      :clearable="true"
      hide-details="auto"
      density="compact"
      :custom-filter="filterEasy"
      @update:model-value="onChange"
      @click="$emit('click')"
      @blur="$emit('blur')"
    />
  </div>
</template>
