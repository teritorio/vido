import type { APIFixture } from '../../APIFixture'
import articles from './articles.json'
import fr from './attribute_translations/fr.json'

import deps1 from './poi/1/deps.json'
import deps2 from './poi/2/deps.json'

import pois from './pois.json'
import menu from './menu.json'
import settings from './settings.json'
import type { ApiPoiDeps } from '~/lib/apiPoiDeps'
import type { MenuItem } from '~/types/local/menu'
import type { ApiPois } from '~/lib/apiPois'
import type { Settings } from '~/lib/apiSettings'

const fixture: APIFixture = {
  attribute_translations: { fr },
  settings: settings as Settings,
  articles,
  menu: menu as MenuItem[],
  pois: pois as ApiPois,
  deps: {
    1: deps1 as ApiPoiDeps,
    2: deps2 as ApiPoiDeps,
  },
}

export default fixture
