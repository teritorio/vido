import type { FieldsList, FieldsListItem } from '~/types/local/field'
import type { MenuCategoryEditorial } from '~/types/local/menu'
import type { PoiUnion } from '~/types/local/poi-deps'

export function findFieldInList(fields: FieldsList | undefined, property: string): FieldsListItem | undefined {
  if (!fields)
    return undefined

  for (const item of fields) {
    if ('group' in item) {
      const found = findFieldInList(item.fields, property)
      if (found)
        return found
    }
    else if (item.field.length === 1 && item.field[0] === property) {
      return item
    }
  }
  return undefined
}

export function isFieldMultilingual(editorial: MenuCategoryEditorial, property: string[]): boolean {
  const path = property[0]
  const field = findFieldInList(editorial.popup_fields, path)
    ?? findFieldInList(editorial.details_fields, path)
    ?? findFieldInList(editorial.list_fields, path)
  return field?.multilingual ?? false
}

export function getNestedPropertyValue(obj: PoiUnion['properties'], path: string[], multilingual = false): any {
  // Resolve first key and unwrap multilingual wrapper if present
  let value: any = obj[path[0]]
  if (multilingual && value != null && typeof value === 'object' && 'fr-FR' in value)
    value = value['fr-FR']

  for (let i = 1; i < path.length; i++) {
    if (value == null || typeof value !== 'object')
      return null

    value = value[path[i]]
  }

  return value ?? null
}
