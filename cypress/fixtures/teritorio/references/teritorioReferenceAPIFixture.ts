import type { APIFixture } from '../../APIFixture'
import articles from './articles.json'
import fr from './attribute_translations/fr.json'
import deps1 from './poi/1/deps.json'
import deps2 from './poi/2/deps.json'
import pois from './pois.json'
import menu from './menu.json'
import settings from './settings.json'
import type { ApiPoiDepsCollection } from '~/types/api/poi-deps'
import type { ApiPoiCollection } from '~/types/api/poi'
import type { Settings } from '~/lib/apiSettings'
import type { ApiMenuCollection } from '~/types/api/menu'

const fixture: APIFixture = {
  attribute_translations: { fr },
  settings: settings as Settings,
  articles,
  menu: menu as ApiMenuCollection,
  pois: pois as ApiPoiCollection,
  deps: {
    1: deps1 as ApiPoiDepsCollection,
    2: deps2 as ApiPoiDepsCollection,
  },
}

export default fixture
