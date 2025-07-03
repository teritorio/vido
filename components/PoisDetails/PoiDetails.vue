<script setup lang="ts">
import { storeToRefs } from 'pinia'
import PoiLayout from '~/components/Layout/PoiLayout.vue'
import MapPois from '~/components/Map/MapPois.vue'
import Carousel from '~/components/PoisDetails/Carousel.vue'
import FieldsGroup from '~/components/PoisDetails/FieldsGroup.vue'
import Mapillary from '~/components/PoisDetails/Mapillary.vue'
import RouteMap from '~/components/PoisDetails/Route/RouteMap.vue'
import Share from '~/components/PoisDetails/Share.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import IconButton from '~/components/UI/IconButton.vue'
import RelativeDate from '~/components/UI/RelativeDate.vue'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import type { ApiPoiDeps } from '~/lib/apiPoiDeps'
import type { ApiPoi, ApiPoiId, FieldsList } from '~/lib/apiPois'
import type { Settings } from '~/lib/apiSettings'
import { favoriteStore as useFavoriteStore } from '~/stores/favorite'
import { OriginEnum } from '~/utils/types'
import FieldsHeader from '~/components/UI/FieldsHeader.vue'
import ContribFieldGroup from '~/components/Fields/ContribFieldGroup.vue'
import PanoramaxViewer from '~/components/PanoramaxViewer.client.vue'

const props = defineProps<{
  settings: Settings
  poi: ApiPoi
  poiDeps?: ApiPoiDeps
  pageTitle: string
}>()

const { t } = useI18n()
const { $tracking } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const favoriteStore = useFavoriteStore()
const { favoritesIds, favoriteAddresses } = storeToRefs(favoriteStore)
const { contribMode, isContribEligible, getContributorFields } = useContrib()

if (!props.poi.properties.display)
  throw createError(`Feature ${props.poi.properties.metadata.id} is missing 'display' property.`)

const { colorFill, colorText } = useContrastedColors(
  props.poi.properties.display.color_fill,
  props.poi.properties.display.color_text,
)

const isLargeLayout = computed((): boolean => {
  if (!props.poiDeps)
    return false

  return props.poiDeps.features.length > 0
})

const properties = computed((): ApiPoi['properties'] => {
  if (!isLargeLayout.value) {
    return props.poi.properties
  }
  else {
    const { 'description': _omitted, ...rest } = props.poi.properties
    return rest
  }
})

const detailsFields = computed((): FieldsList | undefined => {
  const fields = props.poi.properties.editorial?.details_fields
  if (!fields || !isLargeLayout.value) {
    return fields
  }
  else {
    // @ts-expect-error: ignore
    return fields.filter(field => field.field !== 'description')
  }
})

const colorLine = computed((): string => {
  return props.poi.properties.display?.color_line || '#76009E'
})

const id = computed((): ApiPoiId => {
  return props.poi.properties.metadata.id
})

const isFavorite = computed((): boolean => {
  return favoritesIds.value.includes(id.value) || favoriteAddresses.value.has(id.value.toString())
})

const mapURL = computed((): string | undefined => {
  // Assume if there is a history on the same site, it comes form the main map
  const localHistoryBack = router.options.history.state.back && !(router.options.history.state.back as string).startsWith('http')

  if (localHistoryBack) {
    // Use history back rather than forward to map
    return undefined
  }
  else {
    const categoryIds = `${props.poi.properties.metadata.category_ids?.join(',')}/`
    const id = props.poi.properties.metadata.id
    return `/${categoryIds}${id}`
  }
})

function toggleFavorite(): void {
  if (id.value) {
    $tracking({
      type: 'details_event',
      event: 'favorite',
      poiId: id.value,
      title: props.poi.properties.name,
    })

    if (props.poi.properties.internalType === 'address')
      favoriteStore.toggleFavoriteAddr(props.poi)
    else
      favoriteStore.toggleFavorite(props.poi)
  }
}

function back(): void {
  router.go(-1)
}

onMounted(() => {
  favoriteStore.init()
  $tracking({
    type: 'page',
    title: (route.name && String(route.name)) || undefined,
    location: window.location.href,
    path: route.path,
    origin:
        OriginEnum[
          router.currentRoute.value.query
            .origin as keyof typeof OriginEnum
        ],
  })
})
</script>

