import type { Article } from '~/lib/apiArticle'
import type { MenuItem } from '~/types/local/menu'
import type { ApiPoiDeps } from '~/lib/apiPoiDeps'
import type { ApiPois } from '~/lib/apiPois'
import type { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import type { Settings } from '~/lib/apiSettings'

export interface APIFixture {
  attribute_translations: { [key: string]: PropertyTranslations }
  settings: Settings
  articles: Article[]
  menu: MenuItem[]
  pois: ApiPois
  deps: { [key: number]: ApiPoiDeps }
}
