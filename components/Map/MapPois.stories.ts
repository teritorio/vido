import MapPois from '~/components/Map/MapPois.vue'
import { bind, mapCss, parametersMap } from '~/lib/storybook-types'

import pois from '~/cypress/fixtures/teritorio/references/poi/2/deps.json'

export default {
  title: 'Map/MapPois',
  component: MapPois,
  parameters: {
    ...parametersMap,
  },
}

const defaultProps = {
  features: pois.features,
}

export const Default = bind(
  MapPois,
  {
    ...defaultProps,
  },
  { style: mapCss },
)
