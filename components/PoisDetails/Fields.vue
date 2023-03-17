<template>
  <div>
    <template v-for="field in fields">
      <FieldsGroup
        v-if="field.group"
        :id="`FieldsGroup-${recursionStack.join('-')}-${field.group}`"
        :key="field.group"
        :recursion-stack="recursionStack"
        :group="field"
        :title="fieldTranslateK(field.group)"
        :properties="properties"
        :geom="geom"
        :color-fill="colorFill"
        :class="[recursionStack.length === 0 && 'fields-list']"
      />

      <Field
        v-else-if="field.group === undefined"
        :id="`Field-${recursionStack.join('-')}-${field.field}`"
        :key="field.field"
        :context="context"
        :recursion-stack="recursionStack"
        :field="field"
        :properties="properties"
        :geom="geom"
        class="field"
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
    recursionStack: {
      type: Array as PropType<string[]>,
      default: () => [],
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
      type: String as PropType<string>,
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
.fields-list:not(:first-child) {
  margin-top: 3.3rem;
}

:deep(.field_header_level_1) {
  display: inline;
}

:deep(.field_content_level_1) {
  display: inline;
  clear: right;
}

:deep(.field) {
  margin-bottom: 0.3rem;
}
</style>
