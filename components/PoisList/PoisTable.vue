<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { localeIncludes } from 'locale-includes'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'
import type { ApiPoi, FieldsListItem } from '~/lib/apiPois'
import type { ApiMenuCategory } from '~/lib/apiMenu'
import Field from '~/components/Fields/Field.vue'
import IconButton from '~/components/UI/IconButton.vue'
import ContribFieldGroup from '~/components/Fields/ContribFieldGroup.vue'
import Actions from '~/components/PoisList/Actions.vue'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { getPoiByCategoryId } from '~/lib/apiPois'
import { siteStore as useSiteStore } from '~/stores/site'

interface DataTableHeader {
  filterable?: boolean
  key: string
  sortable?: boolean
  sort?: (a: string, b: string) => number
  title: string
}

const props = defineProps<{
  category: ApiMenuCategory
}>()

const { routeToString, addressToString } = useField()
const { t, locale } = useI18n()
const siteStore = useSiteStore()
const { $propertyTranslations } = useNuxtApp()
const { contribMode, isContribEligible, getContributorFields } = useContrib()
const search = ref('')

// Fetch POIs by Cache or API
const pois = ref()
const loadingState = ref(false)
const cachedKey = computed(() => `pois-${props.category.id}`)
const { data: cachedPois } = useNuxtData(cachedKey.value)

if (cachedPois.value) {
  pois.value = cachedPois.value
}
else {
  const { data, pending, error } = await useAsyncData(cachedKey.value, () => getPoiByCategoryId(
    siteStore.config!,
    props.category.id,
    { geometry_as: 'point', short_description: true },
  ))

  if (error.value || !data.value)
    throw createError({ statusCode: 404, statusMessage: 'POIs not found.' })

  pois.value = data.value
  loadingState.value = pending.value
}

// Handle default config field if not provided by API
const fields = computed((): FieldsListItem[] => {
  return (
    (pois.value?.features[0].properties.editorial?.list_fields)
    || [{ field: 'name' }]
  )
})

// Transform non-string values to single string
// Used for sort and filter comparisons
pois.value.features = pois.value.features.map((f: ApiPoi) => {
  const fieldEntries = fields.value.map(f => f.field)
  const arrayProps: { [key: string]: any } = []

  if (fieldEntries.includes('route'))
    arrayProps.route = routeToString(f.properties, getContext('route'))

  if (fieldEntries.includes('addr'))
    arrayProps.addr = addressToString(f.properties)

  return {
    ...f,
    properties: {
      ...f.properties,
      ...arrayProps,
    },
  }
})

// Transform headers data to be compliant with Vuetify's standards
const headers = computed(() => {
  // Basic Fields
  const h: DataTableHeader[] = fields.value.map(f => ({
    filterable: true,
    key: `properties.${f.field}`,
    sortable: true,
    title: $propertyTranslations.p(
      f.field,
      PropertyTranslationsContextEnum.List,
    ),
    sort: customSort,
  }))

  // Contrib Field
  if (contribMode) {
    h.push({
      filterable: false,
      sortable: false,
      key: 'contrib',
      title: t('fields.contrib.heading'),
    })
  }

  // Details Field
  h.push({
    filterable: false,
    sortable: false,
    key: 'details',
    title: 'Actions',
  })

  return h
})

function valueToString(item: any) {
  if (Array.isArray(item))
    return item.join(' ')

  return item === undefined || typeof item === 'object' ? '' : item
}

function customSort(a: string, b: string) {
  const first = valueToString(a)
  const second = valueToString(b)

  if (!first && second)
    return -1

  if (first && !second)
    return 1

  if (!first && !second)
    return 0

  return first.localeCompare(second, locale.value, { sensitivity: 'base' })
}

function customFilter(value: any, query: string): boolean {
  value = valueToString(value)

  if (!value)
    return false

  return localeIncludes(value, query, { locales: locale.value, sensitivity: 'base' })
}

function getContext(key: string) {
  return key === 'opening_hours' ? PropertyTranslationsContextEnum.Card : PropertyTranslationsContextEnum.List
}
</script>

<template>
  <VCard class="mt-8">
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
      :loading="loadingState"
      :headers="headers"
      :items="pois?.features"
      :no-data-text="t('poisTable.empty')"
      :search="search"
      :custom-filter="customFilter"
      items-per-page="20"
    >
      <template #item="{ item, columns }">
        <tr>
          <td v-for="col in columns" :key="col.key">
            <ContribFieldGroup
              v-if="col.key === 'contrib' && isContribEligible(item.properties)"
              v-bind="getContributorFields(item)"
            />
            <IconButton
              v-else-if="col.key === 'details'"
              class="tw-h-10"
              :href="`/poi/${item.properties.metadata.id}/details`"
              :label="t('poisTable.details')"
              target="_self"
            >
              <FontAwesomeIcon icon="external-link-alt" />
              {{ t('poisTable.details') }}
            </IconButton>
            <Field
              v-else
              :context="getContext(col.key.split('.').pop())"
              :recursion-stack="[col.key.split('.').pop()]"
              :field="{ field: col.key.split('.').pop() }"
              :details="t('poisTable.details')"
              :properties="item.properties"
              :geom="item.geometry"
            />
          </td>
        </tr>
      </template>
      <template #loading>
        <VSkeletonLoader type="table-row@10" />
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
