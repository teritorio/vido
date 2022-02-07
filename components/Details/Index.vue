<template>
  <div class="page-template-template-fiche">
    <div>
      <Header :theme="siteInfos && siteInfos.themes && siteInfos.themes[0]" />

      <div class="h1-icon" :style="`background-color:${color}`">
        <TeritorioIcon
          :category-color="color"
          class="text-2xl"
          :picto="p.display.icon"
        />
      </div>
      <h1>{{ p.name }}</h1>
      <Breadcrumb
        :color="color"
        :entries="[
          { text: 'Carte', href: '/' },
          { text: 'todo ' },
          { text: 'todo' },
        ]"
      />
      <Share
        :title="p.name"
        :href="p.editorial && p.editorial['website:details']"
        :color="color"
      />
      <div class="detail-wrapper">
        <div class="detail-left">
          <div
            v-if="
              p.editorial.class_label_details.fr || p.editorial.class_label.fr
            "
            class="detail-left-block"
          >
            <h2>
              {{
                p.editorial.class_label_details.fr || p.editorial.class_label.fr
              }}
            </h2>
          </div>

          <div v-if="p.description" class="detail-left-block">
            <h2>Descriptif</h2>
            <p>{{ p.description }}</p>
          </div>

          <Contact :p="p" :color="color" />
          <Location :p="p" :geom="poi.geometry" />
        </div>

        <div class="detail-right">
          <Carousel v-if="p.image" :images="p.image" />
          <MapPoi :poi="poi" />
          <p>
            Dernière
            <a href="https://www.openstreetmap.org/" target="_blank">
              modification
            </a>
            du 06/02/2022 à 16h 02min 12s
          </p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import MapPoi from '@/components/MapPoi.vue'
import TeritorioIcon from '@/components/TeritorioIcon/TeritorioIcon.vue'

import Breadcrumb from '~/components/Details/Breadcrumb.vue'
import Carousel from '~/components/Details/Carousel.vue'
import Contact from '~/components/Details/Contact.vue'
import Footer from '~/components/Details/Footer.vue'
import Header from '~/components/Details/Header.vue'
import Location from '~/components/Details/Location.vue'
import Share from '~/components/Details/Share.vue'
import { VidoFeature, SiteInfos } from '~/utils/types'

export default Vue.extend({
  components: {
    Header,
    TeritorioIcon,
    Breadcrumb,
    Contact,
    Location,
    Share,
    Carousel,
    MapPoi,
    Footer,
  },

  props: {
    poi: {
      type: Object as PropType<VidoFeature>,
      required: true,
    },
  },

  data(): {
    siteInfos: SiteInfos | null
  } {
    return {
      siteInfos: null,
    }
  },

  async fetch() {
    this.siteInfos = await fetch(
      `${this.$config.API_ENDPOINT}/${this.$config.API_PROJECT}/${this.$config.API_THEME}`
    ).then((res) => res.json())
  },

  // fetchOnServer: false,
  head() {
    if (this.siteInfos?.themes) {
      return {
        // @ts-ignore - Look ok, unable to fix the issue
        title: `${this.siteInfos.themes[0].title.fr} - ${this.p.name}`,
        link: [
          {
            rel: 'stylesheet',
            // @ts-ignore - Look ok, unable to fix the issue
            href: this.siteInfos.icon_font_css_url,
          },
          {
            rel: 'icon',
            // @ts-ignore - Look ok, unable to fix the issue
            href: this.siteInfos.themes[0].favicon_url,
          },
        ],
      }
    } else {
      return {}
    }
  },

  computed: {
    p() {
      return this.poi.properties
    },
    color() {
      return this.poi.properties.display?.color || '#76009E'
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/details.scss';

.h1-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.3rem;
  height: 3.3rem;
  margin: auto;
  border-radius: 50%;

  i {
    color: #fff;
  }
}

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
  flex-direction: row;
  justify-content: flex-start;
  justify-content: space-between;

  .detail-left {
    width: 34%;
    padding-right: 0;

    .detail-left-block {
      margin: 0;
      margin-bottom: 4rem;
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

// @media (max-width: 1200px) {
//   h1 {
//     font-size: 2.7rem;
//   }
// }

@media (max-width: 991px) {
  //   h1 {
  //     font-size: 2.1rem;
  //   }
  //   .detail-wrapper {
  //     flex-direction: column;
  //   }
  //   .detail-right {
  //     margin-bottom: 2.9rem;

  //     .detail-left-block {
  //       padding: 0 1.6rem;
  //     }
  //   }

  .detail-left,
  .detail-right {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
  }

  .share {
    text-align: center;
  }

  /deep/ .detail-left-block {
    margin-bottom: 2.7rem;
  }
}

@media (max-width: 768px) {
  //   h1 {
  //     font-size: 1.7rem;
  //     margin-bottom: 0.7rem;
  //   }
  //   .detail-left-block h2 {
  //     font-size: 1.6rem;
  //   }
}

/deep/ #map {
  width: 100%;
  height: 346px;
}
</style>
