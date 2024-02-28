<script lang="ts">
import Field from '~/components/Fields/Field.vue'
import type { ApiPoi, ApiPoiProperties, ApiPois, FieldsListItem } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'
import ContribFieldGroup from '~/components/Fields/ContribFieldGroup.vue'
import type { ContribFields } from '~/composables/useContrib'

interface DataTableHeaders {
  title: string
  value?: string
  key?: string
}

export default {
  components: {
    ContribFieldGroup,
    Field,
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

  data(): {
    contribMode: boolean
    context: string
    isContribEligible: (properties: ApiPoiProperties) => boolean
    getContributorFields: (feature: ApiPoi) => ContribFields
  } {
    const { contribMode, isContribEligible, getContributorFields } = useContrib()

    return {
      contribMode,
      context: PropertyTranslationsContextEnum.List,
      isContribEligible,
      getContributorFields,
    }
  },

  computed: {
    headers(): Array<DataTableHeaders> {
      const headers: Array<DataTableHeaders> = this.fields.map(f => ({
        title: this.$propertyTranslations.p(
          f.field,
          PropertyTranslationsContextEnum.List,
        ),
        value: f.field,
        key: `properties.${f.field}`,
      }))

      headers.push({ title: '' })

      if (this.contribMode)
        headers.push({ title: this.$t('fields.contrib.heading') })

      return headers
    },
  },
}
</script>

<template>
  <v-data-table
    class="mt-4"
    :headers="headers"
    :items="pois.features"
    :no-data-text="$t('poisTable.empty')"
    item-key="name"
    items-per-page="5"
  >
    <template #item="{ item }">
      <tr>
        <td v-for="field in fields" :key="field.field" class="tw-align-top">
          <Field
            :context="context"
            :recursion-stack="[field.field]"
            :field="field"
            :details="$t('poisTable.details')"
            :properties="item.selectable.properties"
            :geom="item.selectable.geometry"
          />
        </td>
        <td>
          <NuxtLink :to="`/poi/${item.selectable.properties.metadata.id}/details`">
            {{ $t('poisTable.details') }}
          </NuxtLink>
        </td>
        <td v-if="contribMode && isContribEligible(feature.properties)" class="tw-align-top">
          <ContribFieldGroup v-bind="getContributorFields(feature)" />
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<style scoped>
/* stylelint-disable selector-class-pattern */
.v-data-table .v-table__wrapper > table thead {
  background: blue
}

.v-data-table .v-table__wrapper > table tbody > tr:nth-child(even) > td {
  background: #F3F4F6;
}
</style>
