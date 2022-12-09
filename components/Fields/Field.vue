<template>
  <RoutesField
    v-if="field.field == 'route'"
    class="field_content"
    :context="context"
    :recursion-level="recursionLevel"
    :properties="properties"
  >
    <FieldsHeader
      v-if="field.label"
      :recursion-level="null"
      :class="`field_header_level_${recursionLevel}`"
      >{{ fieldTranslateK(field.field) }}</FieldsHeader
    >
  </RoutesField>

  <AddressField v-else-if="field.field === 'addr'" :properties="properties">
    <FieldsHeader
      v-if="field.label"
      :recursion-level="null"
      :class="`field_header_level_${recursionLevel}`"
      >{{ fieldTranslateK(field.field) }}</FieldsHeader
    >
  </AddressField>

  <DateRange
    v-else-if="field.field == 'start_end_date'"
    :start="properties.start_date"
    :end="properties.end_date"
    :class="`field_content_level_${recursionLevel}`"
  >
    <FieldsHeader
      v-if="field.label"
      :recursion-level="null"
      :class="`field_header_level_${recursionLevel}`"
      >{{ fieldTranslateK(field.field) }}</FieldsHeader
    >
  </DateRange>

  <Coordinates v-else-if="field.field === 'coordinates'" :geom="geom">
    <FieldsHeader
      v-if="field.label"
      :recursion-level="null"
      :class="`field_header_level_${recursionLevel}`"
      >{{ fieldTranslateK(field.field) }}</FieldsHeader
    >
  </Coordinates>

  <DateRange
    v-else-if="field.field === 'start_end_date'"
    :start="properties.start_date"
    :end="properties.end_date"
  />

  <div v-else-if="properties[field.field]">
    <FieldsHeader
      v-if="field.label"
      :recursion-level="null"
      :class="`field_header_level_${recursionLevel}`"
      >{{ fieldTranslateK(field.field) }}</FieldsHeader
    >
    <span :class="`field_content_level_${recursionLevel}`">
      <span v-if="field.field == 'description'">
        <template
          v-if="Boolean(details) && properties.description.length > textLimit"
        >
          {{ properties.description.substring(0, textLimit) + '...' }}
          <a
            class="underline"
            :href="details"
            rel="noopener noreferrer"
            target="_blank"
            @click.stop="$emit('click-details')"
          >
            {{ $tc('poiCard.seeDetail') }}
          </a>
        </template>
        <div v-else class="prose" v-html="properties.description" />
      </span>

      <Phone
        v-for="phone in properties[field.field]"
        v-else-if="
          (field.field === 'phone' || field.field === 'mobile') && showPhone
        "
        :key="field.field + '_' + phone"
        :number="phone"
      />

      <ExternalLink
        v-for="item in properties[field.field]"
        v-else-if="field.field == 'website'"
        :key="field.field + '_' + item"
        :href="item"
        target="_blank"
      >
        {{ item }}
      </ExternalLink>

      <ExternalLink
        v-for="item in properties[field.field]"
        v-else-if="field.field == 'email'"
        :key="field.field + '_' + item"
        :href="`mailto:${item}`"
      >
        {{ item }}
      </ExternalLink>

      <ExternalLink
        v-for="item in properties[field.field]"
        v-else-if="field.field == 'download'"
        :key="field.field + '_' + item"
        :href="item"
        icon="arrow-circle-down"
      >
        {{ item.split('/').pop() }}
      </ExternalLink>

      <ul
        v-else-if="
          Array.isArray(properties[field.field]) &&
          properties[field.field].length > 0
        "
      >
        <li
          v-for="item in properties[field.field]"
          :key="field.field + '_' + item"
        >
          {{ item }}
        </li>
      </ul>

      <Facebook
        v-else-if="field.field === 'facebook'"
        :url="properties[field.field]"
      />

      <a
        v-else-if="
          field.field == 'route:gpx_trace' || field.field == 'route:pdf'
        "
        :href="properties[field.field]"
      >
        <font-awesome-icon prefix="fa" icon="arrow-circle-down" />
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
    </span>
  </div>
</template>

<script lang="ts">
import GeoJSON from 'geojson'
import Vue, { PropType } from 'vue'

import AddressField, {
  isAddressFieldEmpty,
} from '~/components/Fields/AddressField.vue'
import Coordinates, {
  isCoordinatesEmpty,
} from '~/components/Fields/Coordinates.vue'
import DateRange, { isDateRangeEmpty } from '~/components/Fields/DateRange.vue'
import Facebook from '~/components/Fields/Facebook.vue'
import OpeningHours, {
  isOpeningHoursSupportedOsmTags,
} from '~/components/Fields/OpeningHours.vue'
import Phone from '~/components/Fields/Phone.vue'
import RoutesField, {
  isRoutesFieldEmpty,
} from '~/components/Fields/RoutesField.vue'
import ExternalLink from '~/components/UI/ExternalLink.vue'
import FieldsHeader from '~/components/UI/FieldsHeader.vue'
import { ApiPoiProperties, FieldsListItem } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

export function isFiledEmpty(
  field: FieldsListItem,
  properties: { [key: string]: string },
  geom: GeoJSON.Geometry
): boolean {
  if (field.field == 'route') {
    return isRoutesFieldEmpty(properties)
  } else if (field.field === 'addr') {
    return isAddressFieldEmpty(properties)
  } else if (field.field == 'start_end_date') {
    return isDateRangeEmpty(properties)
  } else if (field.field === 'coordinates') {
    return isCoordinatesEmpty(geom)
  } else {
    return !(field.field in properties)
  }
}

export default Vue.extend({
  components: {
    FieldsHeader,
    OpeningHours,
    RoutesField,
    AddressField,
    DateRange,
    Coordinates,
    Phone,
    Facebook,
    ExternalLink,
  },

  props: {
    context: {
      type: String as PropType<PropertyTranslationsContextEnum>,
      required: true,
    },
    recursionLevel: {
      type: Number,
      default: 0,
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
      type: String,
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
    showPhone(): boolean {
      return (
        this.context != PropertyTranslationsContextEnum.Card ||
        this.$screen.phone
      )
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
        this.context
      )
    },

    isOpeningHoursSupportedOsmTags(key: string) {
      return isOpeningHoursSupportedOsmTags(key)
    },
  },
})
</script>

<style lang="scss" scoped>
.prose {
  max-width: none;
}

ul {
  @apply list-disc ml-6;
}
</style>
