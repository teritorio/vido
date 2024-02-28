<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'
import type { ApiPois, FieldsListItem } from '~/lib/apiPois'
import Field from '~/components/Fields/Field.vue'
import IconButton from '~/components/UI/IconButton.vue'
import ContribFieldGroup from '~/components/Fields/ContribFieldGroup.vue'

interface DataTableHeader {
  key: string
  title: string
  value?: string | Function
}

const props = defineProps<{
  fields: FieldsListItem[]
  pois: ApiPois
}>()

const { t } = useI18n()
const { $propertyTranslations } = useNuxtApp()
const { contribMode, isContribEligible, getContributorFields } = useContrib()

const headers = computed((): Array<DataTableHeader> => {
  // Basic Fields
  const headers: Array<DataTableHeader> = props.fields.map(f => ({
    key: f.field,
    title: $propertyTranslations.p(
      f.field,
      PropertyTranslationsContextEnum.List,
    ),
  }))

  // Contrib Field
  if (contribMode) {
    headers.push({
      key: 'contrib',
      title: t('fields.contrib.heading'),
    })
  }

  // Details Field
  headers.push({
    key: 'details',
    title: 'Actions',
  })

  return headers
})
</script>

<template>
  <VDataTable
    :headers="headers"
    :items="pois.features"
    :no-data-text="$t('poisTable.empty')"
    items-per-page="20"
  >
    <template #item="{ item, columns }">
      <tr>
        <td v-for="col in columns" :key="col.key">
          <ContribFieldGroup
            v-if="col.key === 'contrib' && isContribEligible(item.raw.properties)"
            v-bind="getContributorFields(item.raw)"
          />
          <IconButton
            v-else-if="col.key === 'details'"
            class="tw-h-10"
            :href="`/poi/${item.raw.properties.metadata.id}/details`"
            :label="t('poisTable.details')"
            target="_self"
          >
            <FontAwesomeIcon icon="external-link-alt" />
            {{ t('poisTable.details') }}
          </IconButton>
          <Field
            v-else
            :context="PropertyTranslationsContextEnum.List"
            :recursion-stack="[col.key]"
            :field="{ field: col.key }"
            :details="t('poisTable.details')"
            :properties="item.raw.properties"
            :geom="item.raw.geometry"
          />
        </td>
      </tr>
    </template>
  </VDataTable>
</template>

<style>
/* stylelint-disable selector-class-pattern */
.v-data-table .v-table__wrapper > table tbody > tr:nth-child(even) > td,
.v-data-table .v-table__wrapper > table > thead > tr th {
  background: #F3F4F6;
}
</style>
