import { createServer } from 'miragejs'

import config from '../__mocks__/config.json'

export function makeServer() {
  createServer({
    routes() {
      this.namespace = '/api'

      this.get('/config', () => config)

      this.passthrough()

      this.passthrough('https://vecto.teritorio.xyz/**')
      this.passthrough('https://vecto-dev.teritorio.xyz/**')
      this.passthrough('https://demov2.teritorio.xyz/**')

      /**
       * Needed because responseType is not set correctly in Mirages passthrough
       * See https://github.com/miragejs/miragejs/issues/683
       */
      if (
        typeof window !== 'undefined' &&
        // eslint-disable-next-line no-prototype-builtins
        !window.Request.prototype.hasOwnProperty('signal')
      ) {
        // @ts-ignore
        window.Request.prototype.signal = undefined
      }

      const oldPassthroughRequests = this.pretender?.passthroughRequest.bind(
        this.pretender
      )

      // @ts-ignore
      this.pretender?.passthroughRequest = (verb, path, request) => {
        if (verb === 'GET' && path.match(/\.png|\.pbf/)) {
          request.responseType = 'arraybuffer'
        }
        return oldPassthroughRequests(verb, path, request)
      }
    },
  })
}
