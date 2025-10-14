<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type GeoJSON from 'geojson'
import AddressField from '~/components/Fields/AddressField.vue'
import Coordinates from '~/components/Fields/Coordinates.vue'
import DateRange from '~/components/Fields/DateRange.vue'
import Facebook from '~/components/Fields/Facebook.vue'
import LinkedIn from '~/components/Fields/LinkedIn.vue'
import Instagram from '~/components/Fields/Instagram.vue'
import OpeningHours from '~/components/Fields/OpeningHours.vue'
import { isOpeningHoursSupportedOsmTags } from '~/composables/useOpeningHours'
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

if (!props.properties.display)
  throw createError(`Feature ${props.properties.metadata.id} is missing 'display' property.`)

const { t } = useI18n()
const { colorFill, colorText } = useContrastedColors(
  toRef(() => props.properties.display?.color_fill || '#FFFFFF'),
  toRef(() => props.properties.display?.color_text),
)
const textLimit = ref(130)
const { p, pv } = useSiteStore()

const isWebsite = computed((): boolean => {
  return props.field.field === 'website' || props.field.field.startsWith('website:') || props.field.field.endsWith(':website')
})
const shortDescription = computed((): string | undefined => {
  return props.properties?.description?.replace(/(<([^>]+)>)/g, '')
})

function fieldTranslateK(field: string) {
  return p(field, props.context)
}

function propTranslateV(field: string) {
  return pv(
    field,
    props.properties[field],
    props.context,
  )
}

function propTranslateVs(field: string, value: string) {
  return pv(field, value, props.context)
}
</script>

<template>
  <RoutesField
    v-if="field.field === 'route'"
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

  <AddressField v-else-if="field.field === 'addr'" :properties="properties">
    <FieldsHeader
      v-if="field.label"
      :recursion-stack="recursionStack"
      :class="`field_header_level_${recursionStack.length}`"
    >
      {{ fieldTranslateK(field.field) }}
    </FieldsHeader>
  </AddressField>

  <DateRange
    v-else-if="field.field === 'start_end_date'"
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

  <Coordinates v-else-if="field.field === 'coordinates'" :geom="geom">
    <FieldsHeader
      v-if="field.label"
      :recursion-stack="recursionStack"
      :class="`field_header_level_${recursionStack.length}`"
    >
      {{ fieldTranslateK(field.field) }}
    </FieldsHeader>
  </Coordinates>

  <div
    v-else-if="field.field === 'short_description' && shortDescription"
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
      <div
        v-if="field.field === 'description'"
        class="tw-prose"
        v-html="properties.description"
      />

      <div
        v-for="phone in properties[field.field]"
        v-else-if="field.field === 'phone' || field.field === 'mobile'"
        :key="`phone_${phone}`"
      >
        <ClientOnly>
          <Phone :number="phone" />
        </ClientOnly>
      </div>

      <div
        v-for="item in properties[field.field]"
        v-else-if="isWebsite"
        :key="`website_${item}`"
      >
        <ExternalLink :title="item" :href="item">
          {{ context !== 'label_list' ? item : '' }}
        </ExternalLink>
      </div>

      <div
        v-for="item in properties[field.field]"
        v-else-if="field.field === 'email'"
        :key="`email_${item}`"
      >
        <ExternalLink :title="item" :href="`mailto:${item}`" icon="envelope">
          {{ context !== 'label_list' ? item : '' }}
        </ExternalLink>
      </div>

      <div
        v-for="item in properties[field.field]"
        v-else-if="field.field === 'download'"
        :key="`download_${item}`"
      >
        <ExternalLink :href="item" icon="arrow-circle-down">
          {{ item.split('/').pop() }}
        </ExternalLink>
      </div>

      <ul
        v-else-if="
          Array.isArray(properties[field.field])
            && properties[field.field].length > 0
        "
      >
        <li
          v-for="item in properties[field.field]"
          :key="`${field.field}_${item}`"
        >
          {{ propTranslateVs(field.field, item) }}
        </li>
      </ul>

      <Facebook
        v-else-if="field.field === 'facebook'"
        :url="properties[field.field]"
      />

      <LinkedIn
        v-else-if="field.field === 'linkedin'"
        :url="properties[field.field]"
      />

      <Instagram
        v-else-if="field.field === 'instagram'"
        :url="properties[field.field]"
      />

      <Stars
        v-else-if="field.field === 'stars'"
        :stars="properties[field.field]"
      />

      <a
        v-else-if="
          field.field === 'route:gpx_trace' || field.field === 'route:pdf'
        "
        :href="properties[field.field]"
        class="d-inline-block pa-2 rounded-lg"
        :style="{ backgroundColor: colorFill, color: colorText }"
      >
        <FontAwesomeIcon icon="arrow-circle-down" />
        {{ fieldTranslateK(field.field) }}
      </a>

      <OpeningHours
        v-else-if="isOpeningHoursSupportedOsmTags(field.field)"
        :opening-hours="properties[field.field]"
        :context="context"
        :tag-key="field.field"
      />

      <span v-else>
        {{ propTranslateV(field.field) }}
      </span>
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
