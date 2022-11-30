import MapBase from '~/components/Map/MapBase.vue'
import { bind, parametersMap, mapCss } from '~/lib/storybook-types'

export default {
  title: 'Map/MapBase',
  component: MapBase,
  parameters: {
    ...parametersMap,
  },
}

const defaultProps = {
  features: [],
}

export const Default = bind(
  MapBase,
  {
    ...defaultProps,
  },
  undefined,
  mapCss
)

export const OffMapAttrib = bind(
  MapBase,
  {
    ...defaultProps,
    offMapAttribution: true,
  },
  undefined,
  mapCss
)
