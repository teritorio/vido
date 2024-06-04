<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { localeIncludes } from 'locale-includes'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'
import { type ApiPoi, type ApiPois, type FieldsListItem, getPoiByCategoryId } from '~/lib/apiPois'
import type { ApiMenuCategory } from '~/lib/apiMenu'
import Field from '~/components/Fields/Field.vue'
import IconButton from '~/components/UI/IconButton.vue'
import ContribFieldGroup from '~/components/Fields/ContribFieldGroup.vue'
import Actions from '~/components/PoisList/Actions.vue'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { siteStore as useSiteStore } from '~/stores/site'

interface DataTableHeader {
  filterable?: boolean
  key: string
  sortable?: boolean
  sort?: (a: string, b: string) => number
  title: string
  width?: string
}

const props = defineProps<{
  category?: ApiMenuCategory
  detailsIsExternal?: boolean
}>()

const { routeToString, addressToString } = useField()
const { t, locale } = useI18n()
const siteStore = useSiteStore()
const { $propertyTranslations } = useNuxtApp()
const { contribMode, isContribEligible, getContributorFields } = useContrib()
const search = ref('')

// Fetch POIs by Cache or API
const pois = ref<ApiPois>()

if (props.category) {
  const cachedKey = computed(() => `pois-${props.category!.id}`)
  const { data: cachedPois } = useNuxtData(cachedKey.value)

  if (cachedPois.value) {
    pois.value = cachedPois.value
  }
  else {
    watchEffect(async () => {
      const { data, error } = await useAsyncData(cachedKey.value, () => getPoiByCategoryId(
        siteStore.config!,
        props.category!.id,
        { geometry_as: 'point', short_description: true },
      ))

      if (error.value || !data.value)
        throw createError({ statusCode: 404, statusMessage: 'POIs not found.' })

      pois.value = data.value
    })
  }
}

// Handle default config field if not provided by API
const fields = computed((): FieldsListItem[] => {
  if (
    !pois.value?.features.length
    || !pois.value.features[0].properties.editorial?.list_fields
  ) {
    return [{ field: 'name' }]
  }

  return pois.value.features[0].properties.editorial.list_fields
})

// Transform non-string values to single string
// Used for sort and filter comparisons
if (pois.value) {
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
}

// Transform headers data to be compliant with Vuetify's standards
const headers = computed(() => {
  if (!props.category)
    return []

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
      width: '100px',
    })
  }

  // Details Field
  h.push({
    filterable: false,
    sortable: false,
    key: 'details',
    title: 'Actions',
    width: '100px',
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

function getColKey(key: string) {
  const keySplit = key.split('.')
  if (keySplit.length > 1)
    return keySplit[keySplit.length - 1]

  return key
}
</script>

<template>
  <VCard class="mb-4">
    <VDataTable
      :headers="headers"
      :items="pois?.features"
      :no-data-text="t('poisTable.empty')"
      :search="search"
      :custom-filter="customFilter"
      items-per-page="20"
    >
      <template #top>
        <VContainer
          :style="{ background: '#eeeeee' }"
          class="ma-0"
          tag="header"
          fluid
        >
          <VRow align="center" justify="center" dense>
            <VCol cols="12" sm="4">
              <h1
                v-if="category"
                class="d-flex align-center justify-center justify-sm-start print:tw-pb-4"
              >
                <TeritorioIconBadge
                  :color-fill="category.category.color_fill"
                  :picto="category.category.icon" size="xl"
                />
                {{ category.category.name.fr }}
              </h1>
            </VCol>
            <VCol cols="12" sm="4" class="ml-auto">
              <VTextField
                v-model="search"
                :label="t('poisTable.filter')"
                clearable
                variant="solo-filled"
                hide-details="auto"
              >
                <template #append-inner>
                  <FontAwesomeIcon class="px-2" icon="search" />
                </template>
              </VTextField>
            </VCol>
            <VCol cols="12" sm="auto">
              <Actions
                v-if="category"
                class="ma-0 w-auto"
                :category-id="category.id"
                :color-line="category.category.color_line"
              />
            </VCol>
          </VRow>
        </VContainer>
      </template>
      <template #item="{ item, columns }">
        <tr>
          <td v-for="col in columns" :key="col.key!">
            <ContribFieldGroup
              v-if="col.key === 'contrib' && isContribEligible(item.properties)"
              v-bind="getContributorFields(item)"
            />
            <IconButton
              v-else-if="col.key === 'details' && item.properties.editorial && item.properties.editorial['website:details']"
              class="tw-h-10"
              :href="item.properties.editorial['website:details']"
              :label="t('poisTable.details')"
              :target="detailsIsExternal ? '_blank' : '_self'"
            >
              <FontAwesomeIcon icon="external-link-alt" />
              {{ t('poisTable.details') }}
            </IconButton>
            <Field
              v-else
              :context="getContext(getColKey(col.key!))"
              :recursion-stack="[getColKey(col.key!)]"
              :field="{ field: getColKey(col.key!) }"
              :details="t('poisTable.details')"
              :properties="item.properties"
              :geom="item.geometry"
            />
          </td>
        </tr>
      </template>
    </VDataTable>
  </VCard>
</template>

<style scoped>
.v-data-table .v-table__wrapper > table tbody > tr:nth-child(even) > td,
:deep(.v-data-table .v-table__wrapper > table > thead > tr th) {
  background: #F3F4F6;
}

.v-data-table {
  min-height: 350px;
}

h1 {
  font-size: 1.25rem;
  font-weight: 400;
  gap: 8px;
  letter-spacing: 0;
  line-height: 1.75rem;
}
</style>
