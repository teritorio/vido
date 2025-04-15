<script setup lang="ts">
import Fields from '~/components/PoisCard/Fields.vue'
import TeritorioIconBadge from '~/components/UI/TeritorioIconBadge.vue'
import UIPicture from '~/components/UI/UIPicture.vue'
import type { ApiPoi } from '~/lib/apiPois'
import { getContrastedColors } from '~/composables/useFeature'

const props = withDefaults(defineProps<{
  notebook?: boolean
  poi: ApiPoi
}>(), {
  notebook: false,
})

const { featureName } = useFeature(toRef(() => props.poi), { type: 'popup' })

const colorLine = ref(props.poi.properties.display?.color_line || '#000000')
const websiteDetails = ref(props.poi.properties.editorial && props.poi.properties.editorial['website:details'])

const teritorioIconBadgeProps = computed(() => {
  const { colorFill, colorText } = getContrastedColors(props.poi.properties.display?.color_fill, props.poi.properties.display?.color_text)

  return {
    colorFill: props.poi.properties['route:point:type'] ? colorText : colorFill,
    colorText: props.poi.properties['route:point:type'] ? colorFill : colorText,
    picto: props.poi.properties.display?.icon,
    text: props.poi.properties.display?.text,
    size: 'lg',
  }
})
</script>

<template>
  <article :id="`PoiCardLight-${poi.properties.metadata.id}`">
    <div>
      <header>
        <TeritorioIconBadge
          v-if="props.poi.properties.display?.icon || poi.properties.display?.text"
          v-bind="teritorioIconBadgeProps"
        />
        <h3
          class="tw-text-xl tw-font-semibold tw-leading-tight"
          :style="{
            color: colorLine,
          }"
        >
          {{ featureName }}
        </h3>

        <a
          v-if="Boolean(websiteDetails)"
          :href="websiteDetails"
          class="tw-text-xs tw-text-zinc-800 tw-bg-zinc-100 hover:tw-bg-zinc-200 focus:tw-bg-zinc-200 tw-transition tw-transition-colors"
          rel="noopener noreferrer"
          target="_blank"
        >
          {{ $t('poiCard.details') }}
        </a>
      </header>

      <section>
        <Fields
          :fields="(poi.properties.editorial && poi.properties.editorial.popup_fields) || []"
          :properties="poi.properties"
          :details="websiteDetails"
          :geom="poi.geometry"
        />
      </section>
    </div>

    <UIPicture
      v-if="poi.properties.image && poi.properties.image.length > 0"
      :src="poi.properties.image[0]"
      :alt="$t('poiCard.thumbnail')"
      media-size="8rem"
    />
  </article>
</template>

<style scoped>
article {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

article:not(:last-of-type) {
  border-bottom: 1px solid #d1d5db;
  padding-bottom: 1rem;
}

article > div {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

header {
  align-items: center;
  display: flex;
  gap: 0.5rem;
}

header > a {
  padding: 0.5rem;
  border-radius: 4px;
  margin-left: auto;
  align-self: flex-start;
}

header > h3 {
  margin: 0;
}

article > picture {
  display: block;
  width: 100%;
  max-height: 280px;
  overflow: hidden;
}

article > picture:deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

@media (width >= 768px) {
  article {
    flex-direction: row;
  }

  article > div {
    flex: 70%;
  }

  article > picture {
    flex: 30%;
  }
}
</style>
