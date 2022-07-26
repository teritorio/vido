<template>
  <div class="w-full container">
    <div>
      <Header
        :theme="settings.themes[0]"
        :nav-menu-entries="navMenuEntries"
        :color-line="colorLine"
      >
        <button
          :aria-label="
            isFavorite ? $tc('poiCard.favoriteOn') : $tc('poiCard.favoriteOff')
          "
          class="text-sm text-zinc-800 bg-white rounded-full shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 shrink-0"
          @click.stop="toggleFavorite"
        >
          <FavoriteIcon :is-active="isFavorite" :color-line="colorLine" />
        </button>
      </Header>
      <div class="flex justify-center">
        <TeritorioIconBadge
          :color-fill="colorFill"
          size="2xl"
          :picto="poi.properties.display.icon"
        />
      </div>
      <h1>{{ poi.properties.name }}</h1>
      <Share
        :title="poi.properties.name"
        :href="
          poi.properties.editorial &&
          poi.properties.editorial['website:details']
        "
        :color-line="colorLine"
      />
      <div class="detail-wrapper">
        <div class="detail-left">
          <div v-if="classLabel" class="detail-left-block">
            <h2>
              {{ classLabel }}
            </h2>
          </div>
          <PoiDetailsFields
            :properties="poi.properties"
            :color-fill="colorFill"
          />
        </div>

        <div class="detail-right">
          <Carousel
            v-if="poi.properties.image"
            :images="poi.properties.image"
          />
          <Mapillary
            v-if="poi.properties.mapillary"
            :image-id="poi.properties.mapillary"
          />
          <template v-if="!Boolean(route)">
            <MapPois
              :extra-attributions="settings.attributions"
              :pois="{ features: [poi] }"
              class="relative"
            />
            <p>
              {{ $tc('poiDetails.lastUpdate') }}
              <a href="https://www.openstreetmap.org/" target="_blank">
                du 06/02/2022 à 16h 02min 12s
              </a>
            </p>
            <Location :p="poi.properties" :geom="poi.geometry" />
          </template>
        </div>
      </div>

      <RouteMap
        v-if="Boolean(route)"
        id="route-map"
        :route="route"
        :color-fill="colorFill"
      />

      <Footer :attributions="settings.attributions" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import MapPois from '~/components/MapPois.vue'
import Carousel from '~/components/PoisDetails/Carousel.vue'
import Footer from '~/components/PoisDetails/Footer.vue'
import Header from '~/components/PoisDetails/Header.vue'
import Location from '~/components/PoisDetails/Location.vue'
import Mapillary from '~/components/PoisDetails/Mapillary.vue'
import PoiDetailsFields from '~/components/PoisDetails/PoiDetailsFields.vue'
import RouteMap from '~/components/PoisDetails/Route/RouteMap.vue'
import Share from '~/components/PoisDetails/Share.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { ContentEntry } from '~/lib/apiContent'
import { ApiPoi } from '~/lib/apiPois'
import { ApiRoute } from '~/lib/apiRoutes'
import { Settings } from '~/lib/apiSettings'
import { OriginEnum } from '~/utils/types'

export default Vue.extend({
  components: {
    Header,
    FavoriteIcon,
    TeritorioIconBadge,
    Location,
    Share,
    Carousel,
    Mapillary,
    MapPois,
    Footer,
    RouteMap,
    PoiDetailsFields,
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
    route: {
      type: Object as PropType<ApiRoute>,
      default: null,
    },
  },

  computed: {
    ...mapGetters({
      favoritesIds: 'favorite/favoritesIds',
    }),

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

    isFavorite(): boolean {
      return this.favoritesIds.includes(this.poi.properties.metadata?.id)
    },
  },

  mounted() {
    this.$tracking({
      type: 'page',
      title: this.$meta().refresh().metaInfo.title,
      location: window.location.href,
      path: this.$route.path,
      origin:
        OriginEnum[
          this.$router.currentRoute.query.origin as keyof typeof OriginEnum
        ],
    })
  },

  methods: {
    toggleFavorite() {
      if (this.poi.properties.metadata?.id) {
        this.$tracking({
          type: 'details_event',
          event: 'favorite',
          poiId: this.poi.properties.metadata?.id,
          title: this.poi.properties.name,
        })
        this.$store.dispatch('favorite/toggleFavorite', this.poi)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
@import '~/assets/details.scss';

h1 {
  font-size: 2.4rem;
  text-align: center;
  margin: 0.6rem 0.3rem 0;
  text-transform: uppercase;
}

:deep(h2) {
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 0.7rem;
  color: $color-title;
  text-transform: uppercase;
}

:deep(h3) {
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 0.7rem;
  color: $color-title;
}

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
      margin: 0 0 4rem;
      padding: 0 1.6rem;
      font-size: 1.2rem;
      color: $color-text;
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

:deep(#map) {
  width: 100%;
  height: 346px;
}
</style>