<script lang="ts">
import { mapState } from 'pinia'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import Fields from '~/components/PoisCard/Fields.vue'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import UIPicture from '~/components/UI/UIPicture.vue'
import type { ApiPoi } from '~/lib/apiPois'
import type { MapPoiId } from '~/lib/mapPois'
import { favoritesStore } from '~/stores/favorite'

export default defineNuxtComponent({
  components: {
    TeritorioIconBadge,
    Fields,
    UIPicture,
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
    ...mapState(favoritesStore, ['favoritesIds']),

    id(): MapPoiId {
      return this.poi.properties.metadata.id
    },

    name(): string | undefined {
      return (
        this.poi.properties.name
          || this.poi.properties.editorial?.class_label_popup?.fr
          || this.poi.properties.editorial?.class_label?.fr
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

    description(): string | undefined {
      return this.poi.properties.description
    },

    websiteDetails(): string | undefined {
      return (
        this.poi.properties.editorial
          && this.poi.properties.editorial['website:details']
      )
    },
  },
})
</script>

<template>
  <div
    :id="`PoiCardLight-${id}`"
    class="tw-flex-col md:tw-flex-row tw-h-auto tw-shrink-0 tw-flex tw-items-start tw-gap-4 tw-justify-between tw-box-border tw-w-full tw-border-gray-300 tw-border-t tw-pt-4 first-of-type:tw-border-t-0"
  >
    <div>
      <div class="tw-flex tw-items-center tw-shrink-0 tw-mb-2">
        <h3
          class="tw-block tw-text-xl tw-font-semibold tw-leading-tight tw-flex tw-items-center tw-gap-2"
          :style="`color:${colorLine}`"
        >
          <TeritorioIconBadge
            v-if="icon || poi.properties.display.text"
            :color-fill="colorFill"
            :picto="icon"
            size="lg"
            :image="undefined"
            :text="poi.properties.display.text"
          />
          {{ name }}
        </h3>

        <a
          v-if="Boolean(websiteDetails)"
          class="tw-ml-6 md:tw-ml-8 tw-px-3 tw-py-1.5 tw-text-xs tw-text-zinc-800 tw-bg-zinc-100 hover:tw-bg-zinc-200 focus:tw-bg-zinc-200 tw-transition tw-transition-colors tw-rounded-md"
          :href="websiteDetails"
          rel="noopener noreferrer"
          target="_blank"
        >
          {{ $t('poiCard.details') }}
        </a>
      </div>
      <Fields
        :fields="
          (poi.properties.editorial && poi.properties.editorial.popup_fields)
            || []
        "
        :properties="poi.properties"
        :details="websiteDetails"
        :geom="poi.geometry"
      />
    </div>
    <UIPicture
      v-if="poi.properties.image && poi.properties.image.length > 0"
      class="tw-w-full tw-h-32 md:tw-w-32 md:tw-h-32 tw-z-10"
      :src="poi.properties.image[0]"
      :alt="$t('poiCard.thumbnail')"
      media-size="8rem"
    />
  </div>
</template>

<style scoped>
h3 {
  margin-bottom: 0 !important;
}
</style>
