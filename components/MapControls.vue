<template>
  <aside :class="['pointer-events-none', dense && 'hidden sm:block']">
    <div
      :class="[
        'absolute flex justify-end pointer-events-auto items-top pt-4 right-3 sm:pt-0 w-40 sm:w-48 sm:top-3',
        !isModeExplorer ? 'top-20' : 'top-0',
      ]"
    >
      <button
        v-if="map"
        aria-label="Favoris"
        type="button"
        :class="[
          'space-x-1 text-sm font-medium text-gray-800 bg-white shadow-md outline-none sm:px-5 w-11 sm:w-auto h-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0',
          hasFavorites ? 'rounded-l-lg' : 'rounded-full',
        ]"
        @click="toggleFavoriteMode"
      >
        <font-awesome-icon
          :icon="[`${isModeFavorite ? 'fas' : 'far'}`, 'star']"
          class="text-yellow-500"
          size="sm"
        />
        <span class="hidden sm:inline">Favoris</span>
      </button>
      <FavoriteMenu v-if="map && hasFavorites" />

      <button
        v-if="map"
        aria-label="Navigation"
        type="button"
        class="text-sm text-gray-800 bg-white rounded-full shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100 flex-shrink-0 ml-5"
        @click="toggleNavMenu"
      >
        <font-awesome-icon icon="bars" class="text-gray-800" size="sm" />
      </button>
    </div>

    <div class="absolute flex flex-col justify-center inset-y-3 right-3">
      <div class="flex flex-col space-y-3 pointer-events-auto">
        <div ref="navigationControlContainer"></div>
        <div ref="geolocateControlContainer" class="sm:hidden"></div>

        <button
          v-if="map"
          aria-label="Mode Explore"
          title="Basculer en mode Explore"
          type="button"
          :class="[
            'hidden sm:block text-sm font-bold rounded-full shadow-md w-11 h-11 outline-none focus:outline-none ',
            isModeExplorer &&
              'bg-blue-500 hover:bg-blue-400 focus-visible:bg-blue-400',
            !isModeExplorer &&
              'bg-white hover:bg-gray-100 focus-visible:bg-gray-100',
          ]"
          @click="toggleMode"
        >
          <font-awesome-icon
            icon="eye"
            :class="[
              isModeExplorer && 'text-white',
              !isModeExplorer && 'text-gray-800',
            ]"
            size="lg"
          />
        </button>

        <button
          v-if="map"
          aria-label="Visualiser la carte en 3D"
          type="button"
          :class="[
            'hidden items-center justify-center leading-none sm:flex text-sm font-bold rounded-full shadow-md w-11 h-11 outline-none focus:outline-none ',
            is3D &&
              'bg-blue-500 text-white hover:bg-blue-400 focus-visible:bg-blue-400',
            !is3D &&
              'bg-white text-gray-800 hover:bg-gray-100 focus-visible:bg-gray-100',
          ]"
          @click="toggle3D"
        >
          3D
        </button>

        <button
          v-if="map && !isModeExplorer"
          id="background-selector-map"
          aria-label="Changer le fond de carte"
          class="bg-gray-100 border-4 border-white rounded-full shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100"
          :title="`Changer le fond de carte (actuellement ${backgrounds[background]})`"
          type="button"
          @click="displayNextBackground"
        >
          <img
            class="h-full rounded-full"
            alt="fond de carte"
            :src="require(`~/assets/${nextBackgroundName(background)}.png`)"
          />
        </button>

        <div v-if="map && isModeExplorer" class="w-11 h-11" />
      </div>
    </div>

    <NavMenu v-if="showNavMenu" @close-click="toggleNavMenu" />
  </aside>
</template>

<script lang="ts">
import { Building3d } from '@teritorio/map'
import mapboxgl from 'maplibre-gl'
import Vue from 'vue'
import { mapGetters } from 'vuex'

import FavoriteMenu from '@/components/FavoriteMenu.vue'
import NavMenu from '@/components/NavMenu.vue'
import { Mode } from '@/utils/types'
import { getHashPart, setHashPart } from '@/utils/url'

