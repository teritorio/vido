import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import type { ApiPoiDeps } from '~/types/api/poi-deps'
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
      feature as ApiPoiDeps,
      '#123456',
      '#123456',
      '#FFFFFF',
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
