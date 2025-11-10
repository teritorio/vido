export default defineEventHandler((event) => {
  const headers = getRequestHeaders(event)
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
    // API_ENDPOINT = req host (ex: https//cartelandes.com)
    return {
      project: headers['x-vido-project'],
      theme: headers['x-vido-theme'],
      api: `${host}${apiPath}${headers['x-vido-project']}/${headers['x-vido-theme']}`,
    }
  }

  if (appHost && host.endsWith(`.${appHost}`)) {
    // ex: tourism-seignanx.elasa.teritorio.xyz
    // API_ENDPOINT = req host
    // ex: tourism-seignanx.localtest.me:3000
    // API_ENDPOINT = process.env.NUXT_PUBLIC_GENERIC_API_ENDPOINT
    const subdomain = host.slice(0, -(appHost.length + 1))
    const [theme, project] = subdomain.split('-', 2)

    if (theme && project) {
      return {
        project,
        theme,
        api: import.meta.dev
          ? `${genericApiEndpoint.replace('https://', `https://${theme}-${project}.`)}/${project}/${theme}`
          : `${host}${apiPath}${project}/${theme}`,
      }
    }
  }

  if (appProject && appTheme) {
    // ex: localhost:3000
    // API_ENDPOINT = process.env.NUXT_PUBLIC_GENERIC_API_ENDPOINT
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
