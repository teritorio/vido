import Map from '~/components/Map/Map.vue'
import { bind, parametersMap, mapCss } from '~/lib/storybook-types'

export default {
  title: 'Map/Map',
  component: Map,
  parameters: {
    ...parametersMap,
  },
}

const defaultProps = {}

export const Default = bind(
  Map,
  {
    ...defaultProps,
  },
  undefined,
  mapCss
)

export const FullScreen = bind(
  Map,
  {
    ...defaultProps,
    fullscreenControl: true,
  },
  undefined,
  mapCss
)