<template>
  <PoiLayout
    :settings="settings"
    :name="pageTitle"
    :icon="poi.properties.display && poi.properties.display.icon"
    :color-line="colorLine"
    :color-fill="colorFill"
    :color-text="colorText"
  >
    <template #headerButtons>
      <IconButton
        :label="isFavorite ? t('poiCard.favoriteOn') : t('poiCard.favoriteOff')"
        class="tw-w-11 tw-h-11 tw-mr-3 sm:tw-mr-9"
        @click.stop="toggleFavorite"
      >
        <FavoriteIcon :is-active="isFavorite" :color-line="colorLine" />
      </IconButton>
      <IconButton
        :href="mapURL"
        :label="t('poiCard.backToMap')"
        class="tw-w-11 tw-h-11 tw-mr-3 sm:tw-mr-9"
        @click="!mapURL && back()"
      >
        <TeritorioIcon picto="map" class="tw-text-zinc-800" />
      </IconButton>
    </template>
    <template #actions>
      <Share
        class="print:tw-hidden"
        :title="poi.properties.name"
        :href="
          poi.properties.editorial
            && poi.properties.editorial['website:details']
        "
        :color-line="colorLine"
      />
    </template>
    <template #body>
      <div class="detail-wrapper">
        <div class="detail-left">
          <FieldsGroup
            v-if="detailsFields"
            :group="{
              group: 'root',
              fields: detailsFields,
              display_mode: 'standard',
              icon: '',
            }"
            :properties="properties"
            :color-fill="colorFill"
            :color-text="colorText"
            :geom="poi.geometry"
          />
          <div v-if="contribMode && isContribEligible(poi.properties)">
            <FieldsHeader :recursion-stack="[]">
              {{ t('fields.contrib.heading') }}
            </FieldsHeader>
            <ContribFieldGroup v-bind="getContributorFields(poi)" />
          </div>
        </div>

        <div class="detail-right">
          <PanoramaxViewer
            v-if="poi.properties.panoramax"
            :picture-id="poi.properties.panoramax"
          />

          <Mapillary
            v-else-if="poi.properties.mapillary"
            :image-id="poi.properties.mapillary"
          />

          <Carousel
            v-else-if="poi.properties.image"
            :images="poi.properties.image"
          />

          <template v-if="!isLargeLayout">
            <MapPois
              :extra-attributions="settings.attributions"
              :feature-ids="[id]"
              :features="[poi]"
              class="tw-relative poi-map"
              :off-map-attribution="true"
            />
          </template>

          <FieldsGroup
            v-else
            :group="{
              group: 'root',
              display_mode: 'standard',
              icon: '',
              fields: [
                {
                  group: 'description',
                  display_mode: 'standard',
                  fields: [{ field: 'description' }],
                  icon: '',
                },
              ],
            }"
            :properties="poi.properties"
            :geom="poi.geometry"
            :color-fill="colorFill"
            :color-text="colorText"
          />
        </div>
      </div>

      <RouteMap
        v-if="isLargeLayout && poiDeps"
        id="route-map"
        :poi="poi"
        :route="poiDeps"
        :color-fill="colorFill"
        :color-text="colorText"
        :color-line="colorLine"
      />
    </template>

    <template #footer>
      <span v-if="poi.properties.metadata.updated_at">
        {{ t('poiDetails.lastUpdate') }}
        <a
          v-if="poi.properties.metadata.osm_type && poi.properties.metadata.osm_id"
          :href="`https://www.openstreetmap.org/${poi.properties.metadata.osm_type}/${poi.properties.metadata.osm_id}`"
          target="_blank"
        >
          <RelativeDate :date="poi.properties.metadata.updated_at" />
        </a>
        <RelativeDate v-else :date="poi.properties.metadata.updated_at" />
      </span>
    </template>
  </PoiLayout>
</template>

<style lang="scss" scoped>
@import '~/assets/details';

.detail-wrapper {
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  .detail-left {
    width: 34%;
    box-sizing: border-box;
    padding: 0 1.6rem;
    padding-right: 0;
    margin: 0 0 3.3rem;
  }

  .detail-right {
    display: flex;
    gap: 1rem;
    flex-direction: column;
    width: 66%;
    padding-left: 3.3rem;
  }
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: auto;
}

@media (width <= 991px) {
  .detail-wrapper {
    flex-direction: column;

    .detail-left,
    .detail-right {
      width: 100%;
      padding-left: 0;
      padding-right: 0;
    }
  }
}

.detail-wrapper :deep(ul) {
  @apply tw-list-disc tw-ml-6;
}

:deep(#map-container) {
  width: 100%;
  height: 500px;
}
</style>
