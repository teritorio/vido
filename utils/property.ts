import type { FieldsList, FieldsListItem } from '~/types/local/field'
import type { MenuCategoryEditorial } from '~/types/local/menu'

export function findFieldInList(fields: FieldsList | undefined, property: string): FieldsListItem | undefined {
  if (!fields)
    return undefined

  for (const item of fields) {
    if ('group' in item) {
      const found = findFieldInList(item.fields, property)
      if (found)
        return found
    }
    else if (item.field.join('.') === property) {
      return item
    }
  }
  return undefined
}

export function isFieldMultilingual(editorial: MenuCategoryEditorial, property: string | string[]): boolean {
  const path = Array.isArray(property) ? property[0] : property
  const field = findFieldInList(editorial.popup_fields, path)
    ?? findFieldInList(editorial.details_fields, path)
    ?? findFieldInList(editorial.list_fields, path)
  return field?.multilingual ?? false
}

export function getNestedPropertyValue(obj: Record<string, any>, path: string | string[], multilingual = false): any {
  const keys = Array.isArray(path) ? path : path.split('.')
  let value: any = obj

  for (const key of keys) {
    if (value == null || typeof value !== 'object')
      return null

    // Auto-unwrap multilingual intermediate objects (e.g. route: { "fr-FR": { gpx_trace: "..." } })
    if (!(key in value) && 'fr-FR' in value)
      value = value['fr-FR']

    value = value?.[key]
  }

  if (multilingual && value && typeof value === 'object' && 'fr-FR' in value)
    value = value['fr-FR']

  return value ?? null
}
