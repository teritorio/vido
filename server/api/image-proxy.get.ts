import { Buffer } from 'node:buffer'

export default defineEventHandler(async (event) => {
  const url = getQuery(event).url as string

  if (!url)
    throw createError({ statusCode: 400, message: 'Missing URL' })

  const domain = new URL(url).hostname
  // @ts-expect-error: can't declare the interface
  const allowedDomains: string[] = globalThis.allowedDomains || []

  if (!allowedDomains.includes(domain)) {
    throw createError({ statusCode: 403, message: 'Domain not allowed' })
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: `Failed to fetch image from ${domain}` })
  }

  return Buffer.from(await response.arrayBuffer())
})
