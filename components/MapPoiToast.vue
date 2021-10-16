<template>
  <div
    class="z-10 flex flex-col w-full max-w-xl mx-0 overflow-y-auto bg-white shadow-md pointer-events-auto sm:flex-row sm:w-auto sm:mx-auto sm:rounded-xl poiDescription"
  >
    <img
      v-if="poiProp('teritorio:image')"
      class="object-cover w-full h-auto max-h-44 sm:max-h-full sm:w-52"
      :src="poiProp('teritorio:image')"
      alt=""
    />

    <div
      class="px-8 py-6 flex flex-col sm:overflow-y-auto flex-grow sm:h-50 h-auto sm:max-h-full box-border w-full sm:w-80 md:h-80 md:max-h-full md:w-96"
    >
      <div class="flex items-center justify-between flex-shrink-0">
        <h2
          class="block text-xl font-semibold leading-tight"
          :style="'color:' + color"
          title="Zoomer sur le lieu"
        >
          {{ name }}
        </h2>

        <a
          v-if="hasFiche"
          class="ml-6 md:ml-8 px-3 py-1.5 text-xs text-gray-800 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 transition transition-colors rounded-md"
          :href="poiProp('teritorio:url')"
          rel="noopener noreferrer"
          target="_blank"
          @click.stop
        >
          Détails
        </a>
      </div>

      <div class="flex items-center mt-2 text-sm text-gray-500 flex-shrink-0">
        <TeritorioIcon
          v-if="icon"
          :category-color="color"
          class="mr-2"
          :picto="icon"
          :use-category-color="true"
          :use-native-alignment="false"
        />

        <font-awesome-icon
          v-if="faIcon"
          :icon="faIcon"
          :color="color"
          class="mr-2"
          size="sm"
        />

        {{ category }}
      </div>

      <div class="h-auto flex-grow flex-shrink-0">
        <p class="mt-6 text-sm">
          <template v-if="address">
            {{ address }}
          </template>
        </p>

        <div
          v-for="field in listFields"
          :key="encodeURIComponent(field)"
          class="text-sm mt-2"
        >
          <ul v-if="field.k === 'phone' && $isMobile()">
            <li v-for="item in field.v" :key="item">
              <a
                class="text-blue-400"
                :href="'tel:' + item"
                title="Appeler ce numéro"
              >
                {{ item }}
              </a>
            </li>
          </ul>
          <ul v-else-if="field.k === 'mobile' && $isMobile()">
            <li v-for="item in field.v" :key="item">
              <a
                class="text-blue-400"
                :href="'tel:' + item"
                title="Appeler ce numéro"
              >
                {{ item }}
              </a>
            </li>
          </ul>

          <ul v-else-if="field.k === 'opening_hours'">
            <li v-for="item in opening_hours" :key="item">
              <p class="text-sm mt-1">
                {{ item }}
              </p>
            </li>
          </ul>

          <ul v-else-if="Array.isArray(field.v)">
            <li v-for="item in field.v" :key="item">
              <p class="text-sm mt-1">
                {{ item }}
              </p>
            </li>
          </ul>

          <p v-else-if="field.v.length > textLimit" class="text-sm">
            {{ field.v.substring(0, textLimit) + ' ...' }}
            <a
              v-if="hasFiche"
              class="underline"
              :href="poiProp('teritorio:url')"
              rel="noopener noreferrer"
              target="_blank"
              @click.stop
            >
              Voir le detail
            </a>
          </p>
          <p v-else class="text-sm">
            {{ field.v }}
          </p>
        </div>
      </div>

      <div
        class="relative flex items-center mt-6 space-x-2 justify-evenly flex-shrink-0 mt-6"
      >
        <a
          v-if="$isMobile() && routeHref"
          class="flex flex-col items-center flex-1 h-full p-2 space-y-2 rounded-lg hover:bg-gray-100"
          :href="routeHref"
          title="Trouver la route pour venir jusqu'à ce lieu"
        >
          <font-awesome-icon icon="route" :color="color" size="sm" />
          <span class="text-sm">Itinéraire</span>
        </a>

        <button
          :class="[
            'flex flex-1 flex-col items-center space-y-2 rounded-lg p-2 h-full',
            isModeExplorer && 'bg-blue-600 text-white hover:bg-blue-500',
            !isModeExplorer && 'hover:bg-gray-100',
          ]"
          :title="
            isModeExplorer
              ? 'Désactiver l\'exploration aux alentours'
              : 'Explorer les points d\'intérêts aux alentours'
          "
          @click.stop="onExploreClick"
        >
          <font-awesome-icon
            :icon="['far', 'compass']"
            :color="isModeExplorer ? 'white' : color"
            size="sm"
          />
          <span class="text-sm">Explorer</span>
        </button>

        <button
          v-if="poiMeta('PID')"
          class="flex flex-col items-center flex-1 h-full p-2 space-y-2 rounded-lg hover:bg-gray-100"
          title="Mettre en favori"
          @click.stop="onFavoriteClick"
        >
          <font-awesome-icon
            :icon="[`${isModeFavorite ? 'fas' : 'far'}`, 'star']"
            :class="isModeFavorite && 'text-yellow-500'"
            :color="!isModeFavorite && color"
            size="sm"
          />
          <span class="text-sm">Favori</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MapboxGeoJSONFeature } from 'maplibre-gl'
