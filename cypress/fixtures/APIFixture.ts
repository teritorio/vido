import { ContentEntry } from '~/lib/apiContent'
import { Category } from '~/lib/apiMenu'
import { ApiPois } from '~/lib/apiPois'
import { PropertyTranslations } from '~/lib/apiPropertyTranslations'
import { Settings } from '~/lib/apiSettings'

export type APIFixture = {
  attribute_translations: { [key: string]: PropertyTranslations }
  settings: Settings
  articles: ContentEntry[]
  menu: Category[]
  pois: ApiPois
}
