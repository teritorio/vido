<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { mapState } from 'pinia'
import type { PropType } from 'vue'
import { defineNuxtComponent } from '#app'
import Fields from '~/components/PoisCard/Fields.vue'
import FavoriteIcon from '~/components/UI/FavoriteIcon.vue'
import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import type { ApiPoi, ApiPoiId } from '~/lib/apiPois'
import { coordinatesHref } from '~/lib/coordinates'
import { favoritesStore } from '~/stores/favorite'
import { mapStore } from '~/stores/map'
import { isIOS } from '~/utils/isIOS'
import ContributionMixin from '~/mixins/contribution'

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    TeritorioIcon,
    FavoriteIcon,
    Fields,
  },
  mixins: [ContributionMixin],
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
    ...mapState(mapStore, ['isModeExplorer']),
    ...mapState(favoritesStore, ['favoritesIds']),

    device() {
      return this.$device
    },

    id(): ApiPoiId {
      return this.poi.properties.metadata.id
    },

    isModeFavorites(): boolean {
      const currentFavorites = this.favoritesIds
      return currentFavorites.includes(this.id)
    },

    name(): string | undefined {
      return (
        this.poi.properties.name
          || this.poi.properties.editorial?.class_label_popup?.fr
          || this.poi.properties.editorial?.class_label?.fr
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
        this.poi.properties.editorial?.class_label_popup?.fr
          || this.poi.properties.editorial?.class_label?.fr
      )
    },

    description(): string | undefined {
      return this.poi.properties.description
    },

    unavoidable(): boolean {
      return Boolean(this.poi.properties.editorial?.unavoidable)
    },

    websiteDetails(): string | undefined {
      const url
        = this.poi.properties.editorial
        && this.poi.properties.editorial['website:details']

      if (!url) {
        return undefined
      }
      else if (!url.startsWith('https://') && !url.startsWith('http://')) {
        return url
      }
      else {
        const u = new URL(url)
        if (u.hostname !== window.location.hostname) {
          return url
        }
        else {
          return url.replace(
            `${u.protocol}//${u.hostname}${u.port ? `:${u.port}` : ''}`,
            '',
          )
        }
      }
    },

    coordinatesHref(): string | undefined {
      return isIOS !== undefined
        ? coordinatesHref(this.poi.geometry, isIOS())
        : undefined
    },
  },

  emits: {
    zoomClick: (_poi: ApiPoi) => true,
    exploreClick: (_poi: ApiPoi) => true,
    favoriteClick: (_poi: ApiPoi) => true,
  },

  methods: {
    onZoomClick() {
      this.trackingPopupEvent('zoom')
      this.$emit('zoomClick', this.poi)
    },

    onExploreClick() {
      if (!this.isModeExplorer)
        this.trackingPopupEvent('explore')

      this.$emit('exploreClick', this.poi)
    },

    onFavoriteClick() {
      if (!this.isModeFavorites)
        this.trackingPopupEvent('favorite')

      this.$emit('favoriteClick', this.poi)
    },

    trackingPopupEvent(
      event: 'details' | 'route' | 'explore' | 'favorite' | 'zoom',
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

<template>
  <div>
    <div class="tw-flex tw-items-center tw-justify-between tw-shrink-0">
      <h2
        v-if="name"
        class="tw-block tw-text-xl tw-font-semibold tw-leading-tight"
        :style="`color:${colorLine}`"
      >
        {{ name }}
      </h2>

      <template v-if="websiteDetails !== undefined">
        <NuxtLink
          v-if="
            !websiteDetails.startsWith('https://')
              && !websiteDetails.startsWith('http://')
          "
          class="tw-ml-6 tw-px-3 tw-py-1.5 tw-text-xs tw-text-zinc-800 tw-bg-zinc-100 hover:tw-bg-zinc-200 focus:tw-bg-zinc-200 tw-transition tw-transition-colors tw-rounded-md"
          :to="websiteDetails"
          :style="`background:${colorLine};color:white`"
          rel="noopener noreferrer"
          @click.stop="trackingPopupEvent('details')"
        >
          {{ $t('poiCard.details') }}
        </NuxtLink>
        <a
          v-else
          class="tw-ml-6 tw-px-3 tw-py-1.5 tw-text-xs tw-text-zinc-800 tw-bg-zinc-100 hover:tw-bg-zinc-200 focus:tw-bg-zinc-200 tw-transition tw-transition-colors tw-rounded-md"
          :href="websiteDetails"
          :style="`background:${colorLine};color:white`"
          rel="noopener noreferrer"
          @click.stop="trackingPopupEvent('details')"
        >
          {{ $t('poiCard.details') }}
        </a>
      </template>
    </div>

    <div
      v-if="!unavoidable"
      class="tw-flex tw-items-center tw-mt-2 tw-text-sm tw-text-zinc-500 tw-shrink-0"
    >
      <TeritorioIcon
        v-if="icon"
        :color-text="colorLine"
        class="tw-mr-2"
        :picto="icon"
        :use-native-alignment="false"
      />

      {{ category }}
    </div>

    <p
      v-if="unavoidable && Boolean(description)"
      class="tw-text-sm tw-flex-grow tw-shrink-0 tw-mt-6"
    >
      {{ description }}
    </p>

    <div v-else class="tw-h-auto tw-flex-grow tw-shrink-0">
      <Fields
        :fields="
          (poi.properties.editorial && poi.properties.editorial.popup_fields)
            || []
        "
        :properties="poi.properties"
        :details="websiteDetails"
        :geom="poi.geometry"
        class="tw-mt-6 tw-text-sm"
        @click-detail="trackingPopupEvent('details')"
      />
      <ContribFieldGroup v-if="contribMode && isContribEligible(poi.properties)" v-bind="getContributorFields(poi)" />
    </div>

    <div
      class="tw-flex tw-items-center tw-space-x-2 tw-justify-evenly tw-shrink-0 tw-bottom-0 tw-pt-2"
    >
      <a
        v-if="device.value.phone && coordinatesHref"
        :href="coordinatesHref"
        class="tw-flex tw-flex-col tw-items-center tw-flex-1 tw-h-full tw-p-2 tw-space-y-2 tw-rounded-lg hover:tw-bg-zinc-100"
        :title="$t('poiCard.findRoute')"
        @click="trackingPopupEvent('route')"
      >
        <FontAwesomeIcon icon="route" :color="colorLine" size="sm" />
        <span class="tw-text-sm">{{ $t('poiCard.route') }}</span>
      </a>

      <button
        type="button"
        class="tw-flex tw-flex-1 tw-flex-col tw-items-center tw-space-y-2 tw-rounded-lg tw-p-2 tw-h-full hover:tw-bg-zinc-100"
        :title="$t('poiCard.zoom')"
        @click.stop="onZoomClick"
      >
        <FontAwesomeIcon icon="plus" :color="colorLine" size="sm" />
        <span class="tw-text-sm">{{ $t('poiCard.zoom') }}</span>
      </button>

      <button
        v-if="explorerModeEnabled"
        type="button"
        class="tw-flex tw-flex-1 tw-flex-col tw-items-center tw-space-y-2 tw-rounded-lg tw-p-2 tw-h-full" :class="[
          isModeExplorer && 'tw-bg-blue-600 tw-text-white hover:tw-bg-blue-500',
          !isModeExplorer && 'hover:tw-bg-zinc-100',
        ]"
        :title="
          isModeExplorer
            ? $t('poiCard.unactivateExplore')
            : $t('poiCard.activateExplore')
        "
        @click.stop="onExploreClick"
      >
        <FontAwesomeIcon
          icon="eye"
          :color="isModeExplorer ? 'white' : colorLine"
          size="sm"
        />
        <span class="tw-text-sm">{{ $t('poiCard.explore') }}</span>
      </button>

      <button
        v-if="favoritesModeEnabled && id"
        type="button"
        class="tw-flex tw-flex-col tw-items-center tw-flex-1 tw-h-full tw-p-2 tw-space-y-2 tw-rounded-lg hover:tw-bg-zinc-100"
        :title="
          isModeFavorites ? $t('poiCard.favoriteOn') : $t('poiCard.favoriteOff')
        "
        @click.stop="onFavoriteClick"
      >
        <FavoriteIcon :is-active="isModeFavorites" :color-line="colorLine" />
        <span class="tw-text-sm">{{ $t('poiCard.favorite') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
button {
  @apply focus:tw-outline-none;
}
</style>
