export default defineEventHandler((event) => {
  const host = getRequestHost(event)
  const headers = getRequestHeaders(event)
  const { appHost, appTheme, appProject } = useRuntimeConfig().public

  if (headers['x-vido-project'] && headers['x-vido-theme']) {
    return {
      project: headers['x-vido-project'],
      theme: headers['x-vido-theme'],
    }
  }
  else if (host.endsWith(`.${appHost}`)) {
    const [subdomain, ..._rest] = host.split('.')
    const [theme, project] = subdomain.split('-')
    return {
      project,
      theme,
    }
  }
  else if (appProject && appTheme) {
    return {
      project: appProject,
      theme: appTheme,
    }
  }
  else {
    throw createError({ statusCode: 500, message: 'Missing project & theme.', fatal: true })
  }
})
