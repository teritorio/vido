import type { ApiFieldsListGroup, ApiFieldsListItem } from '~/types/api/field'

export interface FieldsListItem extends Omit<ApiFieldsListItem, 'field'> {
  field: string
}

export interface FieldsListGroup extends Omit<ApiFieldsListGroup, 'fields'> {
  fields: FieldsList
}

export type FieldsList = (FieldsListItem | FieldsListGroup)[]
