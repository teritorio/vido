<template>
  <Story title="PoisList/PoisTable">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <PoisTable v-bind="p" />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import PoisTable from '~/components/PoisList/PoisTable.vue'
import poisDeps from '~/cypress/fixtures/teritorio/references/poi/1/deps.json'
import { ApiPois } from '~/lib/apiPois'

const defaultProps = {
  fields: poisDeps.features[0].properties.editorial.list_fields,
  pois: poisDeps as ApiPois,
}

const props = {
  Default: {
    ...defaultProps,
  },
}
</script>
