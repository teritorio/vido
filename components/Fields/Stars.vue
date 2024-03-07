<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { StarsEnum } from '~/utils/types'

const props = defineProps<{
  stars: StarsEnum
}>()

const isSNotation = computed((): boolean => {
  return props.stars.includes('S')
})

const numericProp = computed((): number => {
  let stars: string = props.stars

  if (isSNotation.value)
    stars = props.stars.slice(0, -1)

  return Number(stars)
})
</script>

<template>
  <div class="stars-data tw-text-amber-500 tw-mb-1">
    <FontAwesomeIcon
      v-for="(_item, index) in numericProp"
      :key="index"
      icon="star"
    />
    {{ isSNotation ? 'S' : '' }}
  </div>
</template>
