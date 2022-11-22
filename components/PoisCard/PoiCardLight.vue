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
            :color-fill="colorFill"
            :picto="icon"
            size="lg"
            :image="null"
          />
          {{ name }}
        </h3>

        <a
          v-if="Boolean(websiteDetails)"
          class="ml-6 md:ml-8 px-3 py-1.5 text-xs text-zinc-800 bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-200 transition transition-colors rounded-md"
          :href="websiteDetails"
          rel="noopener noreferrer"
          target="_blank"
          @click.stop="trackingPopupEvent('details')"
        >
          {{ $tc('poiCard.details') }}
        </a>
      </div>
      <Fields
        :fields="poi.properties.editorial?.popup_fields || []"
        :properties="poi.properties"
        :details="websiteDetails"
        :geom="poi.geometry"
        @click-detail="trackingPopupEvent('details')"
      />
    </div>
    <NuxtPicture
      v-if="poi.properties.image && poi.properties.image.length > 0"
      class="w-full h-32 md:w-32 md:h-32 z-10"
      :src="poi.properties.image[0]"
      media-size="8rem"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

import Fields from '~/components/PoisCard/Fields.vue'
import NuxtPicture from '~/components/UI/NuxtPicture.vue'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import { ApiPoi } from '~/lib/apiPois'
import { MapPoiId } from '~/lib/mapPois'

export default Vue.extend({
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
    ...mapGetters({
      favoritesIds: 'favorite/favoritesIds',
    }),

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
