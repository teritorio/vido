import MapBase from '~/components/Map/MapBase.vue'
import { bind, mapCss, parametersMap } from '~/lib/storybook-types'

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
  { style: mapCss },
)

export const OffMapAttrib = bind(
  MapBase,
  {
    ...defaultProps,
    offMapAttribution: true,
  },
  { style: mapCss },
)
