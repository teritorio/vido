<template>
  <div>
    <template v-for="field in fields">
      <FieldsGroup
        v-if="field.group"
        :key="field.group"
        :recursion-level="recursionLevel"
        :group="field"
        :title="fieldTranslateK(field.group)"
        :properties="properties"
        :geom="geom"
        :color-fill="colorFill"
        :class="[recursionLevel === 0 && 'fields-list']"
      />

      <Field
        v-else
        :key="field.group"
        :context="context"
        :recursion-level="recursionLevel"
        :field="field"
        :properties="properties"
        :geom="geom"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import Field from '~/components/Fields/Field.vue'
import FieldsGroup from '~/components/PoisDetails/FieldsGroup.vue'
import { ApiPoiProperties, FieldsList } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

export default Vue.extend({
  components: {
    Field,
    FieldsGroup,
  },

  props: {
    recursionLevel: {
      type: Number,
      default: 0,
    },
    fields: {
      type: Array as PropType<FieldsList>,
      required: true,
    },
    properties: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
    geom: {
      type: Object as PropType<GeoJSON.Geometry>,
      required: true,
    },
    colorFill: {
      type: String,
      required: true,
    },
  },

  computed: {
    context(): PropertyTranslationsContextEnum {
      return PropertyTranslationsContextEnum.Details
    },
  },

  methods: {
    fieldTranslateK(field: string) {
      return this.$propertyTranslations.p(field, this.context)
    },
  },
})
</script>

<style lang="scss" scoped>
.fields-list {
  margin-top: 3.3rem;
}

:deep(.field_header_level_1) {
  display: inline;
}

:deep(.field_content_level_1) {
  display: inline;
  clear: right;
}
</style>
