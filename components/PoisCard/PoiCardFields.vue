<template>
  <div>
    <template v-for="property in popup_properties">
      <RoutesField
        v-if="property === 'route:*'"
        :key="'_' + property"
        :context="context"
        :properties="properties"
        class="text-sm mt-2"
      />

      <p
        v-if="property === 'addr:*'"
        :key="'_' + property"
        class="mt-6 text-sm"
      >
        <AddressField :properties="properties" />
      </p>

      <p
        v-else-if="property == 'start_end_date'"
        :key="'_' + property"
        class="text-sm"
      >
        <DateRange :start="properties.start_date" :end="properties.end_date" />
      </p>

      <div
        v-else-if="properties[property]"
        :key="'_' + property"
        class="text-sm mt-2"
      >
        <ul
          v-if="
            (property === 'phone' || property === 'mobile') && $screen.phone
          "
        >
          <li v-for="item in properties[property]" :key="item">
            <Phone :number="item" />
          </li>
        </ul>

        <ul v-else-if="Array.isArray(properties[property])">
          <li v-for="item in properties[property]" :key="item">
            <Website v-if="property === 'website'" :url="item" />
            <p v-else class="text-sm mt-1">
              {{ item }}
            </p>
          </li>
        </ul>

        <p v-else-if="isOpeningHoursSupportedOsmTags(property)" class="text-sm">
          <OpeningHours
            :tag-key="property"
            :opening-hours="properties[property]"
            :context="context"
          />
        </p>

        <p
          v-else-if="
            poiPropTranslate(property) &&
            poiPropTranslate(property).length > textLimit
          "
          class="text-sm"
        >
          {{ poiPropTranslate(property).substring(0, textLimit) + ' ...' }}
          <a
            v-if="Boolean(details)"
            class="underline"
            :href="details"
            rel="noopener noreferrer"
            target="_blank"
            @click.stop="$emit('click-details')"
          >
            {{ $tc('toast.seeDetail') }}
          </a>
        </p>
        <p v-else class="text-sm">
          {{ poiPropTranslate(property) }}
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

    popup_properties(): string[] {
      return this.properties.editorial?.popup_properties || []
    },
  },

  methods: {
    poiPropTranslate(property: string) {
      return this.$propertyTranslations.pv(
        property,
        this.properties[property],
        PropertyTranslationsContextEnum.Popup
      )
    },

    isOpeningHoursSupportedOsmTags(key: string) {
      return isOpeningHoursSupportedOsmTags(key)
    },
  },
})
</script>
