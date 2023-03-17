import PoisTable from '~/components/PoisList/PoisTable.vue'
import poisDeps from '~/cypress/fixtures/teritorio/references/poi/1/deps.json'
import { bind, parametersMap } from '~/lib/storybook-types'

export default {
  title: 'PoisTable/PoisTable',
  component: PoisTable,
  parameters: {
    ...parametersMap,
  },
}

const defaultProps = {
  fields: poisDeps.features[0].properties.editorial.list_fields,
  pois: poisDeps,
}

export const Default = bind(PoisTable, {
  ...defaultProps,
})
