<template>
  <div :class="[recursionLevel === 0 && 'fields-list']">
    <template v-for="field in fields">
      <FieldsGroup
        v-if="field.group"
        :key="field.group"
        :recursion-level="recursionLevel + 1"
        :group="field"
        :title="fieldTranslateK(field.group)"
        :properties="properties"
        :color-fill="colorFill"
        class="group"
      />

      <RoutesField
        v-else-if="field.field == 'route'"
        :key="field.field"
        class="detail-left-block"
        :context="context"
        :properties="properties"
      />

      <div v-else-if="field.field == 'start_end_date'" :key="field.field">
        <DateRange :start="properties.start_date" :end="properties.end_date" />
      </div>

      <template v-else-if="properties[field.field]">
        <div
          v-if="field.field == 'description'"
          :key="field.field"
          class="detail-left-block"
        >
          <h2>{{ fieldTranslateK(field.field) }}</h2>
          <div v-html="properties.description"></div>
        </div>

        <div
          v-for="phone in (properties.phone || []).concat(
            properties.mobile || []
          )"
          v-else-if="field.field === 'phone' || field.field === 'mobile'"
          :key="field.field + '_' + phone"
        >
          <Phone :number="phone" />
        </div>

        <div
          v-for="email in properties.email || []"
          v-else-if="field.field == 'email'"
          :key="field.field + '_' + email"
        >
          <a :href="`mailto:${email}`">
            {{ email }}
          </a>
        </div>

        <div
          v-for="website in properties.website || []"
          v-else-if="field.field == 'website'"
          :key="field.field + '_' + website"
        >
          <a :href="properties.website" target="_blank">
            {{ website }}
          </a>
        </div>

        <div
          v-else-if="
            field.field == 'route:gpx_trace' || field.field == 'route:pdf'
          "
          :key="field.field"
        >
          <a :href="properties['route:gpx_trace']">
            <font-awesome-icon prefix="fa" icon="arrow-circle-down" />
            {{ fieldTranslateK(field.field) }}
          </a>
        </div>

        <div
          v-else-if="isOpeningHoursSupportedOsmTags(field.field)"
          :key="field.field"
          class="detail-left-block"
        >
          <h2>{{ fieldTranslateK(field.field) }}</h2>
          <OpeningHours
            :tag-key="field.field"
            :opening-hours="p[field.field]"
            :context="context"
          />
        </div>

        <div v-else :key="field.field">
          <h2>{{ fieldTranslateK(field.field) }}</h2>
          {{ propTranslateV(field.field) }}
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import DateRange from '~/components/Fields/DateRange.vue'
import OpeningHours, {
  isOpeningHoursSupportedOsmTags,
} from '~/components/Fields/OpeningHours.vue'
import Phone from '~/components/Fields/Phone.vue'
import RoutesField from '~/components/Fields/RoutesField.vue'
import FieldsGroup from '~/components/PoisDetails/FieldsGroup.vue'
import { ApiPoiProperties, FieldsList } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

export default Vue.extend({
  components: {
    FieldsGroup,
    OpeningHours,
    RoutesField,
    DateRange,
    Phone,
  },

  props: {
    recursionLevel: {
      type: Number,
      default: 0,
    },
    fields: {
      type: Array as PropType<FieldsList>,
      required: true,
    },
    properties: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
    colorFill: {
      type: String,
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
.fields-list > * {
  margin-block: 3.3rem;
}

.fields-list > *:not(.group) {
  margin-right: 1.6rem;
  margin-left: 1.6rem;
}
</style>
