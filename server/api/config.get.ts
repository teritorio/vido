export default defineEventHandler((event) => {
  const headers = getRequestHeaders(event)
  const host = headers['x-client-host']

  if (!host) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing \'x-client-side\' header',
    })
  }

  const { appHost, appTheme, appProject } = useRuntimeConfig().public

  if (headers['x-vido-project'] && headers['x-vido-theme']) {
    return {
      project: headers['x-vido-project'],
      theme: headers['x-vido-theme'],
    }
  }

  if (appHost && host.endsWith(`.${appHost}`)) {
    const subdomain = host.slice(0, -(appHost.length + 1))
    const [theme, project] = subdomain.split('-', 2)

    if (theme && project) {
      return {
        project,
        theme,
      }
    }
  }

  if (appProject && appTheme) {
    return {
      project: appProject,
      theme: appTheme,
    }
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Configuration Error',
  })
})
