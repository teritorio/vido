<template>
  <div>
    <template v-for="field in fields">
      <RoutesField
        v-if="field === 'route:*'"
        :key="field"
        :context="context"
        :properties="properties"
        class="text-sm mt-2"
      />

      <p v-if="field === 'addr:*'" :key="field" class="mt-6 text-sm">
        <AddressField :properties="properties" />
      </p>

      <p v-else-if="field == 'start_end_date'" :key="field" class="text-sm">
        <DateRange :start="properties.start_date" :end="properties.end_date" />
      </p>

      <div v-else-if="properties[field]" :key="field" class="text-sm mt-2">
        <ul v-if="(field === 'phone' || field === 'mobile') && $screen.phone">
          <li v-for="item in properties[field]" :key="item">
            <Phone :number="item" />
          </li>
        </ul>

        <ul v-else-if="Array.isArray(properties[field])">
          <li v-for="item in properties[field]" :key="item">
            <Website v-if="field === 'website'" :url="item" />
            <p v-else class="text-sm mt-1">
              {{ item }}
            </p>
          </li>
        </ul>

        <p v-else-if="isOpeningHoursSupportedOsmTags(field)" class="text-sm">
          <OpeningHours
            :tag-key="field"
            :opening-hours="properties[field]"
            :context="context"
          />
        </p>

        <p
          v-else-if="
            propTranslateV(field) && propTranslateV(field).length > textLimit
          "
          class="text-sm"
        >
          {{ propTranslateV(field).substring(0, textLimit) + ' ...' }}
          <a
            v-if="Boolean(details)"
            class="underline"
            :href="details"
            rel="noopener noreferrer"
            target="_blank"
            @click.stop="$emit('click-details')"
          >
            {{ $tc('poiCard.seeDetail') }}
          </a>
        </p>
        <p v-else class="text-sm">
          {{ propTranslateV(field) }}
        </p>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import AddressField from '~/components/Fields/AddressField.vue'
import DateRange from '~/components/Fields/DateRange.vue'
import OpeningHours, {
  isOpeningHoursSupportedOsmTags,
} from '~/components/Fields/OpeningHours.vue'
import Phone from '~/components/Fields/Phone.vue'
import RoutesField from '~/components/Fields/RoutesField.vue'
import Website from '~/components/Fields/Website.vue'
import { ApiPoiProperties } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

export default Vue.extend({
  components: {
    RoutesField,
    AddressField,
    Website,
    OpeningHours,
    DateRange,
    Phone,
  },

  props: {
    properties: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
    details: {
      type: String,
      default: null,
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
    context(): PropertyTranslationsContextEnum {
      return PropertyTranslationsContextEnum.Popup
    },

    fields(): string[] {
      return this.properties.editorial?.popup_properties || []
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
