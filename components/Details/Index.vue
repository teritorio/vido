<template>
  <div class="w-full container">
    <div>
      <Header :theme="settings.themes[0]" />
      <div class="flex justify-center">
        <TeritorioIconBadge
          :color-fill="colorFill"
          size="2xl"
          :picto="p.display.icon"
        />
      </div>
      <h1>{{ p.name }}</h1>
      <Share
        :title="p.name"
        :href="p.editorial && p.editorial['website:details']"
        :color-line="colorLine"
      />
      <div class="detail-wrapper">
        <div class="detail-left">
          <div v-if="class_label" class="detail-left-block">
            <h2>
              {{ class_label }}
            </h2>
          </div>
          <template v-for="property in detailsProperties">
            <div
              v-if="property == 'description' && p.description"
              :key="property"
              class="detail-left-block"
            >
              <h2>{{ $tc('details.headerDescription') }}</h2>
              <div v-html="p.description"></div>
            </div>

            <Contact
              v-if="property == 'first_contact'"
              :key="property"
              :p="p"
              :color-fill="colorFill"
            />

            <div
              v-if="property == 'opening_hours' && p.opening_hours"
              :key="property"
              class="detail-left-block"
            >
              <h2>{{ $tc('details.headerOpeningHours') }}</h2>
              <OpeningHours :opening-hours="p.opening_hours" :details="true" />
            </div>
          </template>
          <Location :p="p" :geom="poi.geometry" />
        </div>

        <div class="detail-right">
          <Carousel v-if="p.image" :images="p.image" />
          <Mapillary v-if="p.mapillary" :image-id="p.mapillary" />
          <MapPois
            :extra-attributions="settings.attributions"
            :pois="{ features: [poi] }"
            class="relative"
          />
          <p>
            {{ $tc('details.lastUpdate') }}
            <a href="https://www.openstreetmap.org/" target="_blank">
              du 06/02/2022 à 16h 02min 12s
            </a>
          </p>
        </div>
      </div>

      <Footer :attributions="settings.attributions" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import MapPois from '@/components/MapPois.vue'
import TeritorioIconBadge from '@/components/UI/TeritorioIconBadge.vue'
import { ApiPoi, ApiPoiProperties } from '@/lib/apiPois'
import { Settings } from '@/lib/apiSettings'

import Carousel from '~/components/Details/Carousel.vue'
import Contact from '~/components/Details/Contact.vue'
import Footer from '~/components/Details/Footer.vue'
import Header from '~/components/Details/Header.vue'
import Location from '~/components/Details/Location.vue'
import Mapillary from '~/components/Details/Mapillary.vue'
import Share from '~/components/Details/Share.vue'
import { OriginEnum } from '~/utils/types'

export default Vue.extend({
  components: {
    Header,
    TeritorioIconBadge,
    Contact,
    OpeningHours: () => import('@/components/Fields/OpeningHours.vue'),
    Location,
    Share,
    Carousel,
    Mapillary,
    MapPois,
    Footer,
  },

  props: {
    settings: {
      type: Object as PropType<Settings>,
      required: true,
    },
    poi: {
      type: Object as PropType<ApiPoi>,
      required: true,
    },
  },

  computed: {
    p(): ApiPoiProperties {
      return this.poi.properties
    },
    detailsProperties(): string[] {
      let firstContact = false
      return (this.p.editorial?.details_properties || [])
        .map((p) => {
          if (['addr:*', 'phone', 'mobile'].includes(p)) {
            if (!firstContact) {
              firstContact = true
              return 'first_contact'
            } else {
              return undefined
            }
          } else {
            return p
          }
        })
        .filter((e) => e !== undefined) as string[]
    },
    colorFill(): string {
      return this.poi.properties.display?.color_fill || '#76009E'
    },
    colorLine(): string {
      return this.poi.properties.display?.color_line || '#76009E'
    },
    class_label(): string | undefined {
      return (
        this.p.editorial?.class_label_details?.fr ||
        this.p.editorial?.class_label?.fr
      )
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
})
</script>

<style lang="scss" scoped>
@import '@/assets/details.scss';

h1 {
  font-size: 2.4rem;
  text-align: center;
  margin: 0.6rem 0.3rem 0;
  text-transform: uppercase;
}

/deep/ h2 {
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 0.7rem;
  color: $color-title;
  text-transform: uppercase;
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

/deep/ #map {
  width: 100%;
  height: 346px;
}
</style>
