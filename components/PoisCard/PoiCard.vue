<template>
  <div
    :id="`PoiCard-${id}`"
    :class="[
      'poiDescription',
      'z-10 flex flex-col w-full md:max-w-xl mx-0 overflow-y-auto shadow-md pointer-events-auto md:flex-row md:w-auto md:mx-auto md:rounded-xl bg-white',
    ]"
  >
    <div
      v-if="showImage"
      class="md:w-48 h-44 md:h-auto md:max-h-full bg-gray-100 flex items-center align-middle justify-center relative min-icon-height"
    >
      <TeritorioIcon
        v-if="icon"
        :picto="icon"
        :use-native-alignment="false"
        class="text-8xl align-middle absolute z-0"
        :color-text="
          poi.properties.image && poi.properties.image.length > 0
            ? '#AAA'
            : colorFill
        "
      />
      <NuxtPicture
        v-if="poi.properties.image && poi.properties.image.length > 0"
        class="object-cover h-44 w-full md:w-48 md:h-full z-10"
        :src="poi.properties.image[0]"
        :alt="$t('poiCard.thumbnail')"
        media-size="30rem"
      />
    </div>

    <div
      class="px-4 py-5 flex flex-col md:overflow-y-auto flex-grow h-auto md:max-h-full box-border w-full md:h-80 md:w-96"
    >
      <div class="flex items-center justify-between shrink-0">
        <h2
          v-if="name"
          class="block text-xl font-semibold leading-tight"
          :style="'color:' + colorLine"
        >
          {{ name }}
        </h2>

        <NuxtLink
          v-if="Boolean(websiteDetails)"
          type="button"
          class="ml-6 md:ml-8 px-3 py-1.5 text-xs text-zinc-800 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-200 transition transition-colors rounded-md"
          :to="websiteDetails"
          rel="noopener noreferrer"
          @click.stop="trackingPopupEvent('details')"
        >
          {{ $tc('poiCard.details') }}
        </NuxtLink>
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
        <Fields
          :fields="poi.properties.editorial?.popup_fields || []"
          :properties="poi.properties"
          :details="websiteDetails"
          :geom="poi.geometry"
          class="mt-6 text-sm"
          @click-detail="trackingPopupEvent('details')"
        />
      </div>

      <div
        class="flex items-center space-x-2 justify-evenly shrink-0 bottom-0 pt-2"
      >
        <a
          v-if="$screen.phone && coordinatesHref"
          :href="coordinatesHref"
          class="flex flex-col items-center flex-1 h-full p-2 space-y-2 rounded-lg hover:bg-zinc-100"
          :title="$tc('poiCard.findRoute')"
          @click="trackingPopupEvent('route')"
        >
          <font-awesome-icon icon="route" :color="colorLine" size="sm" />
          <span class="text-sm">{{ $tc('poiCard.route') }}</span>
        </a>

        <button
          type="button"
          class="flex flex-1 flex-col items-center space-y-2 rounded-lg p-2 h-full hover:bg-zinc-100"
          :title="$tc('poiCard.zoom')"
          @click.stop="onZoomClick"
        >
          <font-awesome-icon icon="plus" :color="colorLine" size="sm" />
          <span class="text-sm">{{ $tc('poiCard.zoom') }}</span>
        </button>

        <button
          v-if="explorerModeEnabled"
          type="button"
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
          v-if="favoritesModeEnabled && id"
          type="button"
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

import Fields from '~/components/PoisCard/Fields.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import NuxtPicture from '~/components/UI/NuxtPicture.vue'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import { ApiPoi, ApiPoiId } from '~/lib/apiPois'
import { coordinatesHref } from '~/lib/coordinates'
import { isIOS } from '~/utils/isIOS'

export default Vue.extend({
  components: {
    TeritorioIcon,
    FavoriteIcon,
    Fields,
    NuxtPicture,
  },

  props: {
    poi: {
      type: Object as PropType<ApiPoi>,
      required: true,
    },
    explorerModeEnabled: {
      type: Boolean,
      required: true,
    },
    favoritesModeEnabled: {
      type: Boolean,
      required: true,
    },
    showImage: {
      type: Boolean,
      default: true,
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

    id(): ApiPoiId {
      return this.poi.properties.metadata.id
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

    coordinatesHref(): string | undefined {
      return isIOS !== undefined
        ? coordinatesHref(this.poi.geometry, isIOS())
        : undefined
    },
  },

  methods: {
    onZoomClick() {
      this.trackingPopupEvent('zoom')
      this.$emit('zoom-click', this.poi)
    },

    onExploreClick() {
      if (!this.isModeExplorer) {
        this.trackingPopupEvent('explore')
      }
      this.$emit('explore-click', this.poi)
    },

    onFavoriteClick() {
      if (!this.isModeFavorites) {
        this.trackingPopupEvent('favorite')
      }
      this.$emit('favorite-click', this.poi)
    },

    trackingPopupEvent(
      event: 'details' | 'route' | 'explore' | 'favorite' | 'zoom'
    ) {
      this.$tracking({
        type: 'popup_event',
        event,
        poiId: this.id,
        category: this.category || '',
        title: this.poi.properties?.name,
      })
    },
  },
})
</script>

<style scoped>
:deep(img) {
  @apply object-cover w-full h-full;
}

button {
  @apply focus:outline-none;
}

.min-icon-height {
  min-height: 8rem;
}
</style>
