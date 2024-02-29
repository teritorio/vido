<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'
import type { ApiPois, FieldsListItem } from '~/lib/apiPois'
import type { ApiMenuCategory } from '~/lib/apiMenu'
import Field from '~/components/Fields/Field.vue'
import IconButton from '~/components/UI/IconButton.vue'
import ContribFieldGroup from '~/components/Fields/ContribFieldGroup.vue'
import Actions from '~/components/PoisList/Actions.vue'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'

interface DataTableHeader {
  filterable: boolean
  key: string
  title: string
  value?: string | Function
}

const props = defineProps<{
  category: ApiMenuCategory
  fields: FieldsListItem[]
  pois: ApiPois
}>()

const { t } = useI18n()
const { $propertyTranslations } = useNuxtApp()
const { contribMode, isContribEligible, getContributorFields } = useContrib()

const search = ref('')

function customFilter(value: any, query: string): boolean {
  return query !== null && value !== null && typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())
}

const headers = computed((): Array<DataTableHeader> => {
  // Basic Fields
  const headers: Array<DataTableHeader> = props.fields.map(f => ({
    filterable: true,
    key: f.field,
    title: $propertyTranslations.p(
      f.field,
      PropertyTranslationsContextEnum.List,
    ),
    value: `properties.${f.field}`,
  }))

  // Contrib Field
  if (contribMode) {
    headers.push({
      filterable: false,
      key: 'contrib',
      title: t('fields.contrib.heading'),
    })
  }

  // Details Field
  headers.push({
    filterable: false,
    key: 'details',
    title: 'Actions',
  })

  return headers
})
</script>

<template>
  <VCard>
    <VToolbar class="pa-2" flat>
      <TeritorioIconBadge
        :color-fill="category.category.color_fill"
        :picto="category.category.icon"
        size="xl"
      />
      <VToolbarTitle class="d-flex print:tw-pb-4" tag="h1" :text="category.category.name.fr" />

      <VTextField
        v-model="search"
        :label="t('poisTable.search')"
        clearable
        variant="solo-filled"
        hide-details="auto"
      >
        <template #append-inner>
          <FontAwesomeIcon class="px-2" icon="search" />
        </template>
      </VTextField>
      <Actions
        class="ma-0 ml-2 w-auto"
        :category-id="category.id"
        :color-line="category.category.color_line"
      />
    </VToolbar>
    <VDataTable
      :headers="headers"
      :items="pois.features"
      :no-data-text="t('poisTable.empty')"
      :search="search"
      :custom-filter="customFilter"
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
  </VCard>
</template>

<style>
/* stylelint-disable selector-class-pattern */
.v-data-table .v-table__wrapper > table tbody > tr:nth-child(even) > td,
.v-data-table .v-table__wrapper > table > thead > tr th {
  background: #F3F4F6;
}
</style>
