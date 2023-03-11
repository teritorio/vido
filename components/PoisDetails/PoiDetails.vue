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
        :class="['w-11 h-11', 'mr-3 sm:mr-9']"
        @click.stop="toggleFavorite"
      >
        <FavoriteIcon :is-active="isFavorite" :color-line="colorLine" />
      </IconButton>
      <IconButton
        :href="mapURL"
        :label="$t('poiCard.backToMap')"
        :class="['w-11 h-11', 'mr-3 sm:mr-9']"
        @click="!mapURL && back()"
      >
        <TeritorioIcon picto="map" class="text-zinc-800" />
      </IconButton>
    </template>
    <template #actions>
      <Share
        :title="poi.properties.name"
        :href="
          poi.properties.editorial &&
          poi.properties.editorial['website:details']
        "
        :color-line="colorLine"
      />
    </template>
    <template #body>
      <div class="detail-wrapper">
        <div class="detail-left">
          <Fields
            v-if="detailsFields"
            :fields="detailsFields"
            :properties="properties"
            :color-fill="colorFill"
            :geom="poi.geometry"
            class="detail-left-block"
          />
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
              class="relative"
              :off-map-attribution="true"
            />
          </template>

          <Fields
            v-else
            :fields="[
              {
                group: 'description',
                display_mode: 'standard',
                fields: [{ field: 'description' }],
                icon: '',
              },
            ]"
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
        <a
          v-if="
            poi.properties.metadata.osm_type && poi.properties.metadata.osm_id
          "
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

<script lang="ts">
import { mapState } from 'pinia'
import { PropType } from 'vue'

import { defineNuxtComponent, useNuxtApp, useRoute, useRouter } from '#app'
import PoiLayout from '~/components/Layout/PoiLayout.vue'
import MapPois from '~/components/Map/MapPois.vue'
import Carousel from '~/components/PoisDetails/Carousel.vue'
import Fields from '~/components/PoisDetails/Fields.vue'
import Mapillary from '~/components/PoisDetails/Mapillary.vue'
import RouteMap from '~/components/PoisDetails/Route/RouteMap.vue'
import Share from '~/components/PoisDetails/Share.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import IconButton from '~/components/UI/IconButton.vue'
import RelativeDate from '~/components/UI/RelativeDate.vue'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import { ContentEntry } from '~/lib/apiContent'
import { ApiPoiDeps } from '~/lib/apiPoiDeps'
import { ApiPoi, ApiPoiId, FieldsList } from '~/lib/apiPois'
import { Settings } from '~/lib/apiSettings'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'
import { favoritesStore } from '~/stores/favorite'
import { OriginEnum } from '~/utils/types'

export default defineNuxtComponent({
  components: {
    PoiLayout,
    IconButton,
    FavoriteIcon,
    TeritorioIcon,
    Share,
    Carousel,
    Mapillary,
    MapPois,
    RouteMap,
    Fields,
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
      } else {
        const { ['description']: omitted, ...rest } = this.poi.properties
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
      } else {
        // @ts-ignore
        return fields.filter((field) => field.field != 'description')
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
        this.poi.properties.editorial?.class_label_details?.fr ||
        this.poi.properties.editorial?.class_label?.fr
      )
    },

    id(): ApiPoiId {
      return this.poi.properties.metadata.id
    },

    isFavorite(): boolean {
      return this.favoritesIds.includes(this.id)
    },

    mapURL(): string | undefined {
      // Use history back rather than forward to map
      const mapIsBack = useNuxtApp().context.from?.matched.some(
        (route) => route.name === 'index'
      )
      if (mapIsBack) {
        return undefined
      } else {
        const categoryIds =
          this.poi.properties.metadata.category_ids?.join(',') + '/'
        const id = this.poi.properties.metadata.id
        return `${this.settings.themes[0].site_url.fr}${categoryIds}${id}`
      }
    },
  },

  mounted() {
    favoritesStore().initFavoritesFromLocalStorage()
    const { $tracking } = useNuxtApp()
    $tracking({
      type: 'page',
      title: useRoute().name,
      location: window.location.href,
      path: useRoute().path,
      origin:
        OriginEnum[
          useRouter().currentRoute.value.query.origin as keyof typeof OriginEnum
        ],
    })
  },

  methods: {
    toggleFavorite() {
      if (this.id) {
        const { $tracking } = useNuxtApp()
        $tracking({
          type: 'details_event',
          event: 'favorite',
          poiId: this.id,
          title: this.poi.properties.name,
        })
        favoritesStore().toggleFavorite(this.poi)
      }
    },

    back(): void {
      useRouter().go(-1)
    },
  },
})
</script>

<style lang="scss" scoped>
@import '~/assets/details.scss';

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
    padding-right: 0;

    .detail-left-block {
      margin: 0 0 3.3rem;
      padding: 0 1.6rem;
    }
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

@media (max-width: 991px) {
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
  @apply list-disc ml-6;
}

:deep(#map-container) {
  width: 100%;
  height: 346px;
}
</style>
