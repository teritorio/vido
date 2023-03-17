<template>
  <div>
    <v-autocomplete
      v-model="currentValue"
      outlined
      multiple
      chips
      deletable-chips
      :items="
        filter.def.values.map((value) => ({
          text: (value.name && value.name.fr) || value.value,
          value: value.value,
        }))
      "
      placeholder="Recherchez ou ajoutez une valeur"
      :clearable="true"
      @input="onChange"
      @click="$emit('click')"
      @blur="$emit('blur')"
    />
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import { FilterValueList } from '~/utils/types-filters'

export default defineNuxtComponent({
  props: {
    filter: {
      type: Object as PropType<FilterValueList>,
      required: true,
    },
  },

  data(): {
    currentValue: string[] | undefined
  } {
    return {
      currentValue: this.filter.filterValues,
    }
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
