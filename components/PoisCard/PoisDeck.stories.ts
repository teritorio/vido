import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import { ApiRouteWaypoint, apiRouteWaypointToApiPoi } from '~/lib/apiPoiDeps'
import { ApiPois } from '~/lib/apiPois'
import { bind } from '~/lib/storybook-types'

import '@teritorio/font-teritorio/teritorio/teritorio.css'

const poisDeps: ApiPois = require('json-loader!~/cypress/fixtures/teritorio/references/poi/2/deps.geojson')

export default {
  title: 'PoisCard/PoisDeck',
  component: PoisDeck,
}

const points = poisDeps['features'].filter(
  (feature) => feature.properties['route:point:type']
)

const defaultProps = {
  pois: points.map((feature) =>
    apiRouteWaypointToApiPoi(
      feature as unknown as ApiRouteWaypoint,
      '#123456',
      '#123456'
    )
  ),
  selectedPoiIds: points.map((feature) => feature.properties.id),
  explorerModeEnabled: true,
  favoritesModeEnabled: true,
}

export const Default = bind(PoisDeck, {
  ...defaultProps,
})

export const Light = bind(PoisDeck, {
  ...defaultProps,
  poisCard: 'PoiCardLight',
})
