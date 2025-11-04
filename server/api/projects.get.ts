import type { Settings } from '~/lib/apiSettings'

export default defineEventHandler(async () => {
  const { apiEndpoint } = useRuntimeConfig().public

  if (!apiEndpoint || typeof apiEndpoint !== 'string') {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing API endpoint',
    })
  }

  try {
    const projects: Record<string, Settings> = await $fetch(apiEndpoint)

    return projects
  }
  catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to fetch projects',
    })
  }
})
