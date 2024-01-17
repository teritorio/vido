import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineEventHandler } from 'h3'
import { rest } from 'msw'
import type { SetupServer } from 'msw/node'
import { setupServer } from 'msw/node'

let server: SetupServer | undefined

function cypressSetMocks(
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) {
  const chunks: any = []
  req.on('data', (chunk) => {
    chunks.push(chunk)
  })

  req.on('end', () => {
    if (server) {
      server.close()
      console.error('Cypress mock service stoped')
    }

    if (chunks) {
      const json = Buffer.concat(chunks).toString()
      const mocks = JSON.parse(json) as {
        method: string
        url: string
        statusCode: number
        body: object
      }[]
      const rests = mocks.map((mock) => {
        return rest.get(mock.url, (req, res, ctx) => res(ctx.json(mock.body)))
      })

      server = setupServer(...rests)
      server.listen({
        onUnhandledRequest: ({ method, url }) => {
          console.error(`Cypress mock unhandled ${method} request to ${url}`)
        },
      })
      console.error('Cypress mock service started')
      server.printHandlers()
    }

    res.statusCode = 200
    res.end()
  })
}

export default defineEventHandler((event) => {
  if (process.env.dev || process.env.CYPRESS)
    cypressSetMocks(event.node.req, event.node.res)
})
