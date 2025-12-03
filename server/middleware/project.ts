export default defineEventHandler((event) => {
  const { appHost } = useRuntimeConfig().public
  const host = getHeader(event, 'host')

  if (event.path === '/projects' && host !== appHost) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    })
  }

  const url = getRequestURL(event)

  if (event.node.req.originalUrl !== '/api/config' && event.node.req.headers.host === appHost && url.pathname !== '/projects') {
    return sendRedirect(event, '/projects', 302)
  }
})
