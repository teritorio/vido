import { APIFixture } from '../../APIFixture'
import articles from './articles.json'
import fr from './attribute_translations/fr.json'
import menu from './menu.json'
import pois from './pois.json'
import settings from './settings.json'

const fixture: APIFixture = {
  attribute_translations: { fr },
  // @ts-ignore
  settings,
  articles,
  // @ts-ignore
  menu,
  // @ts-ignore
  pois,
}

export default fixture
