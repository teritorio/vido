import { createServer } from 'miragejs'

import config from '../__mocks__/config.json'

export function makeServer() {
  createServer({
    routes() {
      this.passthrough('https://vecto.teritorio.xyz/**')

      this.namespace = '/api'

      this.get('/config', () => config)
    },
  })
}
