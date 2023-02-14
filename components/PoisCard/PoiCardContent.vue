<template>
  <div>
    <div class="flex items-center justify-between shrink-0">
      <h2
        v-if="name"
        class="block text-xl font-semibold leading-tight"
        :style="'color:' + colorLine"
      >
        {{ name }}
      </h2>

      <template v-if="Boolean(websiteDetails)">
        <NuxtLink
          v-if="localWebsiteDetails"
          class="ml-6 px-3 py-1.5 text-xs text-zinc-800 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-200 transition transition-colors rounded-md"
          :to="websiteDetails"
          rel="noopener noreferrer"
          @click.stop="trackingPopupEvent('details')"
        >
          {{ $tc('poiCard.details') }}
        </NuxtLink>
        <a
          v-else
          class="ml-6 px-3 py-1.5 text-xs text-zinc-800 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-200 transition transition-colors rounded-md"
          :href="websiteDetails"
          rel="noopener noreferrer"
          @click.stop="trackingPopupEvent('details')"
        >
          {{ $tc('poiCard.details') }}
        </a>
      </template>
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
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import Fields from '~/components/PoisCard/Fields.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import { ApiPoi, ApiPoiId } from '~/lib/apiPois'
import { coordinatesHref } from '~/lib/coordinates'
import { isIOS } from '~/utils/isIOS'

export default Vue.extend({
  components: {
    TeritorioIcon,
    FavoriteIcon,
    Fields,
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

    localWebsiteDetails(): boolean {
      if (!this.websiteDetails) {
        return false
      } else if (
        !this.websiteDetails.startsWith('https://') &&
        !this.websiteDetails.startsWith('http://')
      ) {
        return true
      } else {
        const url = new URL(this.websiteDetails)
        return url.hostname == window.location.hostname
      }
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
button {
  @apply focus:outline-none;
}
</style>
