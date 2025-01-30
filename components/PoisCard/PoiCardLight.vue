<script setup lang="ts">
import Fields from '~/components/PoisCard/Fields.vue'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import UIPicture from '~/components/UI/UIPicture.vue'
import type { ApiPoi } from '~/lib/apiPois'

//
// Props
//
const props = withDefaults(defineProps<{
  notebook?: boolean
  poi: ApiPoi
}>(), {
  notebook: false,
})

//
// Composables
//
const { featureName } = useFeature(toRef(() => props.poi), { type: 'popup' })

//
// Data
//
const colorFill = ref(props.poi.properties.display?.color_fill || 'black')
const colorLine = ref(props.poi.properties.display?.color_line || 'black')
const websiteDetails = ref(props.poi.properties.editorial && props.poi.properties.editorial['website:details'])
</script>

<template>
  <div
    :id="`PoiCardLight-${poi.properties.metadata.id}`"
    class="tw-flex-col md:tw-flex-row tw-h-auto tw-shrink-0 tw-flex tw-items-start tw-gap-4 tw-justify-between tw-box-border tw-w-full tw-border-gray-300 tw-border-t tw-pt-4 first-of-type:tw-border-t-0"
  >
    <div>
      <div class="tw-flex tw-items-center tw-shrink-0 tw-mb-2">
        <h3
          class="tw-block tw-text-xl tw-font-semibold tw-leading-tight tw-flex tw-items-center tw-gap-2"
          :style="`color:${colorLine}`"
        >
          <TeritorioIconBadge
            v-if="props.poi.properties.display?.icon || poi.properties.display?.text"
            :color-fill="colorFill"
            :picto="props.poi.properties.display?.icon"
            size="lg"
            :image="undefined"
            :text="poi.properties.display?.text"
          />
          {{ featureName }}
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
      class="tw-w-full tw-h-32 md:tw-w-32 md:tw-h-32 tw-z-10 tw-contents"
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
