<template>
  <div v-if="field.field == 'route'">
    <FieldsHeader
      v-if="field.label"
      :recursion-level="recursionLevel"
      class="`field_header_level_${recursionLevel}`"
      >{{ fieldTranslateK(field.field) }}</FieldsHeader
    >
    <RoutesField
      class="field_content"
      :context="context"
      :properties="properties"
    />
  </div>

  <div v-else-if="field.field === 'addr'">
    <FieldsHeader
      v-if="field.label"
      :recursion-level="recursionLevel"
      :class="`field_header_level_${recursionLevel}`"
      >{{ fieldTranslateK(field.field) }}</FieldsHeader
    >
    <AddressField :properties="properties" />
  </div>

  <div v-else-if="field.field == 'start_end_date'">
    <FieldsHeader
      v-if="field.label"
      :recursion-level="recursionLevel"
      :class="`field_header_level_${recursionLevel}`"
      >{{ fieldTranslateK(field.field) }}</FieldsHeader
    >
    <DateRange
      :start="properties.start_date"
      :end="properties.end_date"
      :class="`field_content_level_${recursionLevel}`"
    />
  </div>

  <div v-else-if="field.field === 'coordinates'">
    <FieldsHeader
      v-if="field.label"
      :recursion-level="recursionLevel"
      :class="`field_header_level_${recursionLevel}`"
      >{{ fieldTranslateK(field.field) }}</FieldsHeader
    >
    <Coordinates :geom="geom" />
  </div>

  <div v-else-if="field.field === 'start_end_date'">
    <DateRange :start="properties.start_date" :end="properties.end_date" />
  </div>

  <div v-else-if="properties[field.field]">
    <FieldsHeader
      v-if="field.label"
      :recursion-level="recursionLevel"
      :class="`field_header_level_${recursionLevel}`"
      >{{ fieldTranslateK(field.field) }}</FieldsHeader
    >
    <span :class="`field_content_level_${recursionLevel}`">
      <div
        v-if="field.field == 'description'"
        v-html="properties.description"
      />

      <Phone
        v-for="phone in (properties.phone || []).concat(
          properties.mobile || []
        )"
        v-else-if="field.field === 'phone' || field.field === 'mobile'"
        :key="field.field + '_' + phone"
        :number="phone"
      />

      <template v-else-if="Array.isArray(properties[field.field])">
        <template v-for="item in properties[field.field]">
          <ExternalLink
            v-if="field.field == 'website'"
            :key="field.field + '_' + item"
            :href="item"
            target="_blank"
          >
            {{ item }}
          </ExternalLink>

          <a
            v-else-if="field.field == 'item'"
            :key="field.field + '_' + item"
            :href="`mailto:${item}`"
          >
            {{ item }}
          </a>

          <span v-else :key="item">
            {{ item }}
          </span>
        </template>
      </template>

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

import AddressField from '~/components/Fields/AddressField.vue'
import Coordinates from '~/components/Fields/Coordinates.vue'
import DateRange from '~/components/Fields/DateRange.vue'
import Facebook from '~/components/Fields/Facebook.vue'
import OpeningHours, {
  isOpeningHoursSupportedOsmTags,
} from '~/components/Fields/OpeningHours.vue'
import Phone from '~/components/Fields/Phone.vue'
import RoutesField from '~/components/Fields/RoutesField.vue'
import FieldsHeader from '~/components/PoisDetails/FieldsHeader.vue'
import ExternalLink from '~/components/UI/ExternalLink.vue'
import { ApiPoiProperties, FieldsListItem } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

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
    geom: {
      type: Object as PropType<GeoJSON.Geometry>,
      required: true,
    },
  },

  computed: {
    context(): PropertyTranslationsContextEnum {
      return PropertyTranslationsContextEnum.Details
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
.field_header_level_1 {
  display: inline;
}

.field_content_level_1 {
  display: inline;
  clear: right;
}
</style>
