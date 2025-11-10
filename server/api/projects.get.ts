import type { Settings } from '~/lib/apiSettings'

export default defineEventHandler(async () => {
  const { genericApiEndpoint } = useRuntimeConfig().public

  if (!genericApiEndpoint || typeof genericApiEndpoint !== 'string') {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing API endpoint',
    })
  }

  try {
    const projects: Record<string, Settings> = await $fetch(genericApiEndpoint)

    return projects
  }
  catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to fetch projects',
    })
  }
})
