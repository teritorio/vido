<template>
  <div
    :id="`PoiCardLight-${id}`"
    class="flex-col md:flex-row h-auto shrink-0 flex items-start gap-4 justify-between box-border w-full border-gray-300 border-t pt-4 first-of-type:border-t-0"
  >
    <div>
      <div class="flex items-center shrink-0 mb-2">
        <h3
          class="block text-xl font-semibold leading-tight flex items-center gap-2"
          :style="'color:' + colorLine"
        >
          <TeritorioIconBadge
            v-if="icon"
            :color-fill="colorFill"
            :picto="icon"
            size="lg"
            :image="undefined"
          />
          {{ name }}
        </h3>

        <a
          v-if="Boolean(websiteDetails)"
          class="ml-6 md:ml-8 px-3 py-1.5 text-xs text-zinc-800 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-200 transition transition-colors rounded-md"
          :href="websiteDetails"
          rel="noopener noreferrer"
          target="_blank"
        >
          {{ $t('poiCard.details') }}
        </a>
      </div>
      <Fields
        :fields="
          (poi.properties.editorial && poi.properties.editorial.popup_fields) ||
          []
        "
        :properties="poi.properties"
        :details="websiteDetails"
        :geom="poi.geometry"
      />
    </div>
    <NuxtPicture
      v-if="poi.properties.image && poi.properties.image.length > 0"
      class="w-full h-32 md:w-32 md:h-32 z-10"
      :src="poi.properties.image[0]"
      :alt="$t('poiCard.thumbnail')"
      media-size="8rem"
    />
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import Fields from '~/components/PoisCard/Fields.vue'
import NuxtPicture from '~/components/UI/NuxtPicture.vue'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { ApiPoi } from '~/lib/apiPois'
import { MapPoiId } from '~/lib/mapPois'
import { favoritesStore } from '~/stores/favorite'

export default defineNuxtComponent({
  components: {
    TeritorioIconBadge,
    Fields,
    NuxtPicture,
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

    description(): string | undefined {
      return this.poi.properties.description
    },

    websiteDetails(): string | undefined {
      return (
        this.poi.properties.editorial &&
        this.poi.properties.editorial['website:details']
      )
    },
  },
})
</script>

<style scoped>
h3 {
  margin-bottom: 0 !important;
}
</style>
