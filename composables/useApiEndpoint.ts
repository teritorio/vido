export default function useApiEndpoint() {
  const config = useRuntimeConfig()

  const apiEndpoint = computed(() => {
    if (config.public.apiEndpoint)
      return config.public.apiEndpoint

    if (process.client) {
      const protocol = window.location.protocol
      const host = window.location.host

      return `${protocol}//${host}`
    }
    else {
      const event = useRequestEvent()

      if (event) {
        const host = event.node.req.headers['x-forwarded-host'] || event.node.req.headers.host
        const protocol = event.node.req.headers['x-forwarded-proto'] || 'http'

        return `${protocol}://${host}`
      }

      return '/'
    }
  })

  return {
    apiEndpoint,
  }
}
