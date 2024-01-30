<script lang="ts" setup>
import PoiDetails from '~/components/PoisDetails/PoiDetails.vue'
import navMenuEntries from '~/cypress/fixtures/teritorio/references/articles.json'
import poisDeps from '~/cypress/fixtures/teritorio/references/poi/1/deps.json'
import settings from '~/cypress/fixtures/teritorio/references/settings'
import type { ApiPoi } from '~/lib/apiPois'

// ...parametersMap,

const defaultProps = {
  settings,
  navMenuEntries,
  poi: poisDeps.features[0] as ApiPoi,
}

const props = {
  Default: {
    ...defaultProps,
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
