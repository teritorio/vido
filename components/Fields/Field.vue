<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type GeoJSON from 'geojson'
import AddressField from '~/components/Fields/AddressField.vue'
import Coordinates from '~/components/Fields/Coordinates.vue'
import DateRange from '~/components/Fields/DateRange.vue'
import SocialNetwork from '~/components/Fields/SocialNetwork.vue'
import OpeningHours from '~/components/Fields/OpeningHours.vue'
import Phone from '~/components/Fields/Phone.vue'
import RoutesField from '~/components/Fields/RoutesField.vue'
import Stars from '~/components/Fields/Stars.vue'
import ExternalLink from '~/components/UI/ExternalLink.vue'
import FieldsHeader from '~/components/UI/FieldsHeader.vue'
import type { ApiPoiProperties, FieldsListItem } from '~/lib/apiPois'
import type { PropertyTranslationsContextEnum } from '~/stores/site'
import { useSiteStore } from '~/stores/site'
import { AssocRenderKeys } from '~/utils/types'

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
const { p, pv } = useSiteStore()

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
          <component :is="field.array ? 'li' : 'div'">
            <div
              v-if="field.render === 'text' && f.html"
              class="tw-prose"
              v-html="f.value"
            />

            <div
              v-else-if="field.render === 'text'"
              class="inline"
            >
              {{ f.value }}
              <a
                v-if="Boolean(details) && f.is_shortened"
                class="tw-underline"
                rel="noopener noreferrer"
                target="_blank"
                :href="details"
                @click.stop="$emit('clickDetails')"
              >
                {{ t('poiCard.seeDetail') }}
              </a>
            </div>

            <ClientOnly v-else-if="field.render === 'phone'">
              <Phone :number="f" />
            </ClientOnly>

            <ExternalLink
              v-else-if="field.render === 'weblink'"
              :title="f"
              :href="f"
            >
              {{ context !== 'label_list' ? f : '' }}
            </ExternalLink>

            <ExternalLink
              v-else-if="field.render === 'email'"
              :title="f"
              :href="`mailto:${f}`"
              :icon="field.icon"
            >
              {{ context !== 'label_list' ? f : '' }}
            </ExternalLink>

            <ExternalLink
              v-else-if="field.array && field.render === 'weblink@download'"
              :href="f"
              :icon="field.icon"
            >
              {{ f.split('/').pop() }}
            </ExternalLink>

            <a
              v-else-if="field.render === 'weblink@download'"
              class="d-inline-block pa-2 rounded-lg"
              :href="f"
              :style="{ backgroundColor: colorFill, color: colorText }"
            >
              <FontAwesomeIcon :icon="field.icon || 'external-link-alt'" />
              {{ fieldTranslateK(field.field) }}
            </a>

            <SocialNetwork
              v-else-if="field.render === 'weblink@social-network'"
              :url="f"
              :icon="field.icon"
            />

            <Stars
              v-else-if="field.render === 'osm:stars'"
              :stars="f"
            />

            <OpeningHours
              v-else-if="AssocRenderKeys.includes(field.render as AssocRenderKey)"
              :opening-hours="f"
              :context="context"
              :render-key="(field.render as AssocRenderKey)"
            />

            <span v-else>
              {{ pv(
                field.field,
                f,
                props.context,
              ) }}
            </span>
          </component>
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
