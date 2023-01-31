<template>
  <div>
    <ul>
      <li>
        <a :href="urlCsv">
          {{ $tc('poisTable.downloadCsv') }}
        </a>
      </li>
      <li>
        <a :href="urlGeojson">
          {{ $tc('poisTable.downloadGeojson') }}
        </a>
      </li>
    </ul>

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
    urlCsv: {
      type: String,
      required: true,
    },
    urlGeojson: {
      type: String,
      required: true,
    },
  },
})
</script>
