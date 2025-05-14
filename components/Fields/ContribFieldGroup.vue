<script setup lang="ts">
/* eslint-disable vue/prop-name-casing */
import { pickBy } from 'lodash'
import type { ContribFields, Link } from '~/composables/useContrib'
import ExternalLink from '~/components/UI/ExternalLink.vue'

const props = defineProps<{
  editor_id: ContribFields['editor_id']
  json: ContribFields['json']
  josm: ContribFields['josm']
  mapillary_link?: ContribFields['mapillary_link']
  osm_note: ContribFields['osm_note']
}>()

const { t } = useI18n()

const onlyDefinedProps = computed(() => {
  return pickBy(props, p => !!p)
}) as ComputedRef<Record<string, Link>>
</script>

<template>
  <div>
    <ExternalLink
      v-for="(field, key, index) in onlyDefinedProps"
      :key="key"
      :class="{ 'mt-2': index > 0 }"
      :icon="field.icon"
      :href="field.url"
      :target="field.target"
    >
      {{ t(`fields.contrib.${key}`) }}
      <iframe v-if="key === 'josm'" id="hidden-iframe" name="hiddenIframe" />
    </ExternalLink>
  </div>
</template>

<style scoped>
div  {
  margin: 1rem 0;
}

@media print {
  div {
   display: none;
  }
}

iframe#hidden-iframe {
  display: none;
  position: absolute;
}
</style>
