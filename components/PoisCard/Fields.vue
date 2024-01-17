<script lang="ts">
import type GeoJSON from 'geojson'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import Field from '~/components/Fields/Field.vue'
import type { ApiPoiProperties, FieldsListItem } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

export default defineNuxtComponent({
  components: {
    Field,
  },

  props: {
    fields: {
      type: Array as PropType<FieldsListItem[]>,
      required: true,
    },
    properties: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
    details: {
      type: String as PropType<string>,
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

<template>
  <div>
    <template v-for="field in fields" :key="field.field">
      <Field
        :context="context"
        :recursion-stack="[field.field]"
        :field="field"
        :properties="properties"
        :details="details"
        :geom="geom"
        class="tw-mt-2"
      />
    </template>
  </div>
</template>
