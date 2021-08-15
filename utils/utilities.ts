import { VidoFeature } from '@/utils/types'

export const flattenFeatures = (features: [VidoFeature]) =>
  Object.values(features)
    .flat()
    .filter((f: VidoFeature) => f.properties.vido_visible)
