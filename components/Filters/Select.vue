<template>
  <div>
    <v-autocomplete
      v-model="currentValue"
      outlined
      multiple
      chips
      deletable-chips
      :items="items"
      placeholder="Recherchez ou ajoutez une valeur"
      :clearable="true"
      @update:model-value="onChange"
      @click="$emit('click')"
      @blur="$emit('blur')"
    />
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { VAutocomplete } from 'vuetify/components/VAutocomplete'

import { defineNuxtComponent } from '#app'
import { FilterValueList } from '~/utils/types-filters'

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
    change: (value: string[] | undefined) => true,
  },

  data(): {
    currentValue: string[] | undefined
  } {
    return {
      currentValue: this.filter.filterValues,
    }
  },

  computed: {
    items(): { text: string; value: string }[] {
      return this.filter.def.values.map((value) => ({
        text: (value.name && value.name.fr) || value.value,
        value: value.value,
      }))
    },
  },

  watch: {
    filter() {
      this.currentValue = this.filter.filterValues
    },
  },

  methods: {
    onChange(value: string[] | undefined) {
      this.$emit('change', value)
    },
  },
})
</script>
