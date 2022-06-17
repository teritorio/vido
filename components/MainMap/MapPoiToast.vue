<template>
  <div
    :class="[
      'z-10 flex flex-col w-full md:max-w-xl mx-0 overflow-y-auto shadow-md pointer-events-auto md:flex-row md:w-auto md:mx-auto md:rounded-xl poiDescription',
      !isModeFavorites && notebook ? 'bg-zinc-200 opacity-70' : 'bg-white',
    ]"
  >
    <img
      v-if="poiProp('image') && poiProp('image').length > 0"
      class="object-cover w-full h-auto max-h-44 md:max-h-full md:w-52"
      :src="poiProp('image')[0]"
      alt=""
    />

    <div
      class="px-4 py-5 flex flex-col md:overflow-y-auto flex-grow sm:max-h-60 md:h-50 h-auto md:max-h-full box-border w-full md:w-80 md:h-80 md:max-h-full md:w-96"
    >
      <div class="flex items-center justify-between shrink-0">
        <h2
          class="block text-xl font-semibold leading-tight"
          :style="'color:' + colorLine"
        >
          {{ name }}
        </h2>

        <a
          v-if="poiEditorial('website:details')"
          class="ml-6 md:ml-8 px-3 py-1.5 text-xs text-zinc-800 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-200 transition transition-colors rounded-md"
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
        class="flex items-center mt-2 text-sm text-zinc-500 shrink-0"
      >
        <TeritorioIcon
          v-if="icon"
          :color-text="colorLine"
          class="mr-2"
          :picto="icon"
          :use-native-alignment="false"
        />

        <font-awesome-icon
          v-if="faIcon"
          :icon="faIcon"
          :color="colorLine"
          class="mr-2"
          size="sm"
        />

        {{ category }}
      </div>

      <p
        v-if="unavoidable && Boolean(description)"
        class="text-sm flex-grow shrink-0 mt-6"
      >
        {{ description }}
      </p>

      <div v-else class="h-auto flex-grow shrink-0">
        <div
          v-for="property in poiEditorial('popup_properties') || []"
          :key="'_' + property"
          class="text-sm mt-2"
        >
          <p v-if="property === 'addr:*'" class="mt-6 text-sm">
            <AddressField :properties="poiProps()"></AddressField>
          </p>

          <template
            v-for="(route, activity) in routes"
            v-else-if="property === 'route:*'"
          >
            <p :key="activity" class="text-sm mt-2">
              <RouteField
                :activity="
                  (sptags &&
                    sptags['route:*'] &&
                    sptags['route:*'][activity]) ||
                  activity
                "
                :route="route"
              />
            </p>
          </template>

          <ul v-if="property === 'phone' && $screen.phone">
            <li v-for="item in poiProp(property)" :key="item">
              <a
                class="text-blue-400"
                :href="'tel:' + item"
                :title="$tc('toast.callNumber')"
              >
                {{ item }}
              </a>
            </li>
          </ul>
          <ul v-else-if="property === 'mobile' && $screen.phone">
            <li v-for="item in poiProp(property)" :key="item">
              <a
                class="text-blue-400"
                :href="'tel:' + item"
                :title="$tc('toast.callNumber')"
              >
                {{ item }}
              </a>
            </li>
          </ul>

          <ul v-else-if="Array.isArray(poiProp(property))">
            <li v-for="item in poiProp(property)" :key="item">
              <Website v-if="property === 'website'" :url="item" />
              <p v-else class="text-sm mt-1">
                {{ item }}
              </p>
            </li>
          </ul>

          <p v-else-if="property == 'start_end_date'" class="text-sm">
            <DateRange
              :start="poiProp('start_date')"
              :end="poiProp('end_date')"
            />
          </p>

          <p
            v-else-if="property === 'opening_hours' && poiProp(property)"
            class="text-sm"
          >
            <OpeningHours :opening-hours="poiProp(property)" />
          </p>

          <p
            v-else-if="
              poiPropTranslate(property) &&
              poiPropTranslate(property).length > textLimit
            "
            class="text-sm"
          >
            {{ poiPropTranslate(property).substring(0, textLimit) + ' ...' }}
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
            {{ poiPropTranslate(property) }}
          </p>
        </div>
      </div>

      <div
        class="flex items-center space-x-2 justify-evenly shrink-0 bottom-0 bg-white pt-2 shrink-0"
      >
        <a
          v-if="$screen.smallScreen && routeHref"
          class="flex flex-col items-center flex-1 h-full p-2 space-y-2 rounded-lg hover:bg-zinc-100"
          :href="routeHref"
          :title="$tc('toast.findRoute')"
          @click="tracking('route')"
        >
          <font-awesome-icon icon="route" :color="colorLine" size="sm" />
          <span class="text-sm">{{ $tc('toast.route') }}</span>
        </a>

        <button
          class="flex flex-1 flex-col items-center space-y-2 rounded-lg p-2 h-full hover:bg-zinc-100"
          :title="$tc('toast.zoom')"
          @click.stop="onZoomClick"
        >
          <font-awesome-icon icon="plus" :color="colorLine" size="sm" />
          <span class="text-sm">{{ $tc('toast.zoom') }}</span>
        </button>

        <button
          :class="[
            'flex flex-1 flex-col items-center space-y-2 rounded-lg p-2 h-full',
            isModeExplorer && 'bg-blue-600 text-white hover:bg-blue-500',
            !isModeExplorer && 'hover:bg-zinc-100',
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
            :color="isModeExplorer ? 'white' : colorLine"
            size="sm"
          />
          <span class="text-sm">{{ $tc('toast.explore') }}</span>
        </button>

        <button
          v-if="id"
          class="flex flex-col items-center flex-1 h-full p-2 space-y-2 rounded-lg hover:bg-zinc-100"
          title="Mettre en favori"
          @click.stop="onFavoriteClick"
        >
          <font-awesome-icon
            :icon="[`${isModeFavorites ? 'fas' : 'far'}`, 'star']"
            :class="isModeFavorites && 'text-amber-500'"
            :color="!isModeFavorites && colorLine"
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

