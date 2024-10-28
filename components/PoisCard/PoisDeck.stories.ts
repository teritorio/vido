import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import type { ApiRouteWaypoint } from '~/lib/apiPoiDeps'
import { apiRouteWaypointToApiPoi } from '~/lib/apiPoiDeps'
import { bind } from '~/lib/storybook-types'

import '@teritorio/font-teritorio/teritorio/teritorio.css'

import poisDeps from '~/cypress/fixtures/teritorio/references/poi/2/deps.json'

export default {
  title: 'PoisCard/PoisDeck',
  component: PoisDeck,
}

const points = poisDeps.features.filter(
  feature => feature.properties['route:point:type'],
)

const defaultProps = {
  pois: points.map(feature =>
    apiRouteWaypointToApiPoi(
      feature as unknown as ApiRouteWaypoint,
      '#123456',
      '#123456',
    ),
  ),
  selectedPoiIds: points.map(feature => feature.properties.id),
}

export const Default = bind(PoisDeck, {
  ...defaultProps,
})

export const Light = bind(PoisDeck, {
  ...defaultProps,
  poisCard: 'PoiCardLight',
})
