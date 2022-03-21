import { ApiPoi } from '@/lib/apiPois'

export const flattenFeatures = (features: { [categoryId: number]: ApiPoi[] }) =>
  Object.values(features)
    .flat()
    .filter((f: ApiPoi) => f.properties.vido_visible)

export const getPreviousMonday = () => {
  const date = new Date()

  if (date.getDay() !== 0) {
    return new Date().setDate(date.getDate() - 7 - 6)
  }

  return new Date().setDate(date.getDate() - date.getDate() - 6)
}
