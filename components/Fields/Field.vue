<script setup lang="ts">
import type GeoJSON from 'geojson'
import AddressField from '~/components/Fields/AddressField.vue'
import Coordinates from '~/components/Fields/Coordinates.vue'
import DateRange from '~/components/Fields/DateRange.vue'
import SocialNetwork from '~/components/Fields/SocialNetwork.vue'
import OpeningHours from '~/components/Fields/OpeningHours.vue'
import Phone from '~/components/Fields/Phone.vue'
import RoutesField from '~/components/Fields/RoutesField.vue'
import Stars from '~/components/Fields/Stars.vue'
import FieldsHeader from '~/components/UI/FieldsHeader.vue'
import FieldLink from '~/components/Fields/FieldLink.vue'
import type { FieldsListItem } from '~/types/local/field'
import type { PoiUnion } from '~/types/local/poi-deps'
import type { PropertyTranslationsContextEnum } from '~/stores/site'
import { useSiteStore } from '~/stores/site'
import { AssocRenderKeys } from '~/utils/types'
import { getNestedPropertyValue } from '~/utils/property'
import type { ApiPoiPropertiesAddress, ApiPoiPropertiesRoute, ApiPoiPropertiesStartEndDate } from '~/types/api/poi'

const props = withDefaults(defineProps<{
  context: PropertyTranslationsContextEnum
  recursionStack?: string[]
  field: FieldsListItem
  properties: PoiUnion['properties']
  details?: string
  geom: GeoJSON.Geometry
}>(), {
  recursionStack: () => [],
})

defineEmits<{
  (e: 'clickDetails'): void
}>()

const { t } = useI18n()
const { p, pv } = useSiteStore()

const translatedValue = computed(() => {
  const value = getNestedPropertyValue(props.properties, props.field.field, props.field.multilingual ?? false)

  return props.field.array ? value : [value].filter(Boolean)
})
</script>

<template>
  <RoutesField
    v-if="field.render === 'route'"
    class="field_content"
    :context="context"
    :recursion-stack="recursionStack"
    :properties="(properties[field.field] as ApiPoiPropertiesRoute)"
  >
    <FieldsHeader
      v-if="field.label"
      :recursion-stack="recursionStack"
      :class="`field_header_level_${recursionStack.length}`"
    >
      {{ p(field.translationKey) }}
    </FieldsHeader>
  </RoutesField>

  <AddressField
    v-else-if="field.render === 'addr'"
    v-bind="(properties[field.field] as ApiPoiPropertiesAddress)"
  >
    <FieldsHeader
      v-if="field.label"
      :recursion-stack="recursionStack"
      :class="`field_header_level_${recursionStack.length}`"
    >
      {{ p(field.translationKey) }}
    </FieldsHeader>
  </AddressField>

  <DateRange
    v-else-if="field.render === 'start_end_date'"
    :start="(properties[field.field] as ApiPoiPropertiesStartEndDate | undefined)?.start_date"
    :end="(properties[field.field] as ApiPoiPropertiesStartEndDate | undefined)?.end_date"
    :class="`field_content_level_${recursionStack.length}`"
  >
    <FieldsHeader
      v-if="field.label"
      :recursion-stack="recursionStack"
      :class="`field_header_level_${recursionStack.length}`"
    >
      {{ p(field.translationKey) }}
    </FieldsHeader>
  </DateRange>

  <Coordinates v-else-if="field.render === 'coordinates'" :geom="geom">
    <FieldsHeader
      v-if="field.label"
      :recursion-stack="recursionStack"
      :class="`field_header_level_${recursionStack.length}`"
    >
      {{ p(field.translationKey) }}
    </FieldsHeader>
  </Coordinates>

  <div v-else>
    <FieldsHeader
      v-if="field.label"
      :recursion-stack="recursionStack"
      :class="`field_header_level_${recursionStack.length}`"
    >
      {{ p(field.translationKey) }}
    </FieldsHeader>
    <div :class="`inline field_content_level_${recursionStack.length}`">
      <component :is="field.array ? 'ul' : 'div'">
        <template v-for="(f, index) in translatedValue" :key="index">
          <component :is="field.array ? 'li' : 'div'">
            <div
              v-if="field.render === 'text' && (f.html ?? true)"
              class="tw-prose"
              v-html="f.value"
            />

            <div
              v-else-if="field.render === 'text' && f.html === false"
              class="inline tw-prose"
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

            <FieldLink
              v-else-if="field.render && ['email', 'weblink', 'weblink@download'].includes(field.render)"
              :title="props.properties.name?.['fr-FR']"
              :href="field.render === 'email' ? `mailto:${f}` : f"
              :icon="field.icon"
              :context="context"
              :color-fill="['weblink', 'email'].includes(field.render ?? '') ? undefined : props.properties.display.color_fill"
              :color-text="['weblink', 'email'].includes(field.render ?? '') ? undefined : props.properties.display.color_text"
            >
              {{ field.render === 'weblink' ? f : p(field.translationKey) }}
            </FieldLink>

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
                field.translationKey,
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
</style>
