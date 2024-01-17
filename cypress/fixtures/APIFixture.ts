import type { ContentEntry } from '~/lib/apiContent'
import type { MenuItem } from '~/lib/apiMenu'
import type { ApiPoiDeps } from '~/lib/apiPoiDeps'
import type { ApiPois } from '~/lib/apiPois'
import type { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import type { Settings } from '~/lib/apiSettings'

export interface APIFixture {
  attribute_translations: { [key: string]: PropertyTranslations }
  settings: Settings
  articles: ContentEntry[]
  menu: MenuItem[]
  pois: ApiPois
  deps: { [key: number]: ApiPoiDeps }
}
