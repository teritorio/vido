<script setup lang="ts">
import type GeoJSON from 'geojson'
import Field from '~/components/Fields/Field.vue'
import type { FieldsListItem } from '~/lib/apiPois'
import type { Poi } from '~/types/local/poi'
import { PropertyTranslationsContextEnum } from '~/stores/site'

defineProps<{
  fields: FieldsListItem[]
  properties: Poi['properties']
  details?: string
  geom: GeoJSON.Geometry
}>()

const context = computed((): PropertyTranslationsContextEnum => {
  return PropertyTranslationsContextEnum.Card
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
