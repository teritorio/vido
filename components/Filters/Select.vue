<template>
  <div class="mt-12">
    <t-rich-select
      variant="relative"
      placeholder="Recherchez ou ajoutez une valeur"
      search-box-placeholder="Rechercher ..."
      multiple
      :options="
        filter.def.values.map((value) => ({
          text: (value.name && value.name.fr) || value.value,
          value: value.value,
        }))
      "
      :value="filter.filterValues"
      @input="onChange"
      @click="$emit('click')"
      @blur="$emit('blur')"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { FilterValueList } from '~/utils/types-filters'

export default Vue.extend({
  props: {
    filter: {
      type: Object as PropType<FilterValueList>,
      required: true,
    },
  },

  methods: {
    onChange(value: string[] | undefined) {
      this.$emit('change', value)
    },
  },
})
</script>

<style lang="scss">
@import '@vueform/slider/themes/tailwind.scss';
</style>
