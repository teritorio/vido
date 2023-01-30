<template>
  <div>
    <PoisTable :fields="fields" :pois="pois" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import PoisTable from '~/components/PoisList/PoisTable.vue'
import { ApiPois, FieldsListItem } from '~/lib/apiPois'

export default Vue.extend({
  components: {
    PoisTable,
  },

  props: {
    fields: {
      type: Array as PropType<FieldsListItem[]>,
      required: true,
    },
    pois: {
      type: Object as PropType<ApiPois>,
      required: true,
    },
  },
})
</script>
