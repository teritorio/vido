export default defineEventHandler((event) => {
  const headers = getRequestHeaders(event)
  const protocol = getRequestProtocol(event)
  const host = headers['x-client-host']
  const apiPath = '/api/0.1/'

  if (!host) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing \'x-client-side\' header',
    })
  }

  const { appHost, appTheme, appProject, genericApiEndpoint } = useRuntimeConfig().public

  if (headers['x-vido-project'] && headers['x-vido-theme']) {
    return {
      project: headers['x-vido-project'],
      theme: headers['x-vido-theme'],
      api: `${protocol}://${host}${apiPath}${headers['x-vido-project']}/${headers['x-vido-theme']}`,
    }
  }

  if (appHost && host.endsWith(`.${appHost}`)) {
    const subdomain = host.slice(0, -(appHost.length + 1))
    const [theme, project] = subdomain.split('-', 2)

    if (theme && project) {
      return {
        project,
        theme,
        api: import.meta.dev
          ? `${genericApiEndpoint.replace('https://', `https://${theme}-${project}.`)}/${project}/${theme}`
          : `${protocol}://${host}${apiPath}${project}/${theme}`,
      }
    }
  }

  if (appProject && appTheme) {
    return {
      project: appProject,
      theme: appTheme,
      api: `${genericApiEndpoint}${apiPath}${appProject}/${appTheme}`,
    }
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Configuration Error',
  })
})
