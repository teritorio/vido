<template>
  <div>
    <template v-for="field in fields">
      <Contact
        v-if="field == 'first_contact'"
        :key="field"
        :p="properties"
        :color-fill="colorFill"
      />

      <Download
        v-else-if="field == 'first_download'"
        :key="field"
        :p="properties"
        :color-fill="colorFill"
      />

      <RoutesField
        v-else-if="field == 'route:*'"
        :key="field"
        class="detail-left-block"
        :context="context"
        :properties="properties"
      />

      <div v-else-if="field == 'start_end_date'" :key="field">
        <DateRange :start="properties.start_date" :end="properties.end_date" />
      </div>

      <template v-else-if="properties[field]">
        <div
          v-if="field == 'description'"
          :key="field"
          class="detail-left-block"
        >
          <h2>{{ fieldTranslateK(field) }}</h2>
          <div v-html="properties.description"></div>
        </div>

        <div
          v-else-if="isOpeningHoursSupportedOsmTags(field)"
          :key="field"
          class="detail-left-block"
        >
          <h2>{{ fieldTranslateK(field) }}</h2>
          <OpeningHours
            :tag-key="field"
            :opening-hours="p[field]"
            :context="context"
          />
        </div>

        <div v-else :key="field">
          <h2>{{ fieldTranslateK(field) }}</h2>
          {{ propTranslateV(field) }}
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
import RoutesField from '~/components/Fields/RoutesField.vue'
import Contact from '~/components/PoisDetails/Contact.vue'
import Download from '~/components/PoisDetails/Download.vue'
import { ApiPoiProperties } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

export default Vue.extend({
  components: {
    Contact,
    OpeningHours,
    Download,
    RoutesField,
    DateRange,
  },

  props: {
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

    fields(): string[] {
      let firstContact = false
      let firstDownload = false
      return (this.properties.editorial?.details_properties || [])
        .map((p) => {
          if (['addr:*', 'phone', 'mobile'].includes(p)) {
            if (!firstContact) {
              firstContact = true
              return 'first_contact'
            } else {
              return undefined
            }
          } else if (['route:gpx_trace', 'route:pdf'].includes(p)) {
            if (!firstDownload) {
              firstDownload = true
              return 'first_download'
            } else {
              return undefined
            }
          } else {
            return p
          }
        })
        .filter((e) => e !== undefined) as string[]
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
