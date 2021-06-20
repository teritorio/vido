<template>
  <div
    class="z-10 flex flex-col w-full max-w-xl mx-0 overflow-y-auto bg-white shadow-md pointer-events-auto sm:flex-row sm:w-auto sm:mx-auto sm:rounded-xl"
    @click="() => $emit('click')"
  >
    <img
      v-if="poiProp('teritorio:image')"
      class="object-cover w-full h-auto max-h-44 sm:max-h-full sm:w-52"
      :src="poiProp('teritorio:image')"
      alt=""
    />

    <div class="p-8">
      <div class="flex items-center justify-between">
        <p
          class="block text-xl font-semibold leading-tight cursor-pointer"
          :style="'color:' + color"
          title="Zoomer sur le lieu"
        >
          {{ name }}
        </p>

        <a
          v-if="hasFiche"
          :href="poiProp('teritorio:url')"
          class="px-2 py-1 ml-2 rounded-lg"
          :style="'background-color: ' + color"
          target="_blank"
          title="Voir les détails du lieu"
          @click.stop
        >
          <font-awesome-icon
            icon="external-link-alt"
            :color="contrastedColor"
          />
        </a>
      </div>

      <div class="flex items-center text-sm text-gray-500 cursor-pointer">
        <TeritorioIcon
          v-if="icon"
          :category-color="color"
          class="mr-2"
          :picto="icon"
          :use-category-color="true"
          :use-native-alignment="true"
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

      <p class="mt-2">
        <template v-if="address">
          {{ address }}
          <br />
        </template>

        <span v-for="field in listFields" :key="encodeURIComponent(field)">
          {{ field }} <br />
        </span>
      </p>

      <div class="relative flex items-center justify-between mt-3 space-x-2">
        <button
          class="flex flex-col items-center flex-1 h-full p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100"
          title="Trouver la route pour venir jusqu'à ce lieu"
          @click.stop="onRouteClick"
        >
          <font-awesome-icon icon="route" :color="color" size="sm" />
          <span class="text-sm">Itinéraire</span>
        </button>
        <button
          :class="[
            'flex flex-1 flex-col items-center rounded-lg border-2 p-2 h-full',
            isModeExplorer && 'bg-blue-600 text-white hover:bg-blue-500',
            !isModeExplorer && 'border-gray-300 hover:bg-gray-100',
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
          class="flex flex-col items-center flex-1 h-full p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100"
          title="Mettre en favori"
          @click.stop
        >
          <font-awesome-icon :icon="['far', 'star']" :color="color" size="sm" />
          <span class="text-sm">Favori</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MapboxGeoJSONFeature } from 'maplibre-gl'
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import TeritorioIcon from '@/components/TeritorioIcon/TeritorioIcon.vue'
import { getPoiById } from '@/utils/api'
import { getContrastedTextColor } from '@/utils/picto'
import { toTitleCase } from '@/utils/string'
import { VidoFeature, Mode } from '@/utils/types'

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
  } {
    return {
      sptags: null,
      apiProps: null,
    }
  },

  computed: {
    ...mapGetters({
      mode: 'site/mode',
    }),

    isModeExplorer(): boolean {
      return this.mode === Mode.EXPLORER
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

    faIcon() {
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
        this.poiProp('addr:street') && toTitleCase(this.poiProp('addr:street')),
        this.poiProp('addr:postcode'),
        this.poiProp('addr:city') && this.poiProp('addr:city').toUpperCase(),
      ]
        .filter((f) => f && f.trim().length > 0)
        .join(' ')
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
            return this.sptags[f][this.poiProp(f)]
          } else if (
            this.sptags !== null &&
            this.sptags[f] &&
            this.poiProp(f) &&
            this.poiProp(f).includes(';')
          ) {
            return this.poiProp(f)
              .split(';')
              .map((p: string) => this.sptags !== null && this.sptags[f][p])
              .filter((f: string) => f && f.trim().length > 0)
              .join(', ')
          } else {
            return this.poiProp(f)
          }
        })
        .filter((f: string) => f && f.trim().length > 0)
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
      // console.log("SELECTED POI", this.poi)
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

    onRouteClick(): void {
      // @ts-ignore
      if (this.$isMobile()) {
        window.open(
          'geo:' +
            this.poi.geometry.coordinates[1] +
            ',' +
            this.poi.geometry.coordinates[0]
        )
      }
    },
  },
})
</script>
