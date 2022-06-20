<template>
  <span v-if="activity && detail"> {{ activity }} : {{ detail }} </span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
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
    detail(): string | null {
      const result = []
      if (this.route.length) {
        result.push(`${this.route.length} ${this.$tc('toast.routePopup.km')}`)
      }
      if (this.route.duration) {
        const hours = Math.floor(this.route.duration / 60)
        const minutes = this.route.duration % 60

        let string = ''

        if (hours > 0) {
          string += `${hours} ${this.$tc('toast.routePopup.hours')}`
        }
        if (minutes > 0) {
          string += `${hours > 0 ? ' ' : ''}${minutes} ${this.$tc(
            'toast.routePopup.min'
          )}`
        }

        result.push(string)
      }
      if (this.route.difficulty && this.route.difficulty !== 'normal') {
        result.push(this.$tc(`toast.routePopup.${this.route.difficulty}`))
      }

      return result.length > 0 ? result.join(', ') : null
    },
  },
})
</script>
