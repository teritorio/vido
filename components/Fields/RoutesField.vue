<script lang="ts">
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import FieldsHeader from '~/components/UI/FieldsHeader.vue'
import type { ApiPoiProperties } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

interface Route {
  duration?: number
  length?: number
  difficulty?: string
}

export function isRoutesFieldEmpty(properties: {
  [key: string]: string
}): boolean {
  return (
    Object.entries(properties || {})
      .map(([key, value]) => [key.split(':'), value])
      .filter(([keys, _value]) => keys[0] === 'route' && keys.length === 3)
      .length > 0
  )
}

export default defineNuxtComponent({
  components: {
    FieldsHeader,
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
    properties: {
      type: Object as PropType<ApiPoiProperties>,
      required: true,
    },
  },

  computed: {
    propertyTranslations() {
      return this.$propertyTranslations
    },

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
          }
          else {
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
      return route?.length
        ? `${route.length} ${this.$t('units.km')}`
        : undefined
    },
  },

  methods: {
    duration(route: Route): string | undefined {
      if (route.duration) {
        const hours = Math.floor(route.duration / 60)
        const minutes = route.duration % 60

        let string = ''
        if (hours > 0)
          string += `${hours} ${this.$t('units.hours')}`

        if (minutes > 0)
          string += `${hours > 0 ? ' ' : ''}${minutes} ${this.$t('units.min')}`

        return string
      }
      else {
        return undefined
      }
    },

    difficulty(activity: string, route: Route): string | undefined {
      return route.difficulty
        ? this.$propertyTranslations.pv(
            `route:${activity}:difficulty`,
            route.difficulty,
            this.context,
        )
        : undefined
    },

    formatNoDetails(activity: string, route: Route): string {
      return [this.duration(route), this.difficulty(activity, route)]
        .filter(x => x)
        .join(', ')
    },
  },
})
</script>

<template>
  <div>
    <slot />
    <div v-if="isCompact">
      <p v-for="(route, activity) in routes" :key="activity">
        {{ propertyTranslations.pv('route', `${activity}`, context) }} :
        {{ formatNoDetails(activity as string, route) }}.
      </p>
      <p v-if="length">
        {{ length }}
      </p>
    </div>
    <div v-else>
      <div v-if="length" class="field">
        {{ $t('fields.route.length') }} {{ length }}
      </div>
      <div v-for="(route, activity) in routes" :key="activity" class="field">
        <FieldsHeader
          :recursion-stack="[...recursionStack, `${activity}`]"
          :class="`field_header_level_${[...recursionStack, activity].length}`"
        >
          {{ propertyTranslations.pv('route', `${activity}`, context) }}
        </FieldsHeader>
        <ul class="tw-list-disc tw-ml-6">
          <li v-if="difficulty(activity as string, route)">
            {{ $t('fields.route.difficulty') }}
            {{ difficulty(activity as string, route) }}
          </li>
          <li v-if="duration(route)">
            {{ $t('fields.route.duration') }} {{ duration(route) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
