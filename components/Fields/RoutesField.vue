<template>
  <div>
    <RouteField
      v-for="(route, activity) in routes"
      :key="activity"
      :context="context"
      :activity="activity"
      :route="route"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import RouteField from '~/components/Fields/RouteField.vue'
import { ApiPoiProperties } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

export default Vue.extend({
  components: {
    RouteField,
  },

  props: {
    context: {
      type: String as PropType<PropertyTranslationsContextEnum>,
      required: true,
    },
    properties: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
  },

  computed: {
    routes(): { [key: string]: Object } {
      const activitiesStruct: { [key: string]: { [key: string]: string } } = {}
      Object.entries(this.properties || {})
        .map(([key, value]) => [key.split(':'), value])
        .filter(([keys, _value]) => keys[0] === 'route' && keys.length === 3)
        .forEach(([[_, activity, property], value]) => {
          if (activitiesStruct[activity]) {
            activitiesStruct[activity][property] = value
          } else {
            activitiesStruct[activity] = {}
            activitiesStruct[activity][property] = value
          }
        })

      const ret: { [key: string]: Object } = {}
      Object.entries(activitiesStruct).forEach(([acivity, properties]) => {
        ret[acivity] = properties
      })
      return ret
    },
  },
})
</script>
