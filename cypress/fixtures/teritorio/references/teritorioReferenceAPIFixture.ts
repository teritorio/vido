import { APIFixture } from '../../APIFixture'
import articles from './articles.json'
import fr from './attribute_translations/fr.json'
import menu from './menu.json'
import deps1 from './poi/1/deps.json'
import deps2 from './poi/2/deps.json'
import pois from './pois.json'
import settings from './settings.json'

import { ApiPoiDeps } from '~/lib/apiPoiDeps'

const fixture: APIFixture = {
  attribute_translations: { fr },
  // @ts-ignore
  settings,
  articles,
  // @ts-ignore
  menu,
  // @ts-ignore
  pois,
  deps: {
    1: deps1 as ApiPoiDeps,
    2: deps2 as ApiPoiDeps,
  },
}

export default fixture
