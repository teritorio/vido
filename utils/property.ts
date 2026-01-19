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
    else if (item.field === property) {
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
  const pathStr = Array.isArray(path) ? path.join('.') : path
  const keys = pathStr.split(/[.:]/)
  const [firstKey, ...restKeys] = keys
  let value = obj?.[firstKey]

  if (multilingual)
    value = value?.['fr-FR']

  if (restKeys.length === 0)
    return value ?? null

  return restKeys.reduce((acc, key) => acc?.[key], value) ?? null
}
