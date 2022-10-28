<template>
  <div>
    <template v-for="field in fields">
      <Field
        :key="field.field"
        :context="context"
        :recursion-level="1"
        :field="field"
        :properties="properties"
        :details="details"
        :geom="geom"
        class="mt-2"
      />
    </template>
  </div>
</template>

<script lang="ts">
import GeoJSON from 'geojson'
import Vue, { PropType } from 'vue'

import Field from '~/components/Fields/Field.vue'
import { ApiPoiProperties, FieldsList } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

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
    geom: {
      type: Object as PropType<GeoJSON.Geometry>,
      required: true,
    },
  },

  computed: {
    context(): PropertyTranslationsContextEnum {
      return PropertyTranslationsContextEnum.Card
    },
  },
})
</script>
