<script setup lang="ts">
/* eslint-disable vue/prop-name-casing */
import { flow } from 'lodash'
import type { ContribFields, Link } from '~/middleware/contrib-mode.global'
import ExternalLink from '~/components/UI/ExternalLink.vue'

const props = defineProps<{
  editor_id: ContribFields['editor_id']
  mapillary_link: ContribFields['mapillary_link']
  osm_note: ContribFields['osm_note']
}>()

const onlyDefinedProps = computed(() => {
  return flow([
    Object.entries,
    arr => arr.filter(([_key, value]: [key: string, value: Link ]) => !!value),
    Object.fromEntries,
  ])(props)
})
</script>

<template>
  <ExternalLink
    v-for="(field, key, index) in onlyDefinedProps"
    :key="key"
    :class="{ 'mt-2': index > 0 }"
    :icon="field.icon"
    :href="field.url"
  >
    {{ $t(`fields.contrib.${key}`) }}
  </ExternalLink>
</template>
