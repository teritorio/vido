import type { Article } from '~/lib/apiArticle'
import type { ApiPoiDeps } from '~/lib/apiPoiDeps'
import type { ApiPoiCollectionResponse } from '~/types/api/poi'
import type { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import type { Settings } from '~/lib/apiSettings'
import type { ApiMenuResponse } from '~/types/api/menu'

export interface APIFixture {
  attribute_translations: { [key: string]: PropertyTranslations }
  settings: Settings
  articles: Article[]
  menu: ApiMenuResponse
  pois: ApiPoiCollectionResponse
  deps: { [key: number]: ApiPoiDeps }
}
