import MapPois from '~/components/Map/MapPois.vue'
import { MapPoiCollection } from '~/lib/mapPois'
import { bind } from '~/lib/storybook-types'

const pois: MapPoiCollection = require('json-loader!~/cypress/fixtures/teritorio/references/poi/2/deps.geojson')

export default {
  title: 'Map/MapPois',
  component: MapPois,
}

const defaultProps = {
  features: pois.features,
}

export const Default = bind(MapPois, {
  ...defaultProps,
})
