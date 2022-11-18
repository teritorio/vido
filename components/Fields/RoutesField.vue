<template>
  <div>
    <slot />
    <div v-if="isCompact">
      <span v-for="(route, activity) in routes" :key="activity">
        {{ $propertyTranslations.pv('route', activity, context) }} :
        {{ formatNoDetails(activity, route) }}.
      </span>
      {{ length }}.
    </div>
    <div v-else>
      <div class="field">{{ $tc('fields.route.length') }} {{ length }}</div>
      <div v-for="(route, activity) in routes" :key="activity" class="field">
        <FieldsHeader
          :recursion-level="recursionLevel"
          :class="`field_header_level_${recursionLevel}`"
        >
          {{ $propertyTranslations.pv('route', activity, context) }}
        </FieldsHeader>
        <ul class="list-disc ml-6">
          <li>
            {{ $tc('fields.route.difficulty') }}
            {{ difficulty(activity, route) }}
          </li>
          <li>{{ $tc('fields.route.duration') }} {{ duration(route) }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import FieldsHeader from '~/components/UI/FieldsHeader.vue'
import { ApiPoiProperties } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

type Route = {
  duration?: number
  length?: number
  difficulty?: string
}

export default Vue.extend({
  components: {
    FieldsHeader,
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
    properties: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
  },

  computed: {
    isCompact(): boolean {
      return this.context === PropertyTranslationsContextEnum.Card
    },

    routes(): { [key: string]: Route } {
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

      const ret: { [key: string]: Route } = {}
      Object.entries(activitiesStruct).forEach(([acivity, properties]) => {
        ret[acivity] = properties
      })
      return ret
    },

    length(): string | undefined {
      const route = Object.values(this.routes)[0]
      return route.length
        ? `${route.length} ${this.$tc('units.km')}`
        : undefined
    },
  },

  methods: {
    duration(route: Route): string | undefined {
      if (route.duration) {
        const hours = Math.floor(route.duration / 60)
        const minutes = route.duration % 60

        let string = ''
        if (hours > 0) {
          string += `${hours} ${this.$tc('units.hours')}`
        }
        if (minutes > 0) {
          string += `${hours > 0 ? ' ' : ''}${minutes} ${this.$tc('units.min')}`
        }

        return string
      } else {
        return undefined
      }
    },

    difficulty(activity: string, route: Route): string | undefined {
      return route.difficulty
        ? this.$propertyTranslations.pv(
            `route:${activity}:difficulty`,
            route.difficulty,
            this.context
          )
        : undefined
    },

    formatNoDetails(activity: string, route: Route): string {
      return [this.duration(route), this.difficulty(activity, route)].join(', ')
    },
  },
})
</script>
