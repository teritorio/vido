export function getImage(src: string, { modifiers, baseURL }: any) {
  const project = useState<string>('project')
  const params = new URLSearchParams({
    url: src,
    project: project.value,
  })

  Object.entries(modifiers).forEach(([key, value]) => {
    if (value != null)
      params.append(key, String(value))
  })

  return {
    url: `${baseURL || ''}/image-proxy?${params.toString()}`,
  }
}
