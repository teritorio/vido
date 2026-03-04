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

  const domain = new URL(url).host
  const defaultDomains = ['api.panoramax.xyz']
  // @ts-expect-error: can't declare the interface
  const allowedDomains: string[] = [...defaultDomains, ...(globalThis.allowedDomains[project] || [])]

  const encodedUrl = encodeURI(url)

  if (!allowedDomains.includes(domain)) {
    return sendRedirect(event, encodedUrl)
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return sendRedirect(event, encodedUrl)
    }

    const arrayBuffer = await response.arrayBuffer()
    let image = sharp(Buffer.from(arrayBuffer))

    // Get original image metadata
    const metadata = await image.metadata()

    // Only resize if width is specified AND original is larger than requested
    if (width && metadata.width && metadata.width > width) {
      image = image.resize({ width })
    }

    image = image.toFormat(format)

    const processedBuffer = await image.toBuffer()
    event.node.res.setHeader('Content-Type', `image/${format}`)
    return processedBuffer
  }
  catch {
    return sendRedirect(event, encodedUrl)
  }
})
