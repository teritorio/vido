import type { APIFixture } from '../../APIFixture'
import articles from './articles.json'
import fr from './attribute_translations/fr.json'
import deps1 from './poi/1/deps.json'
import deps2 from './poi/2/deps.json'
import pois from './pois.json'
import menu from './menu.json'
import settings from './settings.json'
import type { ApiPoiDepsResponse } from '~/types/api/poi-deps'
import type { ApiPoiCollectionResponse } from '~/types/api/poi'
import type { Settings } from '~/lib/apiSettings'
import type { ApiMenuResponse } from '~/types/api/menu'

const fixture: APIFixture = {
  attribute_translations: { fr },
  settings: settings as Settings,
  articles,
  menu: menu as ApiMenuResponse,
  pois: pois as ApiPoiCollectionResponse,
  deps: {
    1: deps1 as ApiPoiDepsResponse,
    2: deps2 as ApiPoiDepsResponse,
  },
}

export default fixture
