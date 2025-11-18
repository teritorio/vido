import { Buffer } from 'node:buffer'

export default defineEventHandler(async (event) => {
  const url = getQuery(event).url as string
  const project = getQuery(event).project as string

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

  return Buffer.from(await response.arrayBuffer())
})
