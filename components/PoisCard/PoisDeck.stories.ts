import PoisDeck from '~/components/PoisCard/PoisDeck.vue'
import type { ApiPoiDeps } from '~/types/api/poi-deps'
import type { ApiMenuCategory } from '~/types/api/menu'
import { bind } from '~/lib/storybook-types'
import { usePoiDeps } from '~/composables/usePoiDeps'

import '@teritorio/font-teritorio/teritorio/teritorio.css'

import poisDeps from '~/cypress/fixtures/teritorio/references/poi/2/deps.json'
import menu from '~/cypress/fixtures/teritorio/references/menu.json'

export default {
  title: 'PoisCard/PoisDeck',
  component: PoisDeck,
}

const points = poisDeps.features.filter(
  feature => feature.properties['route:point:type'],
)

const { formatPoiDeps } = usePoiDeps()
const category = menu.find(item => item.id === 211) as ApiMenuCategory

const defaultProps = {
  pois: points.map(feature =>
    formatPoiDeps(feature as ApiPoiDeps, category),
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
