export function useHostDetection() {
  const detectHost = (): string => {
    if (process.client) {
      return window.location.host
    }

    if (process.server) {
      const event = useRequestEvent()

      return event.node.req.headers.host as string
    }

    return 'localhost'
  }

  return {
    detectHost,
  }
}
