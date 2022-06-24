import { MultilingualString } from '~/utils/types'


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
  apiEndpoint: string,
  apiProject: string,
  apiTheme: string
): Promise<PropertyTranslations> {
  return fetch(`${apiEndpoint}/${apiProject}/${apiTheme}/attribute_translations/fr`)
    .then((data) => {
      if (data.ok) {
        return data.json() as unknown as PropertyTranslations
      } else {
        return Promise.reject(new Error([
          data.url,
          data.status,
          data.statusText,
        ].join(' ')))
      }
    })
}
