<script lang="ts">
import { mapState } from 'pinia'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
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
import type { ContentEntry } from '~/lib/apiContent'
import type { ApiPoiDeps } from '~/lib/apiPoiDeps'
import type { ApiPoi, ApiPoiId, FieldsList } from '~/lib/apiPois'
import type { Settings } from '~/lib/apiSettings'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'
import { favoritesStore } from '~/stores/favorite'
import { OriginEnum } from '~/utils/types'
import FieldsHeader from '~/components/UI/FieldsHeader.vue'
import ContribFieldGroup from '~/components/Fields/ContribFieldGroup.vue'

export default defineNuxtComponent({
  components: {
    ContribFieldGroup,
    PoiLayout,
    IconButton,
    FavoriteIcon,
    FieldsHeader,
    TeritorioIcon,
    Share,
    Carousel,
    Mapillary,
    MapPois,
    RouteMap,
    FieldsGroup,
    RelativeDate,
  },

  props: {
    settings: {
      type: Object as PropType<Settings>,
      required: true,
    },
    navMenuEntries: {
      type: Array as PropType<ContentEntry[]>,
      required: true,
    },
    poi: {
      type: Object as PropType<ApiPoi>,
      required: true,
    },
    poiDeps: {
      type: Object as PropType<ApiPoiDeps>,
      default: null,
    },
  },

  data() {
    const { contribMode, isContribEligible, getContributorFields } = useContrib()

    return {
      contribMode,
      isContribEligible,
      getContributorFields,
    }
  },

  computed: {
    ...mapState(favoritesStore, ['favoritesIds']),

    context(): PropertyTranslationsContextEnum {
      return PropertyTranslationsContextEnum.Details
    },

    favoritesModeEnabled(): boolean {
      return this.settings.themes[0]?.favorites_mode ?? true
    },

    properties(): ApiPoi['properties'] {
      if (!this.isLargeLayeout) {
        return this.poi.properties
      }
      else {
        const { 'description': _omitted, ...rest } = this.poi.properties
        return rest
      }
    },

    isLargeLayeout(): boolean {
      return this.poiDeps?.features.length > 0
    },

    detailsFields(): FieldsList | undefined {
      const fields = this.poi.properties.editorial?.details_fields
      if (!fields || !this.isLargeLayeout) {
        return fields
      }
      else {
        // @ts-expect-error: ignore
        return fields.filter(field => field.field !== 'description')
      }
    },

    colorFill(): string {
      return this.poi.properties.display?.color_fill || '#76009E'
    },

    colorLine(): string {
      return this.poi.properties.display?.color_line || '#76009E'
    },

    classLabel(): string | undefined {
      return (
        this.poi.properties.editorial?.class_label_details?.fr
          || this.poi.properties.editorial?.class_label?.fr
      )
    },

    id(): ApiPoiId {
      return this.poi.properties.metadata.id
    },

    isFavorite(): boolean {
      return this.favoritesIds.includes(this.id)
    },

    mapURL(): string | undefined {
      // Assume if there is a history on the same site, it comes form the main map
      const localHistoryBack
        = this.$router.options.history.state.back
        && !(this.$router.options.history.state.back as string).startsWith('http')
      if (localHistoryBack) {
        // Use history back rather than forward to map
        return undefined
      }
      else {
        const categoryIds
          = `${this.poi.properties.metadata.category_ids?.join(',')}/`
        const id = this.poi.properties.metadata.id
        return `/${categoryIds}${id}`
      }
    },
  },

  mounted() {
    favoritesStore().initFavoritesFromLocalStorage()
    this.$tracking({
      type: 'page',
      title: (this.$route.name && String(this.$route.name)) || undefined,
      location: window.location.href,
      path: this.$route.path,
      origin:
        OriginEnum[
          this.$router.currentRoute.value.query
            .origin as keyof typeof OriginEnum
        ],
    })
  },

  methods: {
    toggleFavorite() {
      if (this.id) {
        this.$tracking({
          type: 'details_event',
          event: 'favorite',
          poiId: this.id,
          title: this.poi.properties.name,
        })
        favoritesStore().toggleFavorite(this.poi)
      }
    },

    back(): void {
      this.$router.go(-1)
    },
  },
})
</script>

<template>
  <PoiLayout
    :settings="settings"
    :nav-menu-entries="navMenuEntries"
    :name="poi.properties.name"
    :icon="poi.properties.display && poi.properties.display.icon"
    :color-line="colorLine"
    :color-fill="colorFill"
  >
    <template #headerButtons>
      <IconButton
        :label="
          isFavorite ? $t('poiCard.favoriteOn') : $t('poiCard.favoriteOff')
        "
        class="tw-w-11 tw-h-11 tw-mr-3 sm:tw-mr-9"
        @click.stop="toggleFavorite"
      >
        <FavoriteIcon :is-active="isFavorite" :color-line="colorLine" />
      </IconButton>
      <IconButton
        :href="mapURL"
        :label="$t('poiCard.backToMap')"
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
            :geom="poi.geometry"
          />
          <div v-if="contribMode && isContribEligible(poi.properties)">
            <FieldsHeader :recursion-stack="[]">
              {{ $t('fields.contrib.heading') }}
            </FieldsHeader>
            <ContribFieldGroup v-bind="getContributorFields(poi)" />
          </div>
        </div>

        <div class="detail-right">
          <Mapillary
            v-if="poi.properties.mapillary"
            :image-id="poi.properties.mapillary"
          />
          <Carousel
            v-else-if="poi.properties.image"
            :images="poi.properties.image"
          />

          <template v-if="!isLargeLayeout">
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
          />
        </div>
      </div>

      <RouteMap
        v-if="isLargeLayeout"
        id="route-map"
        :poi-id="id"
        :route="poiDeps"
        :color-fill="colorFill"
        :color-line="colorLine"
        :favorites-mode-enabled="favoritesModeEnabled"
      />
    </template>

    <template #footer>
      <span v-if="poi.properties.metadata.updated_at">
        {{ $t('poiDetails.lastUpdate') }}
        <RelativeDate :date="poi.properties.metadata.updated_at" />
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
