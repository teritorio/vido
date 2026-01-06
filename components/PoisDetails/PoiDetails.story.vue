<script lang="ts" setup>
import PoiDetails from '~/components/PoisDetails/PoiDetails.vue'
import poisDeps from '~/cypress/fixtures/teritorio/references/poi/1/deps.json'
import settings from '~/cypress/fixtures/teritorio/references/settings.json'
import type { Poi } from '~/types/local/poi'
import type { Settings } from '~/lib/apiSettings'

const defaultProps = {
  settings: settings as Settings,
  poi: poisDeps.features[0] as Poi,
}

const { featureSeoTitle } = useFeature(toRef(defaultProps.poi), { type: 'details' })

const props = {
  Default: {
    ...defaultProps,
    pageTitle: featureSeoTitle.value || '',
  },
}
</script>

<template>
  <Story title="PoisDetails/PoiDetails">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <PoiDetails v-bind="p" />
    </Variant>
  </Story>
</template>
