<template>
  <Story title="Map/MapControlsBackground">
    <Variant
      v-for="(p, name) in props"
      :key="name"
      :title="name.replace(/([A-Z])/g, ' $1').trim()"
    >
      <div id="map">
        <MapControlsBackground v-bind="p" />
      </div>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import MapControlsBackground from '~/components/Map/MapControlsBackground.vue'
import { MapStyleEnum } from '~/utils/types'

const defaultProps = {
  backgrounds: [MapStyleEnum.vector, MapStyleEnum.aerial, MapStyleEnum.bicycle],
  initialBackground: MapStyleEnum.vector,
}

const props = {
  Default: {
    ...defaultProps,
  },

  Selected: {
    ...defaultProps,
    initialBackground: MapStyleEnum.aerial,
  },
  Hidden: {
    ...defaultProps,
    hidden: true,
  },
}
</script>