import AddressField from '@/components/Fields/AddressField.vue'
import DateRange from '@/components/Fields/DateRange.vue'
import Website from '@/components/Fields/Website.vue'
import TeritorioIcon from '@/components/TeritorioIcon/TeritorioIcon.vue'
import { getPoiById, ApiPoi, ApiPoiProperties } from '@/lib/apiPois'
import { isIOS } from '@/utils/isIOS'

import RouteField from '~/components/Fields/RouteField.vue'

export default Vue.extend({
  components: {
    RouteField,
    TeritorioIcon,
    AddressField,
    Website,
    OpeningHours: () => import('@/components/Fields/OpeningHours.vue'),
    DateRange,
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
      isModeExplorer: 'map/isModeExplorer',
      favoritesIds: 'favorite/favoritesIds',
    }),

    id(): number {
      return this.poiMeta('id') || this.poi.id
    },

    isModeFavorites(): boolean {
      const currentFavorites = this.favoritesIds
      return currentFavorites.includes(this.id)
    },

    name(): string {
      return (
        this.poiProp('name') ||
        this.poiEditorial('class_label_popup')?.fr ||
        this.poiEditorial('class_label')?.fr
      )
    },

    colorFill(): string | null {
      if (this.poiDisplay('color_fill')) {
        return this.poiDisplay('color_fill')
        // @ts-ignore
      } else if (this.poi && this.poi.layer && this.poi.layer.paint) {
        const tc =
          // @ts-ignore
          this.poi.layer.paint['fill-color'] ||
          // and then
          // @ts-ignore
          this.poi.layer.paint['text-color'] ||
          // @ts-ignore
          this.poi.layer.paint['line-color']
        return `rgba(${Math.round(tc.r * 255).toFixed(0)}, ${Math.round(
          tc.g * 255
        ).toFixed(0)}, ${Math.round(tc.b * 255).toFixed(0)}, ${tc.a})`
      } else {
        return 'black'
      }
    },

    colorLine(): string | null {
      if (this.poiDisplay('color_line')) {
        return this.poiDisplay('color_line')
        // @ts-ignore
      } else if (this.poi && this.poi.layer && this.poi.layer.paint) {
        const tc =
          // @ts-ignore
          this.poi.layer.paint['text-color'] ||
          // @ts-ignore
          this.poi.layer.paint['line-color'] ||
          // and then
          // @ts-ignore
          this.poi.layer.paint['fill-color']
        return `rgba(${Math.round(tc.r * 255).toFixed(0)}, ${Math.round(
          tc.g * 255
        ).toFixed(0)}, ${Math.round(tc.b * 255).toFixed(0)}, ${tc.a})`
      } else {
        return 'black'
      }
    },

    icon(): string {
      if (this.poiDisplay('icon')) {
        return this.poiDisplay('icon')
        // @ts-ignore
      } else if (this.poi.layer?.layout['icon-image']?.name) {
        return (
          'teritorio teritorio-' +
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

    routes(): { [key: string]: Object } {
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

      const ret: { [key: string]: Object } = {}
      Object.entries(activitiesStruct).forEach(([acivity, properties]) => {
        ret[acivity] = properties
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
    if (!this.notebook) {
      this.$tracking({
        type: 'popup',
        poiId: this.id,
        title: this.poi.properties?.name,
        location: window.location.href,
        path: this.$route.path,
        categoryIds: this.poi.properties?.metadata?.category_ids || [],
      })
    }
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

    poiProps(): ApiPoiProperties {
      return {
        ...((this.poi.properties &&
          Object.fromEntries(
            Object.entries(this.poi.properties).map(([key, value]) => [
              key,
              (key !== 'opening_hours' &&
                value &&
                typeof value === 'string' &&
                value.includes(';') &&
                value
                  .split(';')
                  .filter((s: string) => s)
                  .map((s: string) => s.trim())
                  .filter((s: string) => s)) ||
                value,
            ])
          )) ||
          {}),
        ...(this.apiProps || {}),
      }
    },

    poiProp(name: string) {
      return this.poiProps()?.[name]
    },

    poiPropTranslate(property: string) {
      const poiProp = this.poiProp(property)
      return (
        (this.sptags &&
          this.sptags[property] &&
          this.sptags[property][poiProp]) ||
        poiProp
      )
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
        this.$vidoConfig.API_ENDPOINT,
        this.$vidoConfig.API_PROJECT,
        this.$vidoConfig.API_THEME,
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
          this.$vidoConfig.API_ENDPOINT
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
button {
  @apply focus:outline-none;
}
</style>
