<template>
  <div
    :class="[
      'z-10 flex flex-col w-full md:max-w-xl mx-0 overflow-y-auto shadow-md pointer-events-auto md:flex-row md:w-auto md:mx-auto md:rounded-xl poiDescription',
      !isModeFavorites && notebook ? 'bg-zinc-200 opacity-70' : 'bg-white',
    ]"
  >
    <nuxt-picture
      v-if="poi.properties.image && poi.properties.image.length > 0"
      class="md:w-48 h-auto max-h-44 md:max-h-full"
      :src="poi.properties.image[0]"
      alt=""
    />
    <div
      v-else
      class="md:w-48 h-auto max-h-44 md:max-h-full bg-gray-100 flex align-middle justify-center"
    >
      <TeritorioIcon
        v-if="icon"
        color-text="#AAA"
        :picto="icon"
        :use-native-alignment="false"
        class="text-4xl"
      />
    </div>

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
          v-if="Boolean(websiteDetails)"
          class="ml-6 md:ml-8 px-3 py-1.5 text-xs text-zinc-800 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-200 transition transition-colors rounded-md"
          :href="websiteDetails"
          rel="noopener noreferrer"
          target="_blank"
          @click.stop="tracking('details')"
        >
          {{ $tc('poiCard.details') }}
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
        <PoiCardFields
          :properties="poi.properties"
          :details="websiteDetails"
          @click-detail="tracking('details')"
        />
      </div>

      <div
        class="flex items-center space-x-2 justify-evenly shrink-0 bottom-0 pt-2 shrink-0"
      >
        <CoordinateAction
          v-if="$screen.smallScreen"
          :geometry="poi.geometry"
          class="flex flex-col items-center flex-1 h-full p-2 space-y-2 rounded-lg hover:bg-zinc-100"
          :title="$tc('poiCard.findRoute')"
          @click="tracking('route')"
        >
          <font-awesome-icon icon="route" :color="colorLine" size="sm" />
          <span class="text-sm">{{ $tc('poiCard.route') }}</span>
        </CoordinateAction>

        <button
          class="flex flex-1 flex-col items-center space-y-2 rounded-lg p-2 h-full hover:bg-zinc-100"
          :title="$tc('poiCard.zoom')"
          @click.stop="onZoomClick"
        >
          <font-awesome-icon icon="plus" :color="colorLine" size="sm" />
          <span class="text-sm">{{ $tc('poiCard.zoom') }}</span>
        </button>

        <button
          :class="[
            'flex flex-1 flex-col items-center space-y-2 rounded-lg p-2 h-full',
            isModeExplorer && 'bg-blue-600 text-white hover:bg-blue-500',
            !isModeExplorer && 'hover:bg-zinc-100',
          ]"
          :title="
            isModeExplorer
              ? $tc('poiCard.unactivateExplore')
              : $tc('poiCard.activateExplore')
          "
          @click.stop="onExploreClick"
        >
          <font-awesome-icon
            icon="eye"
            :color="isModeExplorer ? 'white' : colorLine"
            size="sm"
          />
          <span class="text-sm">{{ $tc('poiCard.explore') }}</span>
        </button>

        <button
          v-if="id"
          class="flex flex-col items-center flex-1 h-full p-2 space-y-2 rounded-lg hover:bg-zinc-100"
          :title="
            isModeFavorites
              ? $tc('poiCard.favoriteOn')
              : $tc('poiCard.favoriteOff')
          "
          @click.stop="onFavoriteClick"
        >
          <FavoriteIcon :is-active="isModeFavorites" :color-line="colorLine" />
          <span class="text-sm">{{ $tc('poiCard.favorite') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import CoordinateAction from '../Fields/CoordinateAction.vue'

import PoiCardFields from '~/components/PoisCard/PoiCardFields.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import { ApiPoi, ApiPoiId } from '~/lib/apiPois'

export default Vue.extend({
  components: {
    TeritorioIcon,
    FavoriteIcon,
    PoiCardFields,
    CoordinateAction,
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

    id(): ApiPoiId | undefined {
      return this.poi.properties.metadata?.id
    },

    isModeFavorites(): boolean {
      const currentFavorites = this.favoritesIds
      return currentFavorites.includes(this.id)
    },

    name(): string | undefined {
      return (
        this.poi.properties.name ||
        this.poi.properties.editorial?.class_label_popup?.fr ||
        this.poi.properties.editorial?.class_label?.fr
      )
    },

    colorFill(): string {
      return this.poi.properties.display?.color_fill || 'black'
    },

    colorLine(): string {
      return this.poi.properties.display?.color_line || 'black'
    },

    icon(): string | undefined {
      return this.poi.properties.display?.icon
    },

    category(): string | undefined {
      return (
        this.poi.properties.editorial?.class_label_popup?.fr ||
        this.poi.properties.editorial?.class_label?.fr
      )
    },

    description(): string | undefined {
      return this.poi.properties.description
    },

    unavoidable(): boolean {
      return Boolean(this.poi.properties.editorial?.unavoidable)
    },

    websiteDetails(): string | undefined {
      return (
        this.poi.properties.editorial &&
        this.poi.properties.editorial['website:details']
      )
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
img {
  @apply object-cover w-full h-full;
}
</style>

<style scoped>
button {
  @apply focus:outline-none;
}
</style>