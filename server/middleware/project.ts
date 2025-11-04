export default defineEventHandler((event) => {
  const { appHost } = useRuntimeConfig().public
  const url = getRequestURL(event)

  if (event.node.req.headers.host === appHost && url.pathname !== '/projects') {
    return sendRedirect(event, '/projects', 302)
  }
})
