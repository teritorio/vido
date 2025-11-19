import { Buffer } from 'node:buffer'
import sharp from 'sharp'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string
  const project = query.project as string
  const width = query.width ? Number.parseInt(query.width as string) : undefined
  const format = (query.format as keyof sharp.FormatEnum) || 'jpeg'

  if (!url)
    throw createError({ statusCode: 400, message: 'Missing URL' })

  const domain = new URL(url).hostname
  // @ts-expect-error: can't declare the interface
  const allowedDomains: string[] = globalThis.allowedDomains[project] || []

  if (!allowedDomains.includes(domain)) {
    event.node.res.statusCode = 403
    return { error: 'Domain not allowed' }
  }

  const response = await fetch(url)

  if (!response.ok) {
    event.node.res.statusCode = response.status
    return { error: `Failed to fetch image from ${domain}` }
  }

  const arrayBuffer = await response.arrayBuffer()
  let image = sharp(Buffer.from(arrayBuffer))

  if (width) {
    image = image.resize({ width })
  }

  image = image.toFormat(format)

  const processedBuffer = await image.toBuffer()
  event.node.res.setHeader('Content-Type', `image/${format}`)
  return processedBuffer
})
