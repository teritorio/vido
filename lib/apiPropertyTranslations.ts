import type { MultilingualString } from '~/utils/types'

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
