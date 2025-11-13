export function getImage(src: string, { baseURL }: any) {
  const project = useState<string>('project')
  const params = new URLSearchParams({ url: src, project: project.value }).toString()
  return { url: `${baseURL || ''}/api/image-proxy?${params}` }
}