export default Vue.extend({
  components: {
    NavMenu,
    FavoriteMenu,
  },
  props: {
    hasFavorites: {
      type: Boolean,
      default: false,
    },
    backgrounds: {
      type: Object,
      default: null,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    isModeFavorite: {
      type: Boolean,
      default: false,
    },
    initialBackground: {
      type: String,
      default: null,
    },
    map: {
      type: Object,
      default: null,
    },
    pitch: {
      type: Number,
      default: 0,
    },
  },

  data(): {
    building3d: Building3d | null
    is3D: boolean
    background: string | null
    showNavMenu: boolean
  } {
    return {
      building3d: null,
      is3D: false,
      background: null,
      showNavMenu: false,
    }
  },

  computed: {
    ...mapGetters({
      mode: 'site/mode',
    }),

    isModeExplorer(): boolean {
      return this.mode === Mode.EXPLORER
    },
  },

  watch: {
    map(value, oldValue) {
      if (!oldValue && value) {
        const navigationControl = new mapboxgl.NavigationControl({
          showCompass: true,
          showZoom: true,
          visualizePitch: true,
        })

        ;(this.$refs.navigationControlContainer as HTMLDivElement).appendChild(
          navigationControl.onAdd(this.map)
        )

        const geolocateControl = new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        })

        ;(this.$refs.geolocateControlContainer as HTMLDivElement).appendChild(
          geolocateControl.onAdd(this.map)
        )

        this.building3d = new Building3d({
          building3d: this.is3D,
        })

        this.map.addControl(this.building3d)
      }
    },
    pitch(value) {
      if (this.building3d) {
        this.building3d.set3d(value !== 0)
      }

      this.setIs3D(value !== 0)
    },
  },

  created() {
    this.setIs3D(this.pitch !== 0)
  },

  mounted() {
    if (getHashPart('bg') && this.backgrounds[getHashPart('bg') || '']) {
      this.background = getHashPart('bg')
    } else if (this.initialBackground) {
      this.background = this.initialBackground
    } else {
      this.displayNextBackground()
    }
  },

  methods: {
    setIs3D(value: boolean) {
      this.is3D = value
    },
    toggle3D() {
      if (this.building3d) {
        if (this.is3D) {
          this.building3d.set3d(false, 0)
        } else {
          this.building3d.set3d(true, 60)
        }

        this.setIs3D(!this.is3D)
      }
    },
    displayNextBackground() {
      if (!this.background) {
        return
      }

      const nextBackgroundName = this.nextBackgroundName(this.background)
      this.background = nextBackgroundName
      setHashPart('bg', nextBackgroundName)
      this.$emit('changeBackground', nextBackgroundName)
    },
    nextBackgroundName(backgroundNameReference: string): string {
      const styleNames = ['teritorio', 'aerial', 'mapnik']

      const backgroundReferenceIndex = styleNames.findIndex(
        (styleName) => styleName === backgroundNameReference
      )
      const styleIndex =
        backgroundReferenceIndex + 1 > styleNames.length - 1
          ? 0
          : backgroundReferenceIndex + 1

      return styleNames[styleIndex]
    },
    toggleMode() {
      this.$emit(
        'change-mode',
        this.isModeExplorer ? Mode.BROWSER : Mode.EXPLORER
      )
    },
    toggleNavMenu() {
      this.showNavMenu = !this.showNavMenu
    },
    toggleFavoriteMode() {
      const isFav = getHashPart('fav') === '1'
      if (!isFav) {
        setHashPart('fav', '1')
        this.$store.dispatch('favorite/handleFavoriteLayer', true)
        this.$store.dispatch('favorite/setFavoritesAction', 'open')
      } else {
        setHashPart('fav', null)
        this.$store.dispatch('favorite/handleFavoriteLayer', false)
        this.$store.dispatch('favorite/setFavoritesAction', 'close')
      }
    },
  },
})
</script>

<style>
.mapboxgl-ctrl-group {
  @apply space-y-3 contents;
}

.mapboxgl-ctrl-group > button,
.mapboxgl-ctrl-group > button:not(:disabled) {
  @apply text-sm font-bold text-gray-800 bg-white rounded-full focus:rounded-full shadow-md focus:shadow-md outline-none w-11 h-11 focus:outline-none hover:bg-gray-100 focus-visible:bg-gray-100;
}

.mapboxgl-ctrl-compass {
  @apply overflow-hidden;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib {
  @apply text-xs px-1 py-0.5 rounded-tl-sm;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib.mapboxgl-compact {
  min-height: 24px;

  @apply pl-2 pr-8 py-1 rounded-sm;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib.mapboxgl-compact:not(.mapboxgl-compact-show) {
  @apply bg-transparent;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib.mapboxgl-compact.mapboxgl-compact-show
  .mapboxgl-ctrl-attrib-button {
  @apply bg-transparent;
}
</style>
