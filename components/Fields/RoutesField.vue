<script lang="ts">
import type { PropType } from 'vue'

import { defineNuxtComponent } from '#app'
import FieldsHeader from '~/components/UI/FieldsHeader.vue'
import type { ApiPoiProperties } from '~/lib/apiPois'
import { PropertyTranslationsContextEnum, siteStore as useSiteStore } from '~/stores/site'

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

  setup() {
    const {
      getRouteDifficulty,
      getRouteDuration,
      getRouteLength,
      getRouteNoDetails,
      getRoutes,
    } = useField()
    const { pv } = useSiteStore()

    return {
      getRouteDifficulty,
      getRouteDuration,
      getRouteLength,
      getRouteNoDetails,
      getRoutes,
      pv,
    }
  },

  computed: {
    isCompact() {
      return this.context === PropertyTranslationsContextEnum.Card
    },

    routes() {
      return this.getRoutes(this.properties)
    },
  },
})
</script>

<template>
  <div>
    <slot />
    <div v-if="isCompact">
      <p v-for="(route, activity) in routes" :key="activity">
        {{ pv('route', `${activity}`, context) }} :
        {{ getRouteNoDetails(activity.toString(), route, context) }}.
        <br>
        <span v-if="route.length">
          {{ getRouteLength(route.length) }}
        </span>
      </p>
    </div>
    <div v-else>
      <div v-for="(route, activity, index) in routes" :key="activity" class="field">
        <div v-if="route.length && index === 0" class="field">
          {{ $t('fields.route.length', { length: getRouteLength(route.length) }) }}
        </div>
        <FieldsHeader
          :recursion-stack="[...recursionStack, `${activity}`]"
          :class="`field_header_level_${[...recursionStack, activity].length}`"
        >
          {{ pv('route', `${activity}`, context) }}
        </FieldsHeader>
        <ul class="tw-list-disc tw-ml-6">
          <li v-if="route.difficulty">
            {{ $t('fields.route.difficulty', { difficulty: getRouteDifficulty(activity.toString(), route.difficulty, context) }) }}
          </li>
          <li v-if="route.duration">
            {{ $t('fields.route.duration', { duration: getRouteDuration(route.duration) }) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
