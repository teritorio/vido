import { ContentEntry } from '~/lib/apiContent'
import { MenuItem } from '~/lib/apiMenu'
import { ApiPoiDeps } from '~/lib/apiPoiDeps'
import { ApiPois } from '~/lib/apiPois'
import { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import { Settings } from '~/lib/apiSettings'

export type APIFixture = {
  attribute_translations: { [key: string]: PropertyTranslations }
  settings: Settings
  articles: ContentEntry[]
  menu: MenuItem[]
  pois: ApiPois
  deps: { [key: number]: ApiPoiDeps }
}
