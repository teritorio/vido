<template>
  <p v-if="isCompact">
    {{ $propertyTranslations.pv('route', activity, context) }} :
    {{ formatNoDetails }}
  </p>
  <div v-else>
    <h2>{{ $propertyTranslations.pv('route', activity, context) }}</h2>
    <ul>
      <li>{{ $tc('fields.route.difficulty') }} {{ difficulty }}</li>
      <li>{{ $tc('fields.route.lenght') }} {{ lenght }}</li>
      <li>{{ $tc('fields.route.duration') }} {{ duration }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

export default Vue.extend({
  props: {
    context: {
      type: String as PropType<PropertyTranslationsContextEnum>,
      required: true,
    },
    activity: {
      type: String,
      default: null,
    },
    route: {
      type: Object,
      default: null,
    },
  },

  computed: {
    isCompact(): boolean {
      return this.context === PropertyTranslationsContextEnum.Card
    },

    lenght(): string | undefined {
      return this.route.length
        ? `${this.route.length} ${this.$tc('units.km')}`
        : undefined
    },

    duration(): string | undefined {
      if (this.route.duration) {
        const hours = Math.floor(this.route.duration / 60)
        const minutes = this.route.duration % 60

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

    difficulty(): string | undefined {
      return this.route.difficulty
        ? this.$propertyTranslations.pv(
            `route:${this.activity}:difficulty`,
            this.route.difficulty,
            this.context
          )
        : undefined
    },

    formatNoDetails(): string {
      return [this.lenght, this.duration, this.difficulty]
        .map((e) => e)
        .join(', ')
    },
  },
})
</script>
