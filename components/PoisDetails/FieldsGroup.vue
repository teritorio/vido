<script setup lang="ts">
import Field from '~/components/Fields/Field.vue'
import Block from '~/components/PoisDetails/Block.vue'
import FieldsHeader from '~/components/UI/FieldsHeader.vue'
import type {
  FieldsList,
  FieldsListGroup,
  FieldsListItem,
} from '~/lib/apiPois'
import type { ApiPoiProperties } from '~/types/api/poi'
import { PropertyTranslationsContextEnum, useSiteStore } from '~/stores/site'
import { isFiledEmpty } from '~/utils/utilities'

withDefaults(defineProps<{
  recursionStack?: string[]
  group: FieldsListGroup
  properties: ApiPoiProperties
  geom: GeoJSON.Geometry
  colorFill: string
  colorText: string
}>(), {
  recursionStack: () => [],
})

const { p } = useSiteStore()

const context = computed((): PropertyTranslationsContextEnum => {
  return PropertyTranslationsContextEnum.Details
})

function fieldTranslateK(field: string) {
  return p(field, context.value)
}

function isListEmpty(
  fileds: FieldsList,
  properties: { [key: string]: string },
  geom: GeoJSON.Geometry,
): boolean {
  return (
    !fileds
    || fileds.reduce(
      (sum: boolean, value: FieldsListItem | FieldsListGroup) =>
        sum
        && (value.group !== undefined
          ? isListEmpty(value.fields, properties, geom)
          : isFiledEmpty(value, properties, geom)),
      true,
    )
  )
}
</script>

<template>
  <div>
    <template v-for="field in group.fields" :key="field.group">
      <div
        v-if="field.group !== undefined && !isListEmpty(field.fields, properties, geom)"
        class="block print:tw-mb-2"
      >
        <div v-if="!field.display_mode || field.display_mode === 'standard'">
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
            :color-text="colorText"
          />
        </div>
        <Block
          v-else-if="field.display_mode === 'card' && field.icon"
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
            :color-text="colorText"
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
