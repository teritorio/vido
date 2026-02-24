import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import type { ApiPoiUnion } from '~/types/api/poi-deps'
import type { MenuCategory } from '~/types/local/menu'
import { bind } from '~/lib/storybook-types'
import { usePoiDeps } from '~/composables/usePoiDeps'

import '@teritorio/font-teritorio/teritorio/teritorio.css'

import poisDeps from '~/cypress/fixtures/teritorio/references/poi/2/deps.json'
import menu from '~/cypress/fixtures/teritorio/references/menu.json'

export default {
  title: 'PoisCard/PoisDeck',
  component: PoisDeck,
}

const { formatPoiDeps, isWaypoint } = usePoiDeps()
const points = (poisDeps.features as ApiPoiUnion[]).filter(
  feature => isWaypoint(feature),
)

const category = menu.find(item => item.id === 211) as MenuCategory

const defaultProps = {
  pois: points.map(feature =>
    formatPoiDeps(feature, category),
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
