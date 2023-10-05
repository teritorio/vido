<template>
  <div>
    <template v-for="field in group.fields" :key="field.group">
      <div
        v-if="
          field.group !== undefined &&
          !isListEmpty(field.fields, properties, geom)
        "
        class="block print:tw-mb-2"
      >
        <div v-if="field.display_mode === 'standard'">
          <FieldsHeader
            v-if="fieldTranslateK(field.group)"
            :recursion-stack="recursionStack"
          >
            {{ fieldTranslateK(field.group) }}
          </FieldsHeader>
          <FieldsGroup
            :id="`FieldsGroup-${recursionStack.join('-')}-${field.group}`"
            :recursion-stack="[...recursionStack, field.group]"
            :group="field"
            :properties="properties"
            :geom="geom"
            :color-fill="colorFill"
          />
        </div>
        <Block
          v-else-if="field.display_mode === 'card'"
          :color-fill="colorFill"
          :icon="field.icon"
          class="print:tw-hidden"
        >
          <FieldsHeader
            v-if="fieldTranslateK(field.group)"
            :recursion-stack="recursionStack"
          >
            {{ fieldTranslateK(field.group) }}
          </FieldsHeader>
          <FieldsGroup
            :id="`FieldsGroup-${recursionStack.join('-')}-${field.group}`"
            :recursion-stack="[...recursionStack, field.group]"
            :group="field"
            :properties="properties"
            :geom="geom"
            :color-fill="colorFill"
          />
        </Block>
      </div>

      <Field
        v-else-if="field.group === undefined"
        :id="`Field_-${recursionStack.join('-')}-${field.field}`"
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
import { PropType } from 'vue'

import { isFiledEmpty } from '../Fields/Field.vue'

import { defineNuxtComponent } from '#app'
import Field from '~/components/Fields/Field.vue'
import Block from '~/components/PoisDetails/Block.vue'
import FieldsHeader from '~/components/UI/FieldsHeader.vue'
import {
  ApiPoiProperties,
  FieldsList,
  FieldsListGroup,
  FieldsListItem,
} from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

export default defineNuxtComponent({
  name: 'FieldsGroup',

  components: {
    Block,
    FieldsHeader,
    Field,
  },

  props: {
    recursionStack: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    group: {
      type: Object as PropType<FieldsListGroup>,
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

  data(): {
    empty: any
  } {
    return {
      empty: true,
    }
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

    isListEmpty(
      fileds: FieldsList,
      properties: { [key: string]: string },
      geom: GeoJSON.Geometry
    ): boolean {
      return (
        !fileds ||
        fileds.reduce(
          (sum: boolean, value: FieldsListItem | FieldsListGroup) =>
            sum &&
            (value.group !== undefined
              ? this.isListEmpty(value.fields, properties, geom)
              : isFiledEmpty(value, properties, geom)),
          true
        )
      )
    },
  },
})
</script>

<style lang="scss" scoped>
.block {
  margin-bottom: 3rem;
}
@media print {
  .block {
    margin-bottom: 0.5rem !important;
  }
}
</style>
