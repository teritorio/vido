<template>
  <div
    :class="[
      'z-10 flex flex-col w-full md:max-w-xl mx-0 overflow-y-auto shadow-md pointer-events-auto md:flex-row md:w-auto md:mx-auto md:rounded-xl poiDescription',
      !isModeFavorites && notebook ? 'bg-zinc-200 opacity-70' : 'bg-white',
    ]"
  >
    <nuxt-picture
      v-if="poiProps.image && poiProps.image.length > 0"
      class="object-cover w-full h-auto max-h-44 md:max-h-full md:w-52"
      :src="poiProps.image[0]"
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
          v-if="poiProps.editorial && poiProps.editorial['website:details']"
          class="ml-6 md:ml-8 px-3 py-1.5 text-xs text-zinc-800 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-200 transition transition-colors rounded-md"
          :href="poiProps.editorial['website:details']"
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

        {{ category }}
      </div>

      <p
        v-if="unavoidable && Boolean(description)"
        class="text-sm flex-grow shrink-0 mt-6"
      >
        {{ description }}
      </p>

      <div v-else class="h-auto flex-grow shrink-0">
        <template
          v-for="property in (poiProps.editorial &&
            poiProps.editorial.popup_properties) ||
          []"
        >
          <div
            v-if="poiProps[property]"
            :key="'_' + property"
            class="text-sm mt-2"
          >
            <p v-if="property === 'addr:*'" class="mt-6 text-sm">
              <AddressField :properties="poiProps"></AddressField>
            </p>

            <RoutesField
              v-else-if="property === 'route:*'"
              :context="context"
              :properties="poiProps"
              class="text-sm mt-2"
            />

            <ul v-else-if="property === 'phone' && $screen.phone">
              <li v-for="item in poiProps[property]" :key="item">
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
              <li v-for="item in poiProps[property]" :key="item">
                <a
                  class="text-blue-400"
                  :href="'tel:' + item"
                  :title="$tc('toast.callNumber')"
                >
                  {{ item }}
                </a>
              </li>
            </ul>

            <ul v-else-if="Array.isArray(poiProps[property])">
              <li v-for="item in poiProps[property]" :key="item">
                <Website v-if="property === 'website'" :url="item" />
                <p v-else class="text-sm mt-1">
                  {{ item }}
                </p>
              </li>
            </ul>

            <p v-else-if="property == 'start_end_date'" class="text-sm">
              <DateRange
                :start="poiProps.start_date"
                :end="poiProps.end_date"
              />
            </p>

            <p
              v-else-if="isOpeningHoursSupportedOsmTags(property)"
              class="text-sm"
            >
              <OpeningHours
                :tag-key="property"
                :opening-hours="poiProps[property]"
                :context="context"
              />
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
                v-if="
                  poiProps.editorial && poiProps.editorial['website:details']
                "
                class="underline"
                :href="poiProps.editorial['website:details']"
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
        </template>
      </div>

      <div
        class="flex items-center space-x-2 justify-evenly shrink-0 bottom-0 pt-2 shrink-0"
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
          :title="
            isModeFavorites ? $tc('toast.favoriteOn') : $tc('toast.favoriteOff')
          "
          @click.stop="onFavoriteClick"
        >
          <FavoriteIcon :is-active="isModeFavorites" :color-line="colorLine" />
          <span class="text-sm">{{ $tc('toast.favorite') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import AddressField from '~/components/Fields/AddressField.vue'
import DateRange from '~/components/Fields/DateRange.vue'
import OpeningHours, {
  isOpeningHoursSupportedOsmTags,
} from '~/components/Fields/OpeningHours.vue'
import RoutesField from '~/components/Fields/RoutesField.vue'
import Website from '~/components/Fields/Website.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import { ApiPoi, ApiPoiProperties, ApiPoiId } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'
import { isIOS } from '~/utils/isIOS'

export default Vue.extend({
  components: {
    RoutesField,
    TeritorioIcon,
    AddressField,
    Website,
    OpeningHours,
    DateRange,
    FavoriteIcon,
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
    textLimit: number
  } {
    return {
      textLimit: 160,
    }
  },

  computed: {
    ...mapGetters({
      isModeExplorer: 'map/isModeExplorer',
      favoritesIds: 'favorite/favoritesIds',
    }),

    context(): PropertyTranslationsContextEnum {
      return PropertyTranslationsContextEnum.Popup
    },

    poiProps(): ApiPoiProperties {
      return this.poi.properties
    },

    id(): ApiPoiId | undefined {
      return this.poiProps.metadata?.id
    },

    isModeFavorites(): boolean {
      const currentFavorites = this.favoritesIds
      return currentFavorites.includes(this.id)
    },

    name(): string | undefined {
      return (
        this.poiProps.name ||
        this.poiProps.editorial?.class_label_popup?.fr ||
        this.poiProps.editorial?.class_label?.fr
      )
    },

    colorFill(): string {
      return this.poiProps.display?.color_fill || 'black'
    },

    colorLine(): string {
      return this.poiProps.display?.color_line || 'black'
    },

    icon(): string | undefined {
      return this.poiProps.display?.icon
    },

    category(): string | undefined {
      return (
        this.poiProps.editorial?.class_label_popup?.fr ||
        this.poiProps.editorial?.class_label?.fr
      )
    },

    description(): string | null {
      return this.poiProps.description
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
      return Boolean(this.poiProps.editorial?.unavoidable)
    },

    routes(): { [key: string]: Object } {
      if (
        !(this.poiProps.editorial?.popup_properties || []).includes('route:*')
      ) {
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

  mounted() {
    if (!this.notebook && this.id) {
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

  methods: {
    poiPropTranslate(property: string) {
      return this.$propertyTranslations.pv(
        property,
        this.poiProps[property],
        PropertyTranslationsContextEnum.Popup
      )
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

    isOpeningHoursSupportedOsmTags(key: string) {
      return isOpeningHoursSupportedOsmTags(key)
    },

    tracking(event: 'details' | 'route' | 'explore' | 'favorite' | 'zoom') {
      if (this.id) {
        this.$tracking({
          type: 'popup_event',
          event,
          poiId: this.id,
          category: this.category || '',
          title: this.poi.properties?.name,
        })
      }
    },
  },
})
</script>
<style>
button {
  @apply focus:outline-none;
}
</style>
