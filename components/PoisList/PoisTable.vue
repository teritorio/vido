<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { localeIncludes } from 'locale-includes'
import { storeToRefs } from 'pinia'
import { PropertyTranslationsContextEnum, useSiteStore } from '~/stores/site'
import type { FieldsListItem } from '~/lib/apiPois'
import Field from '~/components/Fields/Field.vue'
import IconButton from '~/components/UI/IconButton.vue'
import ContribFieldGroup from '~/components/Fields/ContribFieldGroup.vue'
import Actions from '~/components/PoisList/Actions.vue'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { menuStore as useMenuStore } from '~/stores/menu'
import { headerFromSettings } from '~/lib/apiSettings'

interface DataTableHeader {
  filterable?: boolean
  key: string
  sortable?: boolean
  sort?: (a: string, b: string) => number
  title: string
  width?: string
}

//
// Props
//
defineProps<{
  detailsIsExternal?: boolean
}>()

//
// Composables
//
const { t, locale } = useI18n()
const siteStore = useSiteStore()
const { p } = siteStore
const { settings, theme } = storeToRefs(siteStore)
const menuStore = useMenuStore()
const { contribMode, isContribEligible, getContributorFields } = useContrib()
const route = useRoute()

//
// Data
//
const search = ref('')

//
// Data Fetching
//
const { pois, error, pending, status } = usePois()

if (error.value) {
  clearError()
}

//
// Computed
//
const headers = computed(() => {
  let fields = [{ field: 'name' }]
  if (pois.value?.features.length && pois.value.features[0].properties.editorial?.list_fields)
    fields = pois.value.features[0].properties.editorial.list_fields

  const headers: DataTableHeader[] = fields.map((f: FieldsListItem) => ({
    filterable: true,
    key: `properties.${f.field}`,
    sortable: true,
    title: p(
      f.field,
      PropertyTranslationsContextEnum.List,
    ),
    sort: customSort,
  }))

  if (contribMode) {
    headers.push({
      filterable: false,
      sortable: false,
      key: 'contrib',
      title: t('fields.contrib.heading'),
      width: '100px',
    })
  }

  headers.push({
    filterable: false,
    sortable: false,
    key: 'details',
    title: 'Actions',
    width: '100px',
  })

  return headers
})

const category = computed(() => {
  if (!route.params.id)
    return undefined

  const categoryExists = menuStore.getCurrentCategory(Number.parseInt(route.params.id as string))

  if (!categoryExists) {
    throw createError({ statusCode: 404, message: 'Category Not Found' })
  }

  return categoryExists
})

const teritorioIconBadgeProps = computed(() => {
  if (!category.value) {
    throw createError({ statusCode: 404, message: 'Category Not Found' })
  }

  const { colorFill, colorText } = getContrastedColors()

  return {
    colorFill: colorFill.value,
    colorText: colorText.value,
    picto: category.value!.category.icon,
    size: 'xl',
  }
})

function getContrastedColors() {
  if (!category.value) {
    throw createError({ statusCode: 404, message: 'Category Not Found' })
  }

  const { colorFill, colorText } = useContrastedColors(
    category.value.category.color_fill,
    category.value.category.color_text,
  )
  return { colorFill, colorText }
}

//
// Methods
//
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

if (settings.value && theme.value) {
  useHead(
    headerFromSettings(
      theme.value,
      settings.value.icon_font_css_url,
      { title: category.value?.category.name.fr },
    ),
  )
}
</script>

<template>
  <VCard class="mb-4">
    <!-- Because of Vuetify internal hydration mismatch (See: https://github.com/vuetifyjs/vuetify/issues/19696) -->
    <ClientOnly>
      <VBanner v-if="error" bg-color="#F44336" :text="error.message" />
      <VDataTable
        v-else
        :loading="pending && status === 'pending'"
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
                  <TeritorioIconBadge v-bind="teritorioIconBadgeProps" />
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
        <template #loading>
          <v-skeleton-loader type="table-row@10" />
        </template>
      </VDataTable>
    </ClientOnly>
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
