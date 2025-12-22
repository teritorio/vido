<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type GeoJSON from 'geojson'
import AddressField from '~/components/Fields/AddressField.vue'
import Coordinates from '~/components/Fields/Coordinates.vue'
import DateRange from '~/components/Fields/DateRange.vue'
import SocialNetwork from '~/components/Fields/SocialNetwork.vue'
import OpeningHours, { type AssocRenderKey } from '~/components/Fields/OpeningHours.vue'
import Phone from '~/components/Fields/Phone.vue'
import RoutesField from '~/components/Fields/RoutesField.vue'
import Stars from '~/components/Fields/Stars.vue'
import ExternalLink from '~/components/UI/ExternalLink.vue'
import FieldsHeader from '~/components/UI/FieldsHeader.vue'
import type { ApiPoiProperties, FieldsListItem } from '~/lib/apiPois'
import type { PropertyTranslationsContextEnum } from '~/stores/site'
import { useSiteStore } from '~/stores/site'

const props = withDefaults(defineProps<{
  context: PropertyTranslationsContextEnum
  recursionStack?: string[]
  field: FieldsListItem
  properties: ApiPoiProperties
  details?: string
  geom: GeoJSON.Geometry
}>(), {
  recursionStack: () => [],
})

defineEmits<{
  (e: 'clickDetails'): void
}>()

const { t } = useI18n()
const { colorFill, colorText } = useContrastedColors(
  toRef(() => props.properties.display?.color_fill || '#FFFFFF'),
  toRef(() => props.properties.display?.color_text),
)
const textLimit = ref(130)
const { p, pv } = useSiteStore()

const shortDescription = computed((): string | undefined => {
  return props.properties?.description?.['fr-FR'].replace(/(<([^>]+)>)/g, '')
})

function fieldTranslateK(field: string) {
  return p(field, props.context)
}

const translatedValue = computed(() => {
  const value = props.field.multilingual
    ? props.properties[props.field.field]?.['fr-FR']
    : props.properties[props.field.field]

  return props.field.array ? value : [value]
})
</script>

<template>
  <RoutesField
    v-if="field.render === 'route'"
    class="field_content"
    :context="context"
    :recursion-stack="recursionStack"
    :properties="properties"
  >
    <FieldsHeader
      v-if="field.label"
      :recursion-stack="recursionStack"
      :class="`field_header_level_${recursionStack.length}`"
    >
      {{ fieldTranslateK(field.field) }}
    </FieldsHeader>
  </RoutesField>

  <AddressField v-else-if="field.render === 'addr'" :properties="properties">
    <FieldsHeader
      v-if="field.label"
      :recursion-stack="recursionStack"
      :class="`field_header_level_${recursionStack.length}`"
    >
      {{ fieldTranslateK(field.field) }}
    </FieldsHeader>
  </AddressField>

  <DateRange
    v-else-if="field.render === 'start_end_date'"
    :start="properties.start_date"
    :end="properties.end_date"
    :class="`field_content_level_${recursionStack.length}`"
  >
    <FieldsHeader
      v-if="field.label"
      :recursion-stack="recursionStack"
      :class="`field_header_level_${recursionStack.length}`"
    >
      {{ fieldTranslateK(field.field) }}
    </FieldsHeader>
  </DateRange>

  <Coordinates v-else-if="field.render === 'coordinates'" :geom="geom">
    <FieldsHeader
      v-if="field.label"
      :recursion-stack="recursionStack"
      :class="`field_header_level_${recursionStack.length}`"
    >
      {{ fieldTranslateK(field.field) }}
    </FieldsHeader>
  </Coordinates>

  <div
    v-else-if="field.render === 'string@short' && shortDescription"
    class="inline"
  >
    <FieldsHeader
      v-if="field.label"
      :recursion-stack="undefined"
      :class="`field_header_level_${recursionStack.length}`"
    >
      {{ fieldTranslateK(field.field) }}
    </FieldsHeader>
    {{ shortDescription.substring(0, textLimit) }}
    <template v-if="shortDescription.length > textLimit">
      …
    </template>
    <a
      v-if="Boolean(details) && shortDescription.length > textLimit"
      class="tw-underline"
      :href="details"
      rel="noopener noreferrer"
      target="_blank"
      @click.stop="$emit('clickDetails')"
    >
      {{ t('poiCard.seeDetail') }}
    </a>
  </div>

  <div v-else-if="properties[field.field]">
    <FieldsHeader
      v-if="field.label"
      :recursion-stack="recursionStack"
      :class="`field_header_level_${recursionStack.length}`"
    >
      {{ fieldTranslateK(field.field) }}
    </FieldsHeader>
    <div :class="`inline field_content_level_${recursionStack.length}`">
      <component :is="field.array ? 'ul' : 'div'">
        <template v-for="(f, index) in translatedValue" :key="index">
          <div
            v-if="field.render === 'html'"
            class="tw-prose"
            v-html="properties.description?.['fr-FR']"
          />

          <component
            :is="field.array ? 'li' : 'div'"
            v-else-if="field.render === 'phone'"
            :key="`phone_${f}`"
          >
            <ClientOnly>
              <Phone :number="f" />
            </ClientOnly>
          </component>

          <component
            :is="field.array ? 'li' : 'div'"
            v-else-if="field.render === 'weblink'"
            :key="`website_${f}`"
          >
            <ExternalLink :title="f" :href="f">
              {{ context !== 'label_list' ? f : '' }}
            </ExternalLink>
          </component>

          <component
            :is="field.array ? 'li' : 'div'"
            v-else-if="field.render === 'email'"
            :key="`email_${f}`"
          >
            <ExternalLink :title="f" :href="`mailto:${f}`" icon="envelope">
              {{ context !== 'label_list' ? f : '' }}
            </ExternalLink>
          </component>

          <li
            v-else-if="field.array && field.render === 'weblink@download'"
            :key="`download_${f}`"
          >
            <ExternalLink :href="f" icon="arrow-circle-down">
              {{ f.split('/').pop() }}
            </ExternalLink>
          </li>

          <a
            v-else-if="field.render === 'weblink@download'"
            :href="properties[field.field]"
            class="d-inline-block pa-2 rounded-lg"
            :style="{ backgroundColor: colorFill, color: colorText }"
          >
            <FontAwesomeIcon icon="arrow-circle-down" />
            {{ fieldTranslateK(field.field) }}
          </a>

          <SocialNetwork
            v-else-if="field.render === 'weblink@social-network'"
            :url="properties[field.field]"
            :icon="field.icon"
          />

          <Stars
            v-else-if="field.render === 'osm:stars'"
            :stars="properties[field.field]"
          />

          <OpeningHours
            v-else-if="['osm:opening_hours', 'osm:collection_times', 'osm:opening_hours+values'].includes(field.render)"
            :opening-hours="properties[field.field]"
            :context="context"
            :render-key="(field.render as AssocRenderKey)"
          />

          <li v-else-if="field.array">
            {{ pv(field.field, f, props.context) }}
          </li>

          <span v-else>
            {{ pv(
              field.field,
              f,
              props.context,
            ) }}
          </span>
        </template>
      </component>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inline {
  overflow-wrap: break-word;
}

.tw-prose {
  max-width: none;
}

ul {
  @apply tw-list-disc tw-ml-6;
}
</style>
