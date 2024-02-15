<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type GeoJSON from 'geojson'
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import AddressField, { isAddressFieldEmpty } from '~/components/Fields/AddressField.vue'
import Coordinates, { isCoordinatesEmpty } from '~/components/Fields/Coordinates.vue'
import DateRange, { isDateRangeEmpty } from '~/components/Fields/DateRange.vue'
import Facebook from '~/components/Fields/Facebook.vue'
import Instagram from '~/components/Fields/Instagram.vue'
import OpeningHours, { isOpeningHoursSupportedOsmTags } from '~/components/Fields/OpeningHours.vue'
import Phone from '~/components/Fields/Phone.vue'
import RoutesField, { isRoutesFieldEmpty } from '~/components/Fields/RoutesField.vue'
import Stars from '~/components/Fields/Stars.vue'
import ExternalLink from '~/components/UI/ExternalLink.vue'
import FieldsHeader from '~/components/UI/FieldsHeader.vue'
import type { ApiPoiProperties, FieldsListItem } from '~/lib/apiPois'
import type { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

export function isFiledEmpty(
  field: FieldsListItem,
  properties: { [key: string]: string },
  geom: GeoJSON.Geometry,
): boolean {
  if (field.field === 'route')
    return isRoutesFieldEmpty(properties)
  else if (field.field === 'addr')
    return isAddressFieldEmpty(properties)
  else if (field.field === 'start_end_date')
    return isDateRangeEmpty(properties)
  else if (field.field === 'coordinates')
    return isCoordinatesEmpty(geom)
  else
    return !(field.field in properties)
}

export default defineNuxtComponent({
  components: {
    FontAwesomeIcon,
    FieldsHeader,
    OpeningHours,
    RoutesField,
    AddressField,
    DateRange,
    Coordinates,
    Phone,
    Facebook,
    Instagram,
    ExternalLink,
    Stars,
  },

  emits: {
    clickDetails: () => true,
  },

  props: {
    context: {
      type: String as PropType<PropertyTranslationsContextEnum>,
      required: true,
    },
    recursionStack: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    field: {
      type: Object as PropType<FieldsListItem>,
      required: true,
    },
    properties: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
    details: {
      type: String as PropType<string>,
      default: null,
    },
    geom: {
      type: Object as PropType<GeoJSON.Geometry>,
      required: true,
    },
  },

  data(): {
    textLimit: number
  } {
    return {
      textLimit: 130,
    }
  },

  computed: {
    isWebsite(): boolean {
      return this.field.field === 'website' || this.field.field.startsWith('website:') || this.field.field.endsWith(':website')
    },
    shortDescription(): string | undefined {
      return this.properties?.description?.replace(/(<([^>]+)>)/gi, '')
    },
  },

  methods: {
    fieldTranslateK(field: string) {
      return this.$propertyTranslations.p(field, this.context)
    },

    propTranslateV(field: string) {
      return this.$propertyTranslations.pv(
        field,
        this.properties[field],
        this.context,
      )
    },

    propTranslateVs(field: string, value: string) {
      return this.$propertyTranslations.pv(field, value, this.context)
    },

    isOpeningHoursSupportedOsmTags(key: string) {
      return isOpeningHoursSupportedOsmTags(key)
    },
  },
})
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
      {{ $t('poiCard.seeDetail') }}
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
        <Phone :number="phone" />
      </div>

      <div
        v-for="item in properties[field.field]"
        v-else-if="isWebsite"
        :key="`website_${item}`"
      >
        <ExternalLink :href="item">
          {{ item }}
        </ExternalLink>
      </div>

      <div
        v-for="item in properties[field.field]"
        v-else-if="field.field === 'email'"
        :key="`email_${item}`"
      >
        <ExternalLink :href="`mailto:${item}`" icon="envelope">
          {{ item }}
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
      >
        <FontAwesomeIcon prefix="fa" icon="arrow-circle-down" />
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
