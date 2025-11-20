import { storeToRefs } from 'pinia'
import { useSiteStore } from '~/stores/site'

export function getImage(src: string, { modifiers, baseURL }: any) {
  const project = useState<string>('project')
  const { imageDomains } = storeToRefs(useSiteStore())

  const params = new URLSearchParams({
    url: src,
    project: project.value,
  })

  const domain = new URL(src).host

  if (!imageDomains.value.includes(domain)) {
    return {
      url: src,
    }
  }

  Object.entries(modifiers).forEach(([key, value]) => {
    if (value != null)
      params.append(key, String(value))
  })

  return {
    url: `${baseURL || ''}/image-proxy?${params.toString()}`,
  }
}
