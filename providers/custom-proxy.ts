export function getImage(src: string, { baseURL }: any) {
  const params = new URLSearchParams({ url: src }).toString()
  return { url: `${baseURL || ''}/api/image-proxy?${params}` }
}