import OpeningHours from 'opening_hours'
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import TeritorioIcon from '@/components/TeritorioIcon/TeritorioIcon.vue'
import { getPoiById } from '@/utils/api'
import { isIOS } from '@/utils/isIOS'
import { getContrastedTextColor } from '@/utils/picto'
import { VidoFeature, Mode } from '@/utils/types'
import { getPreviousMonday, displayTime } from '@/utils/utilities'

export default Vue.extend({
  components: {
    TeritorioIcon,
  },

  props: {
    poi: {
      type: Object as PropType<VidoFeature | MapboxGeoJSONFeature>,
      required: true,
    },
  },

  data(): {
    sptags: { [key: string]: any } | null
    apiProps: { [key: string]: any } | null
    textLimit: number
  } {
    return {
      sptags: null,
      apiProps: null,
      textLimit: 160,
    }
  },

  computed: {
    ...mapGetters({
      mode: 'site/mode',
      favoritesIds: 'favorite/favoritesIds',
    }),

    isModeExplorer(): boolean {
      return this.mode === Mode.EXPLORER
    },

    isModeFavorite(): boolean {
      const id = this.poiMeta('PID') || this.poiProp('id')
      const currentFavorites = this.$store.getters['favorite/favoritesIds']
      return currentFavorites.includes(id)
    },

    hasFiche(): boolean {
      return this.poiMeta('hasfiche') === 'yes'
    },

    name(): string {
      return this.poiProp('name') || this.poiMeta('label_infobulle')
    },

    color(): string | null {
      if (this.poiMeta('color')) {
        return this.poiMeta('color')
      } else if (this.poi && this.poi.layer && this.poi.layer.paint) {
        const tc = this.poi.layer.paint['text-color']
        return `rgba(${Math.round(tc.r * 255).toFixed(0)}, ${Math.round(
          tc.g * 255
        ).toFixed(0)}, ${Math.round(tc.b * 255).toFixed(0)}, ${tc.a})`
      } else {
        return 'black'
      }
    },

    contrastedColor(): string {
      return getContrastedTextColor(this.color || 'black')
    },

    icon(): string {
      if (this.poiMeta('icon')) {
        return this.poiMeta('icon')
      } else if (this.poi.layer?.layout['icon-image']?.name) {
        return (
          'teritorio teritorio-tourism-' +
          this.poi.layer?.layout['icon-image']?.name.replace(/[•◯⬤]/g, '')
        )
      } else {
        return ''
      }
    },

    faIcon(): string {
      return this.poiProp('faIcon')
    },

    category(): string {
      return this.poiMeta('label_infobulle') || this.poiProp('class')
    },

    address(): string | null {
      if (this.poiMeta('PopupAdress') !== 'yes') {
        return null
      }

      return [
        this.poiProp('addr:housenumber'),
        this.poiProp('addr:street'),
        this.poiProp('addr:postcode'),
        this.poiProp('addr:city'),
      ]
        .filter((f) => f && f.toString().trim().length > 0)
        .join(' ')
    },

    opening_hours(): string[] | null {
      const openingHours = this.poiProp('opening_hours')
      if (!openingHours) {
        return null
      }

      const days = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.']
      const prevMonday = new Date(getPreviousMonday())
      const oneWeek = new Date(prevMonday)
      oneWeek.setDate(oneWeek.getDate() + 7)

      const oh = new OpeningHours(openingHours)
      const iterator = oh.getIterator(prevMonday)
      const openingString: string[] = []
      const ranges = []
      let date: { day: null | String; range: (Date | string)[] } = {
        day: null,
        range: [],
      }

      while (iterator.advance(oneWeek)) {
        const intDate = iterator.getDate()
        const day = intDate.getDay()

        if (days[day] === date.day) {
          date.range.push(displayTime(intDate))
        } else {
          if (date.range.length > 0) {
            ranges.push(date)
          }
          date = { day: days[day], range: [displayTime(intDate)] }
        }
      }

      ranges.forEach((range) => {
        const timeRanges = ['', '']
          .map((_, i) => range.range.slice(i * 2, (i + 1) * 2))
          .map((e) => e.join('-'))
          .filter((e) => Boolean(e))

        openingString.push(
          `${range.day} ${timeRanges[0]}${
            timeRanges.length > 1 ? `  ${timeRanges[1]}` : ''
          }`
        )
      })

      return openingString
    },

    listFields(): string[] {
      if (!this.sptags) {
        return []
      }

      return (this.poiMeta('PopupListField') || '')
        .split(';')
        .map((f: string) => {
          if (
            this.sptags !== null &&
            this.sptags[f] &&
            this.sptags[f][this.poiProp(f)]
          ) {
            return { k: f, v: this.sptags[f][this.poiProp(f)] }
          } else if (
            this.sptags !== null &&
            this.sptags[f] &&
            this.poiProp(f) &&
            this.poiProp(f).includes(';')
          ) {
            return {
              k: f,
              v: this.poiProp(f)
                .split(';')
                .map((p: string) => this.sptags !== null && this.sptags[f][p])
                .filter(
                  (f: string | string[]) =>
                    f &&
                    ((typeof f === 'string' && f.trim().length > 0) ||
                      (Array.isArray(f) && f.length > 0))
                )
                .join(', '),
            }
          } else {
            return { k: f, v: this.poiProp(f) }
          }
        })
        .filter(
          (f: { k: string; v: string | string[] }) =>
            f.v &&
            ((typeof f.v === 'string' && f.v.trim().length > 0) ||
              (Array.isArray(f.v) && f.v.length > 0))
        )
    },

    routeHref(): string | null {
      if (this.poi.geometry.type === 'Point') {
        const lat = this.poi.geometry.coordinates[1]
        const lng = this.poi.geometry.coordinates[0]
        const latLng = `${lat},${lng}`

        if (isIOS()) {
          return `maps://?q=${latLng}`
        }

        return `geo:${latLng}`
      } else {
        return null
      }
    },
  },

  watch: {
    poi() {
      this.onPoiChange()
    },
  },

  created() {
    this.onPoiChange()
  },

  methods: {
    onPoiChange() {
      this.sptags = null
      this.apiProps = null

      if (this.poi && this.poiProp('metadata')) {
        this.fetchSpTags()
      } else {
        this.fetchMetadata().then(this.fetchSpTags)
      }
    },

    poiProp(name: string) {
      return this.apiProps?.[name] || this.poi.properties?.[name]
    },

    poiMeta(name: string) {
      return this.poiProp('metadata') && this.poiProp('metadata')[name]
    },

    fetchMetadata(): Promise<void> {
      if (!this.poiProp('PID') && !this.poi.id) {
        return Promise.resolve()
      }

      return getPoiById(
        this.$config.API_ENDPOINT,
        this.poiProp('PID') || this.poi.id
      ).then((apiPoi) => {
        if (apiPoi) {
          this.apiProps = apiPoi.properties
        }
      })
    },

    fetchSpTags() {
      if (!this.poiMeta('PopupListField')) {
        return
      }
      return fetch(
        `${
          this.$config.API_ENDPOINT
        }/geodata/v1/sptags?PopupListField=${this.poiMeta('PopupListField')}`
      )
        .then((data) => data.json())
        .then((data) => (this.sptags = data))
    },

    onExploreClick() {
      this.$emit('explore-click')
    },
    onFavoriteClick() {
      this.$emit('favorite-click')
    },
  },
})
</script>
<style>
@media screen and (min-width: 640px) {
  .poiDescription {
    max-height: 30vh;
  }
}
</style>
