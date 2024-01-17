import Map from '~/components/Map/Map.vue'
import { bind, mapCss, parametersMap } from '~/lib/storybook-types'

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
  { style: mapCss },
)

export const FullScreen = bind(
  Map,
  {
    ...defaultProps,
    fullscreenControl: true,
  },
  { style: mapCss },
)
