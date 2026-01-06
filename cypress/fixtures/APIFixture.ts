import type { Article } from '~/lib/apiArticle'
import type { ApiPoiDepsCollection } from '~/types/api/poi-deps'
import type { ApiPoiCollection } from '~/types/api/poi'
import type { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import type { Settings } from '~/lib/apiSettings'
import type { ApiMenuResponse } from '~/types/api/menu'

export interface APIFixture {
  attribute_translations: { [key: string]: PropertyTranslations }
  settings: Settings
  articles: Article[]
  menu: ApiMenuResponse
  pois: ApiPoiCollection
  deps: { [key: number]: ApiPoiDepsCollection }
}
