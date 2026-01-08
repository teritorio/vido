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
import type { FieldsListItem } from '~/types/api/field'
import type { Poi } from '~/types/local/poi'
import { PropertyTranslationsContextEnum, useSiteStore } from '~/stores/site'
import { AssocRenderKeys } from '~/utils/types'

const props = withDefaults(defineProps<{
  context: PropertyTranslationsContextEnum
  recursionStack?: string[]
  field: FieldsListItem
  properties: Poi['properties']
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
      <component
        :is="field.array ? 'ul' : 'div'"
        :style="{
          listStyleType: context === PropertyTranslationsContextEnum.Card ? 'none' : 'disc',
        }"
      >
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

            <FieldLink
              v-else-if="field.render && ['email', 'weblink', 'weblink@download'].includes(field.render)"
              :title="props.properties.name?.['fr-FR']"
              :href="field.render === 'email' ? `mailto:${f}` : f"
              :icon="field.icon"
              :context="context"
              :color-fill="props.properties.display?.color_fill"
              :color-text="props.properties.display?.color_text"
            >
              {{ fieldTranslateK(field.field) }}
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
</style>
