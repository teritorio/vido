import PoisTable from '~/components/PoisList/PoisTable.vue'
import poisDeps from '~/cypress/fixtures/teritorio/references/poi/1/deps.json'
import { bind } from '~/lib/storybook-types'
import menu from '~/cypress/fixtures/teritorio/references/menu.json'
import type { MenuCategory } from '~/types/local/menu'
import type { ApiPoiUnion } from '~/types/api/poi-deps'

export default {
  title: 'PoisList/PoisTable',
  component: PoisTable,
}

const { formatPoiDeps } = usePoiDeps()
const category = menu.find(item => item.id === 211) as MenuCategory
const poi = formatPoiDeps(poisDeps.features[0] as ApiPoiUnion, category)

const defaultProps = {
  fields: poi.properties.editorial.list_fields,
  pois: poisDeps,
}

export const Default = bind(PoisTable, {
  ...defaultProps,
})
