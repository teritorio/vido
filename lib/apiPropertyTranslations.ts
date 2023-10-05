import { MultilingualString } from '~/utils/types'
import { VidoConfig } from '~/utils/types-config'

export interface PropertyValueTranslation {
  label: MultilingualString
  label_popup: MultilingualString
  label_details: MultilingualString
  label_list: MultilingualString
}

export interface PropertyValueTranslations {
  [key: string]: PropertyValueTranslation
}

export interface PropertyTranslation {
  label: MultilingualString
  label_popup: MultilingualString
  label_details: MultilingualString
  label_list: MultilingualString
  values: PropertyValueTranslations
}

export interface PropertyTranslations {
  [key: string]: PropertyTranslation
}

export function getPropertyTranslations(
  vidoConfig: VidoConfig
): Promise<PropertyTranslations> {
  return fetch(
    `${vidoConfig.API_ENDPOINT}/${vidoConfig.API_PROJECT}/${vidoConfig.API_THEME}/attribute_translations/fr.json`
  ).then((data) => {
    if (data.ok) {
      return data.json() as unknown as PropertyTranslations
    } else {
      return Promise.reject(
        new Error([data.url, data.status, data.statusText].join(' '))
      )
    }
  })
}
