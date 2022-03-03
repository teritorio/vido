<template>
  <div
    :class="[
      'z-10 flex flex-col w-full sm:max-w-xl mx-0 overflow-y-auto shadow-md pointer-events-auto sm:flex-row sm:w-auto sm:mx-auto sm:rounded-xl poiDescription',
      !isModeFavorites && notebook ? 'bg-gray-200 opacity-70' : 'bg-white',
    ]"
  >
    <img
      v-if="poiProp('image') && poiProp('image').length > 0"
      class="object-cover w-full h-auto max-h-44 sm:max-h-full sm:w-52"
      :src="poiProp('image')[0]"
      alt=""
    />

    <div
      class="px-8 py-6 flex flex-col sm:overflow-y-auto flex-grow sm:h-50 h-auto sm:max-h-full box-border w-full sm:w-80 md:h-80 md:max-h-full md:w-96"
    >
      <div class="flex items-center justify-between flex-shrink-0">
        <h2
          class="block text-xl font-semibold leading-tight"
          :style="'color:' + color"
        >
          {{ name }}
        </h2>

        <a
          v-if="poiEditorial('website:details')"
          class="ml-6 md:ml-8 px-3 py-1.5 text-xs text-gray-800 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 transition transition-colors rounded-md"
          :href="poiEditorial('website:details')"
          rel="noopener noreferrer"
          target="_blank"
          @click.stop="tracking('details')"
        >
          {{ $tc('toast.details') }}
        </a>
      </div>

      <div
        v-if="!unavoidable"
        class="flex items-center mt-2 text-sm text-gray-500 flex-shrink-0"
      >
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

      <p
        v-if="unavoidable && Boolean(description)"
        class="text-sm flex-grow flex-shrink-0 mt-6"
      >
        {{ description }}
      </p>

      <div v-else class="h-auto flex-grow flex-shrink-0">
        <p class="mt-6 text-sm">
          <template v-if="address">
            {{ address }}
          </template>
        </p>

        <template v-for="(route, activity) in routes">
          <p :key="activity" class="text-sm mt-2">
            {{
              (sptags && sptags['route:*'] && sptags['route:*'][activity]) ||
              activity
            }}
            : {{ route }}
          </p>
        </template>

        <div
          v-for="field in listFields"
          :key="'_' + field.k"
          class="text-sm mt-2"
        >
          <ul v-if="field.k === 'phone' && $isMobile()">
            <li v-for="item in field.v" :key="item">
              <a
                class="text-blue-400"
                :href="'tel:' + item"
                :title="$tc('toast.callNumber')"
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
                :title="$tc('toast.callNumber')"
              >
                {{ item }}
              </a>
            </li>
          </ul>

          <ul v-else-if="Array.isArray(field.v)">
            <li v-for="item in field.v" :key="item">
              <p class="text-sm mt-1">
                {{ item }}
              </p>
            </li>
          </ul>

          <p
            v-else-if="['start_date', 'end_date'].indexOf(field.k) >= 0"
            class="text-sm"
          >
            {{ $d(new Date(field.v)) }}
          </p>

          <p v-else-if="field.k === 'opening_hours'" class="text-sm">
            <OpeningHours :opening-hours="field.v" />
          </p>

          <p v-else-if="field.v.length > textLimit" class="text-sm">
            {{ field.v.substring(0, textLimit) + ' ...' }}
            <a
              v-if="poiEditorial('website:details')"
              class="underline"
              :href="poiEditorial('website:details')"
              rel="noopener noreferrer"
              target="_blank"
              @click.stop="tracking('details')"
            >
              {{ $tc('toast.seeDetail') }}
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
          :title="$tc('toast.findRoute')"
          @click="tracking('route')"
        >
          <font-awesome-icon icon="route" :color="color" size="sm" />
          <span class="text-sm">{{ $tc('toast.route') }}</span>
        </a>

        <button
          class="flex flex-1 flex-col items-center space-y-2 rounded-lg p-2 h-full hover:bg-gray-100"
          :title="$tc('toast.zoom')"
          @click.stop="onZoomClick"
        >
          <font-awesome-icon icon="plus" :color="color" size="sm" />
          <span class="text-sm">{{ $tc('toast.zoom') }}</span>
        </button>

        <button
          :class="[
            'flex flex-1 flex-col items-center space-y-2 rounded-lg p-2 h-full',
            isModeExplorer && 'bg-blue-600 text-white hover:bg-blue-500',
            !isModeExplorer && 'hover:bg-gray-100',
          ]"
          :title="
            isModeExplorer
              ? $tc('toast.unactivateExplore')
              : $tc('toast.activateExplore')
          "
          @click.stop="onExploreClick"
        >
          <font-awesome-icon
            icon="eye"
            :color="isModeExplorer ? 'white' : color"
            size="sm"
          />
          <span class="text-sm">{{ $tc('toast.explore') }}</span>
        </button>

        <button
          v-if="id"
          class="flex flex-col items-center flex-1 h-full p-2 space-y-2 rounded-lg hover:bg-gray-100"
          title="Mettre en favori"
          @click.stop="onFavoriteClick"
        >
          <font-awesome-icon
            :icon="[`${isModeFavorites ? 'fas' : 'far'}`, 'star']"
            :class="isModeFavorites && 'text-yellow-500'"
            :color="!isModeFavorites && color"
            size="sm"
          />
          <span class="text-sm">{{ $tc('toast.favorite') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import OpeningHours from '@/components/Fields/OpeningHours.vue'
import TeritorioIcon from '@/components/TeritorioIcon/TeritorioIcon.vue'
import { getPoiById, ApiPoi, ApiPoiProperties } from '@/lib/apiPois'
import { isIOS } from '@/utils/isIOS'
import { getContrastedTextColor } from '@/utils/picto'
import { Mode } from '@/utils/types'

export default Vue.extend({
  components: {
    TeritorioIcon,
    OpeningHours,
  },

  props: {
    notebook: {
      type: Boolean,
      default: false,
    },
    poi: {
      type: Object as PropType<ApiPoi>,
      required: true,
    },
  },

  data(): {
    sptags: { [key: string]: any } | null
    apiProps: ApiPoiProperties | null
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
      mode: 'map/mode',
      favoritesIds: 'favorite/favoritesIds',
    }),

    id(): number {
      return this.poiMeta('id') || this.poi.id
    },

    isModeExplorer(): boolean {
      return this.mode === Mode.EXPLORER
    },

    isModeFavorites(): boolean {
      const currentFavorites = this.$store.getters['favorite/favoritesIds']
      return currentFavorites.includes(this.id)
    },

    name(): string {
      return (
        this.poiProp('name') ||
        this.poiEditorial('class_label_popup')?.fr ||
        this.poiEditorial('class_label')?.fr
      )
    },

    color(): string | null {
      if (this.poiDisplay('color')) {
        return this.poiDisplay('color')
        // @ts-ignore
      } else if (this.poi && this.poi.layer && this.poi.layer.paint) {
        const tc =
          // @ts-ignore
          this.poi.layer.paint['text-color'] ||
          // @ts-ignore
          this.poi.layer.paint['line-color'] ||
          // @ts-ignore
          this.poi.layer.paint['fill-color']
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
      if (this.poiDisplay('icon')) {
        return this.poiDisplay('icon')
        // @ts-ignore
      } else if (this.poi.layer?.layout['icon-image']?.name) {
        return (
          'teritorio teritorio-tourism-' +
          // @ts-ignore
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
      return (
        this.poiEditorial('class_label_popup')?.fr ||
        this.poiEditorial('class_label')?.fr
      )
    },

    description(): string | null {
      return this.poiProp('description')
    },

    address(): string | null {
      if ((this.poiEditorial('popup_properties') || []).includes('addr:*')) {
        return [
          this.poiProp('addr:housenumber'),
          this.poiProp('addr:street'),
          this.poiProp('addr:postcode'),
          this.poiProp('addr:city'),
        ]
          .filter((f) => f && f.toString().trim().length > 0)
          .join(' ')
      } else {
        return null
      }
    },

    listFields(): string[] {
      const getValue = (field: string, value: string | string[]) => {
        if (field === 'route:*') return null

        return value
      }

      return (this.poiEditorial('popup_properties') || [])
        .map((f: string) => {
          if (
            this.sptags !== null &&
            this.sptags[f] &&
            this.sptags[f][this.poiProp(f)]
          ) {
            return {
              k: f,
              v: getValue(f, this.sptags[f][this.poiProp(f)]),
            }
          } else if (
            this.sptags !== null &&
            this.sptags[f] &&
            this.poiProp(f) &&
            this.poiProp(f).includes(';')
          ) {
            return {
              k: f,
              v: getValue(
                f,
                this.poiProp(f)
                  .split(';')
                  .map((p: string) => this.sptags !== null && this.sptags[f][p])
                  .filter(
                    (f: string | string[]) =>
                      f &&
                      ((typeof f === 'string' && f.trim().length > 0) ||
                        (Array.isArray(f) && f.length > 0))
                  )
                  .join(', ')
              ),
            }
          } else {
            return {
              k: f,
              v: getValue(f, this.poiProp(f)),
            }
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

    unavoidable(): boolean {
      return Boolean(this.poiEditorial('unavoidable'))
    },

    routes(): { [key: string]: string } {
      if (!(this.poiEditorial('popup_properties') || []).includes('route:*')) {
        return {}
      }

      const activitiesStruct: { [key: string]: { [key: string]: string } } = {}
      Object.entries(this.poi.properties)
        .filter(([key, _value]) => key.startsWith('route:'))
        .map(([key, value]) => [key.split(':'), value])
        .filter(([key, _value]) => key.length === 3)
        .forEach(([[_, activity, property], value]) => {
          if (activitiesStruct[activity]) {
            activitiesStruct[activity][property] = value
          } else {
            activitiesStruct[activity] = {}
            activitiesStruct[activity][property] = value
          }
        })

      const ret: { [key: string]: string } = {}
      Object.entries(activitiesStruct).forEach(([acivity, properties]) => {
        const result = []
        if (properties.length) {
          result.push(`${properties.length} ${this.$tc('toast.routePopup.km')}`)
        }
        if (properties.duration) {
          result.push(
            `${properties.duration} ${this.$tc('toast.routePopup.min')}`
          )
        }
        if (properties.difficulty && properties.difficulty !== 'normal') {
          result.push(this.$tc(`toast.routePopup.${properties.difficulty}`))
        }
        ret[acivity] = result.join(', ')
      })
      return ret
    },
  },

  watch: {
    poi() {
      this.onPoiChange()
    },
  },

  mounted() {
    this.$tracking({
      type: 'popup',
      poiId: this.id,
      title: this.poi.properties?.name,
      location: window.location.href,
      path: this.$route.path,
      categoryIds: this.poi.properties?.metadata?.category_ids || [],
    })
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

    poiDisplay(name: string) {
      return this.poiProp('display') && this.poiProp('display')[name]
    },

    poiEditorial(name: string) {
      return this.poiProp('editorial') && this.poiProp('editorial')[name]
    },

    fetchMetadata(): Promise<void> {
      if (!this.id) {
        return Promise.resolve()
      }

      return getPoiById(
        this.$config.API_ENDPOINT,
        this.$config.API_PROJECT,
        this.$config.API_THEME,
        this.id
      ).then((apiPoi) => {
        if (apiPoi) {
          this.apiProps = apiPoi.properties
        }
      })
    },

    fetchSpTags() {
      if (!this.poiEditorial('popup_properties')) {
        return
      }
      return fetch(
        `${
          this.$config.API_ENDPOINT
        }/sptags?popup_properties=${this.poiEditorial('popup_properties').join(
          ';'
        )}`
      )
        .then((data) => data.json())
        .then((data) => (this.sptags = data))
    },

    onZoomClick() {
      this.tracking('zoom')
      this.$emit('zoom-click', this.poi)
    },
    onExploreClick() {
      if (!this.isModeExplorer) {
        this.tracking('explore')
      }
      this.$emit('explore-click', this.poi)
    },
    onFavoriteClick() {
      if (!this.isModeFavorites) {
        this.tracking('favorite')
      }
      this.$emit('favorite-click', this.poi, this.notebook)
    },
    tracking(event: 'details' | 'route' | 'explore' | 'favorite' | 'zoom') {
      this.$tracking({
        type: 'popup_event',
        event,
        poiId: this.id,
        category: this.category,
        title: this.poi.properties?.name,
      })
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
button {
  @apply focus:outline-none;
}
</style>
