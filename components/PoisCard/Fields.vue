<template>
  <div>
    <template v-for="field in fields">
      <Field
        :key="field"
        :field="field"
        :properties="properties"
        :details="details"
      ></Field>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import Field from '~/components/PoisCard/Field.vue'
import { ApiPoiProperties, FieldsList } from '~/lib/apiPois'

export default Vue.extend({
  components: {
    Field,
  },

  props: {
    fields: {
      type: Array as PropType<FieldsList>,
      required: true,
    },
    properties: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
    details: {
      type: String,
      default: null,
    },
  },
})
</script>
